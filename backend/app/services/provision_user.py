import random
import hashlib
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import User, Account, Setting, Transaction, LifeEvent, AIRecommendation, Notification, TrustLedgerEntry
from app.services.personas import PERSONAS

async def provision_user(db: AsyncSession, user: User):
    # 1. Deterministic Seed Generation
    seed_source = f"{user.id}-{user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    r = random.Random(seed_int)

    # 2. Select Persona
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    
    # Special override for Aarav Sharma
    is_aarav = (user.email.lower() == "aarav.sharma@idbi.co.in")
    if is_aarav:
        persona_name = "Experienced Salaried Employee"
        
    persona = PERSONAS[persona_name]

    # Save Setting first (or concurrently)
    setting = Setting(
        user_id=user.id,
        language="English",
        notifications_enabled=True,
        biometrics_enabled=False
    )
    db.add(setting)

    # 3. Generate Transactions first (over the last 180 days)
    # Determine base parameters
    min_sal, max_sal = persona["salary_range"]
    salary_amount = float(r.randint(min_sal, max_sal))
    if is_aarav:
        salary_amount = 85000.0

    # Start date = 180 days ago
    start_date = datetime.now(timezone.utc) - timedelta(days=180)
    
    # Track balances chronologically
    savings_bal = float(r.randint(150000, 300000))
    salary_bal = 10000.0
    cc_bal = 0.0
    fd_bal = float(r.randint(100000, 300000))
    
    if is_aarav:
        # Starting balances set so that final balances match exactly
        savings_bal = 400000.0
        salary_bal = 5000.0
        cc_bal = 0.0
        fd_bal = 300000.0

    transactions_to_add = []
    
    # Generate transactions month-by-month
    for month_idx in range(6):
        month_start_day = 180 - (month_idx * 30)
        
        # A. Salary Credit on the 1st of each month (approx. days 180, 150, 120, 90, 60, 30 ago)
        salary_date = start_date + timedelta(days=(month_idx * 30))
        t_salary = Transaction(
            sender_id=None,
            receiver_id=user.id,
            sender_name=persona["recurring_merchants"]["Salary"],
            receiver_name=user.name,
            amount=salary_amount,
            type="transfer",
            merchant=persona["recurring_merchants"]["Salary"],
            category="Salary",
            timestamp=salary_date,
            status="Success"
        )
        transactions_to_add.append(t_salary)
        salary_bal += salary_amount

        # B. Rent payment on the 3rd of each month
        rent_date = salary_date + timedelta(days=2)
        rent_amount = float(r.randint(12000, 20000)) if not is_aarav else 15000.0
        t_rent = Transaction(
            sender_id=user.id,
            receiver_id=None,
            sender_name=user.name,
            receiver_name="Home Rental",
            amount=rent_amount,
            type="pay-bill",
            merchant="Home Rental",
            category="Utilities",
            timestamp=rent_date,
            status="Success"
        )
        transactions_to_add.append(t_rent)
        savings_bal -= rent_amount

        # C. Mutual Fund SIP on the 5th of each month
        sip_date = salary_date + timedelta(days=4)
        inv_merchants = persona["recurring_merchants"]["Investment"]
        sip_merchant = inv_merchants[r.randint(0, len(inv_merchants) - 1)]
        sip_amount = float(r.randint(5000, 15000)) if not is_aarav else 25000.0
        if is_aarav:
            sip_merchant = "Axis Bluechip Mutual Fund"
            
        t_sip = Transaction(
            sender_id=user.id,
            receiver_id=None,
            sender_name=user.name,
            receiver_name=sip_merchant,
            amount=sip_amount,
            type="transfer",
            merchant=sip_merchant,
            category="Investment",
            timestamp=sip_date,
            status="Success"
        )
        transactions_to_add.append(t_sip)
        savings_bal -= sip_amount

        # D. Electricity Bill on the 12th of each month
        elec_date = salary_date + timedelta(days=11)
        elec_amount = float(r.randint(1200, 3000)) if not is_aarav else 1840.0
        t_elec = Transaction(
            sender_id=user.id,
            receiver_id=None,
            sender_name=user.name,
            receiver_name="BESCOM Electricity" if not is_aarav else "BESCOM",
            amount=elec_amount,
            type="pay-bill",
            merchant="BESCOM Electricity" if not is_aarav else "BESCOM",
            category="Utilities",
            timestamp=elec_date,
            status="Success"
        )
        transactions_to_add.append(t_elec)
        savings_bal -= elec_amount

        # E. Subscriptions monthly (Netflix on the 8th, Spotify on the 18th)
        if "Entertainment" in persona["recurring_merchants"]:
            sub_date = salary_date + timedelta(days=7)
            t_sub = Transaction(
                sender_id=user.id,
                receiver_id=None,
                sender_name=user.name,
                receiver_name="Netflix",
                amount=649.0,
                type="pay-bill",
                merchant="Netflix",
                category="Entertainment",
                timestamp=sub_date,
                status="Success"
            )
            transactions_to_add.append(t_sub)
            cc_bal += 649.0

        # F. Discretionary spending (Food, Shopping, Travel) spread randomly
        for week in range(4):
            # 2 random transactions per week
            for tx_idx in range(2):
                days_offset = week * 7 + r.randint(0, 6)
                tx_time = salary_date + timedelta(days=days_offset, hours=r.randint(9, 21))
                
                # Pick category
                cats = ["Food", "Shopping", "Travel"]
                cat = cats[r.randint(0, len(cats) - 1)]
                
                if cat == "Food":
                    merchant = persona["recurring_merchants"]["Food"][r.randint(0, len(persona["recurring_merchants"]["Food"]) - 1)]
                    amount = float(r.randint(150, 1000))
                    if is_aarav and month_idx == 5 and week == 3: # Match the Aarav Swiggy transaction
                        merchant = "Swiggy"
                        amount = 420.0
                        
                    t_food = Transaction(
                        sender_id=user.id,
                        receiver_id=None,
                        sender_name=user.name,
                        receiver_name=merchant,
                        amount=amount,
                        type="scan-pay",
                        merchant=merchant,
                        category="Food",
                        timestamp=tx_time,
                        status="Success"
                    )
                    transactions_to_add.append(t_food)
                    savings_bal -= amount
                    
                elif cat == "Shopping":
                    merchant = persona["recurring_merchants"]["Shopping"][r.randint(0, len(persona["recurring_merchants"]["Shopping"]) - 1)]
                    amount = float(r.randint(300, 3000))
                    t_shop = Transaction(
                        sender_id=user.id,
                        receiver_id=None,
                        sender_name=user.name,
                        receiver_name=merchant,
                        amount=amount,
                        type="scan-pay",
                        merchant=merchant,
                        category="Shopping",
                        timestamp=tx_time,
                        status="Success"
                    )
                    transactions_to_add.append(t_shop)
                    cc_bal += amount
                    
                elif cat == "Travel":
                    merchant = persona["recurring_merchants"]["Travel"][r.randint(0, len(persona["recurring_merchants"]["Travel"]) - 1)]
                    amount = float(r.randint(100, 800))
                    t_travel = Transaction(
                        sender_id=user.id,
                        receiver_id=None,
                        sender_name=user.name,
                        receiver_name=merchant,
                        amount=amount,
                        type="scan-pay",
                        merchant=merchant,
                        category="General",
                        timestamp=tx_time,
                        status="Success"
                    )
                    transactions_to_add.append(t_travel)
                    savings_bal -= amount

        # G. Monthly Credit Card payment on the 28th
        if cc_bal > 0.0:
            cc_pay_date = salary_date + timedelta(days=27)
            t_cc_pay = Transaction(
                sender_id=user.id,
                receiver_id=None,
                sender_name=user.name,
                receiver_name="IDBI Credit Card Payment",
                amount=cc_bal,
                type="pay-bill",
                merchant="IDBI Credit Card Payment",
                category="Utilities",
                timestamp=cc_pay_date,
                status="Success"
            )
            transactions_to_add.append(t_cc_pay)
            savings_bal -= cc_bal
            cc_bal = 0.0

    # Ensure final balances for Aarav are exactly the original values
    if is_aarav:
        savings_bal = 482350.45
        salary_bal = 85400.00
        cc_bal = 18420.00
        fd_bal = 300000.00
    else:
        # Ensure we have some realistic Credit Card balance at the end of the history
        cc_bal = float(r.randint(5000, 25000))

    # Add all generated transactions to DB
    db.add_all(transactions_to_add)

    # 4. Provision dynamic accounts
    acc_savings = Account(
        user_id=user.id,
        account_number=f"10{r.randint(10000000, 99999999)}",
        balance=round(savings_bal, 2),
        account_type="Savings"
    )
    acc_salary = Account(
        user_id=user.id,
        account_number=f"20{r.randint(10000000, 99999999)}",
        balance=round(salary_bal, 2),
        account_type="Salary"
    )
    acc_cc = Account(
        user_id=user.id,
        account_number=f"30{r.randint(10000000, 99999999)}",
        balance=round(cc_bal, 2),
        account_type="Credit Card"
    )
    acc_fd = Account(
        user_id=user.id,
        account_number=f"40{r.randint(10000000, 99999999)}",
        balance=round(fd_bal, 2),
        account_type="Fixed Deposit"
    )
    db.add_all([acc_savings, acc_salary, acc_cc, acc_fd])

    # 5. Provision Predicted Life Events
    for idx, goal in enumerate(persona["life_goals"]):
        le = LifeEvent(
            user_id=user.id,
            title=goal["title"],
            confidence=goal["confidence"],
            prediction_date=goal["prediction_date"] if not (is_aarav and idx == 0) else "Mar 2026",
            explanation=goal["explanation"]
        )
        db.add(le)

    # 6. Provision AI Recommendations (with complete explainability details)
    # R1: Increase SIP
    sip_inc = 3000 if not is_aarav else 3000
    r1 = AIRecommendation(
        user_id=user.id,
        title=f"Increase SIP by ₹{sip_inc}",
        description=f"You're closer to your Home Purchase goal. Consider increasing your monthly mutual fund SIP by ₹{sip_inc} to reach your target earlier.",
        reasoning="Your current surplus savings rate leaves idle liquidity in your savings account yielding low interest returns. Re-directing surplus to mutual funds compounding growth will increase overall expected portfolio returns.",
        alternative_options="1. Direct the surplus to a 1-year Fixed Deposit at 7.2% interest.\n2. Keep funds in your high-interest savings account (4% p.a.).",
        impact=f"Expected returns increase by ₹38,400 over the goal duration, and you reach your target in {goal['prediction_date']} instead of July 2027.",
        confidence_score=92,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(r1)

    # R2: Optimize expenses or Emergency fund
    r2 = AIRecommendation(
        user_id=user.id,
        title="Top-up Emergency Fund",
        description="We recommend maintaining 6 months of expenses as a buffer. Transfer ₹15,000 to Fixed Deposit.",
        reasoning="Based on your monthly average expenses, your target emergency fund should be larger. Current savings leave you slightly exposed to sudden cash outflows.",
        alternative_options="1. Direct surplus to short term debt mutual funds.\n2. Set up automated monthly sweep of ₹5,000.",
        impact="Full financial cushion achieved, providing peace of mind against unexpected life events.",
        confidence_score=85,
        timestamp=datetime.now(timezone.utc) - timedelta(days=2)
    )
    db.add(r2)

    # 7. Seed Initial Trust Ledger entries (representing user audits)
    tl_created = TrustLedgerEntry(
        user_id=user.id,
        action_type="PROFILE_CREATED",
        title="Dynamic Onboarding Profile Provisioned",
        description=f"Personalized dataset generated for user using financial persona '{persona_name}'.",
        reasoning="Onboarding engine executed successfully based on deterministic SHA256 email hash seed.",
        alternative_options="None",
        impact="Created 4 accounts, 25-40 transactions, 2 life goals, and settings.",
        confidence_score=100,
        timestamp=datetime.now(timezone.utc) - timedelta(days=1)
    )
    tl_login = TrustLedgerEntry(
        user_id=user.id,
        action_type="LOGIN",
        title="User Registered Successfully",
        description="Newly registered user profile verified and session tokens issued.",
        reasoning="Registration validation complete.",
        alternative_options="None",
        impact="Onboarding completed.",
        confidence_score=100,
        timestamp=datetime.now(timezone.utc)
    )
    db.add_all([tl_created, tl_login])

    # 8. Seed Onboarding Notifications
    notif_welcome = Notification(
        user_id=user.id,
        title="Welcome to IDBI BANK Life Moments AI!",
        message=f"Welcome {user.name}! Your dynamic onboarding profile has been provisioned under the '{persona_name}' persona. Check out your Trust Ledger to see the details.",
        read=False,
        timestamp=datetime.now(timezone.utc)
    )
    notif_salary = Notification(
        user_id=user.id,
        title="Salary Credited",
        message=f"Your monthly salary of ₹{salary_amount:,.2f} from {persona['recurring_merchants']['Salary']} has been credited.",
        read=False,
        timestamp=datetime.now(timezone.utc) - timedelta(hours=2)
    )
    notif_recommendation = Notification(
        user_id=user.id,
        title="New AI Insights Available",
        message=f"We've generated {persona['name']}-specific financial recommendations in your Trust Ledger.",
        read=False,
        timestamp=datetime.now(timezone.utc) - timedelta(hours=4)
    )
    db.add_all([notif_welcome, notif_salary, notif_recommendation])
