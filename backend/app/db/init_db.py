import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy.future import select
from app.db.session import engine, Base, async_session
from app.models.models import User, Account, Transaction, LifeEvent, AIRecommendation, Offer, Setting
from app.core.security import get_password_hash

async def seed_data(session):
    # Check if we already have users
    result = await session.execute(select(User).filter_by(email="aarav.sharma@idbi.co.in"))
    existing_user = result.scalars().first()
    if existing_user:
        print("Database already seeded.")
        return

    print("Seeding mock database...")
    
    # 1. Create User
    user = User(
        name="Aarav Sharma",
        email="aarav.sharma@idbi.co.in",
        password_hash=get_password_hash("demo1234"),
        phone="+91 98765 43210",
        role="Customer"
    )
    session.add(user)
    await session.flush() # get user.id

    # 2. Create Accounts
    acc1 = Account(
        user_id=user.id,
        account_number="1234567890",
        balance=482350.45,
        account_type="Savings"
    )
    acc2 = Account(
        user_id=user.id,
        account_number="9876542210",
        balance=85400.00,
        account_type="Salary"
    )
    acc3 = Account(
        user_id=user.id,
        account_number="5544332211",
        balance=18420.00,
        account_type="Credit Card"
    )
    acc4 = Account(
        user_id=user.id,
        account_number="6677889900",
        balance=300000.00,
        account_type="Fixed Deposit"
    )
    session.add_all([acc1, acc2, acc3, acc4])

    # 3. Create Settings
    settings = Setting(
        user_id=user.id,
        language="English",
        notifications_enabled=True,
        biometrics_enabled=False
    )
    session.add(settings)

    # 4. Create Transactions
    t1 = Transaction(
        sender_id=None,
        receiver_id=user.id,
        sender_name="HDFC Payroll",
        receiver_name="Aarav Sharma",
        amount=85000.0,
        type="transfer",
        merchant="HDFC Payroll",
        category="Salary",
        timestamp=datetime.now(timezone.utc),
        status="Success"
    )
    t2 = Transaction(
        sender_id=user.id,
        receiver_id=None,
        sender_name="Aarav Sharma",
        receiver_name="Swiggy",
        amount=420.0,
        type="pay-bill",
        merchant="Swiggy",
        category="Food",
        timestamp=datetime.now(timezone.utc),
        status="Success"
    )
    t3 = Transaction(
        sender_id=user.id,
        receiver_id=None,
        sender_name="Aarav Sharma",
        receiver_name="BESCOM",
        amount=1840.0,
        type="pay-bill",
        merchant="BESCOM",
        category="Utilities",
        timestamp=datetime.now(timezone.utc) - timedelta(days=1),
        status="Success"
    )
    t4 = Transaction(
        sender_id=user.id,
        receiver_id=None,
        sender_name="Aarav Sharma",
        receiver_name="Axis Bluechip",
        amount=25000.0,
        type="transfer",
        merchant="Axis Bluechip Mutual Fund",
        category="Investment",
        timestamp=datetime.now(timezone.utc) - timedelta(days=1),
        status="Success"
    )
    session.add_all([t1, t2, t3, t4])

    # 5. Create Life Events
    le1 = LifeEvent(
        user_id=user.id,
        title="Home Purchase",
        confidence=92,
        prediction_date="Mar 2026",
        explanation="You are financially on track! We predicted this event based on your monthly savings pattern and mutual fund deposits."
    )
    le2 = LifeEvent(
        user_id=user.id,
        title="Higher Education",
        confidence=78,
        prediction_date="Sep 2027",
        explanation="Based on your regular deposits to an educational goals account and your search history for executive MBA programs."
    )
    session.add_all([le1, le2])

    # 6. Create AI Recommendations
    r1 = AIRecommendation(
        user_id=user.id,
        title="Increase SIP by ₹3,000",
        description="You're 20% closer to your Home Purchase goal. Consider increasing your monthly mutual fund SIP by ₹3,000 to reach your target 4 months earlier.",
        reasoning="Your current surplus savings rate of ₹45,000/month leaves idle liquidity that yields low returns in your current account. Increasing mutual fund SIP increases expected portfolio compound growth.",
        alternative_options="1. Direct the surplus to a 1-year Fixed Deposit at 7.2% interest.\n2. Keep funds in your high-interest savings account (4% p.a.).",
        impact="Expected returns increase by ₹38,400 over the goal duration, and you reach your target in March 2026 instead of July 2026.",
        confidence_score=92,
        timestamp=datetime.now(timezone.utc)
    )
    session.add(r1)

    # 7. Create Offers
    o1 = Offer(
        title="IDBI BANK Cashback Card",
        description="Get 5% unlimited cashback on online shopping and 1% on offline purchases. Free airport lounge access included.",
        eligibility="Available for premium customers with balance > ₹2,00,000"
    )
    o2 = Offer(
        title="Pre-Approved Personal Loan",
        description="Avail up to ₹1,000,000 at a special interest rate of 10.5% with zero processing fee and instant disbursal.",
        eligibility="Premium Customer Status with consistent monthly salary credits"
    )
    session.add_all([o1, o2])

    await session.commit()
    print("Database seeding completed.")

async def init_db():
    async with engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session() as session:
        await seed_data(session)

if __name__ == "__main__":
    asyncio.run(init_db())
