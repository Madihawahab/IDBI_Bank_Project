from typing import List, Dict, Any

class OfferEngine:
    @staticmethod
    def generate_offers(analytics: Dict[str, Any], life_events: List[Any], user_name: str) -> List[Dict[str, Any]]:
        offers = []
        
        income_this_month = analytics.get("income_this_month", 0.0)
        if income_this_month >= 150000.0:
            offers.append({
                "id": 1,
                "title": "IDBI BANK Royal Credit Card",
                "description": "Get premium airport lounge access, 2% cashback on all transactions, and luxury hotel membership benefits.",
                "eligibility": f"Eligible because your monthly income is ₹{income_this_month:,.2f}, exceeding the ₹1,50,000 threshold.",
                "headline": "2% Unlimited Cashback on All Spends",
                "savings": "₹15,000/yr",
                "reasoning": f"Based on your high monthly income level of ₹{income_this_month:,.2f} and excellent credit profile, you qualify for our highest tier card.",
                "confidence_score": 95,
                "cta_text": "Upgrade Card"
            })
        elif income_this_month >= 70000.0:
            offers.append({
                "id": 2,
                "title": "IDBI BANK Cashback Card",
                "description": "Get 5% unlimited cashback on online shopping and 1% on offline purchases. Free airport lounge access included.",
                "eligibility": f"Eligible because your monthly income of ₹{income_this_month:,.2f} is in the premium customer bracket.",
                "headline": "5% Unlimited Online Cashback",
                "savings": "₹8,000/yr",
                "reasoning": "Online shopping transaction logs indicate high potential cashback yields with our dedicated digital card.",
                "confidence_score": 92,
                "cta_text": "Apply Cashback Card"
            })
        else:
            offers.append({
                "id": 2,
                "title": "IDBI BANK Cashback Card",
                "description": "Get 5% unlimited cashback on online shopping and 1% on offline purchases. Free airport lounge access included.",
                "eligibility": "Eligible for premium customer accounts with consistent monthly salary credits.",
                "headline": "5% Unlimited Online Cashback",
                "savings": "₹4,000/yr",
                "reasoning": "Consistent salary flows qualify you for pre-approved shopping cashback benefits.",
                "confidence_score": 85,
                "cta_text": "Apply Cashback Card"
            })

        fd_bal = analytics.get("fixed_deposit_balance", 0.0)
        if fd_bal >= 500000.0:
            offers.append({
                "id": 3,
                "title": "Wealth Management Advisory",
                "description": "Access dedicated wealth managers, custom portfolios, and zero-fee premium trading accounts.",
                "eligibility": f"Eligible because your Fixed Deposit balance is ₹{fd_bal:,.2f}, exceeding the HNI ₹5,00,000 threshold.",
                "headline": "Zero Brokerage Premium Advisory",
                "savings": "₹24,000/yr",
                "reasoning": "Your substantial idle cash reserves in fixed assets qualify you for tailored investment compounding guides.",
                "confidence_score": 90,
                "cta_text": "Unlock Advisory"
            })

        home_goal = next((le for le in life_events if "home" in le.title.lower() or "villa" in le.title.lower() or "purchase" in le.title.lower()), None)
        if home_goal:
            offers.append({
                "id": 4,
                "title": "Home Loan Booster",
                "description": "Avail a special home loan interest rate of 8.4% with zero processing fee and instant processing for your upcoming home purchase.",
                "eligibility": f"Recommended based on your predicted '{home_goal.title}' goal set for {home_goal.prediction_date}.",
                "headline": "8.4% Special Home Loan Rate",
                "savings": "₹45,000 interest",
                "reasoning": "Designed to optimize borrowing costs for your upcoming residential property milestone in 2026.",
                "confidence_score": 96,
                "cta_text": "Check Home Eligibility"
            })

        investment_total = analytics.get("investments_total", 0.0)
        if investment_total >= 300000.0:
            offers.append({
                "id": 5,
                "title": "Portfolio Advisory Services",
                "description": "Get automated portfolio rebalancing advice and tax-saving investment recommendations.",
                "eligibility": f"Eligible because your total investment is ₹{investment_total:,.2f}, exceeding the investment threshold.",
                "headline": "Automated Tax-Saving Rebalancing",
                "savings": "₹12,500/yr",
                "reasoning": "Reallocating current equity-skewed investments to ELSS mutual funds can unlock higher tax exemptions.",
                "confidence_score": 88,
                "cta_text": "Verify Portfolio"
            })
            
        if analytics.get("credit_card_balance", 0.0) > 30000.0:
            offers.append({
                "id": 6,
                "title": "IDBI Travel Signature Card",
                "description": "Earn 5x reward points on travel bookings and fuel. Free airport lounge access included.",
                "eligibility": "Recommended due to active travel spending categories and credit profile.",
                "headline": "5x Rewards on Travel Bookings",
                "savings": "₹10,000/yr",
                "reasoning": "Frequent travel patterns show significant reward multipliers under signature tier bookings.",
                "confidence_score": 85,
                "cta_text": "Get Travel Card"
            })

        # New dynamic offer 8: Trip Forex Card
        trip_goal = next((le for le in life_events if any(k in le.title.lower() for k in ["trip", "travel", "vacation", "paris", "international"])), None)
        if trip_goal:
            offers.append({
                "id": 8,
                "title": "IDBI Multi-Currency Forex Card",
                "description": "Zero cross-currency markup fees, free international ATM withdrawals, and emergency cash assistance.",
                "eligibility": f"Recommended based on your predicted '{trip_goal.title}' goal set for {trip_goal.prediction_date}.",
                "headline": "Zero Forex Markup Fee",
                "savings": "₹8,000 saved",
                "reasoning": "Hedge exchange rate volatility and avoid standard 3.5% transaction markups during your trip.",
                "confidence_score": 89,
                "cta_text": "Get Forex Card"
            })

        # New dynamic offer 9: Wedding Festivities Flexi-Loan
        wedding_goal = next((le for le in life_events if any(k in le.title.lower() for k in ["wedding", "marriage"])), None)
        if wedding_goal:
            offers.append({
                "id": 9,
                "title": "IDBI Festivities Flexi-Loan",
                "description": "Avail low interest rate of 9.5% with flexible repayment options to fund your wedding event preparations.",
                "eligibility": f"Recommended based on your predicted '{wedding_goal.title}' goal set for {wedding_goal.prediction_date}.",
                "headline": "9.5% Special Interest Rate",
                "savings": "₹35,000 interest",
                "reasoning": "A short-term liquid line allows you to pay vendor deposits without liquidating high-yielding assets.",
                "confidence_score": 93,
                "cta_text": "Check Flexi Limit"
            })

        # New offer 10: Tax Saver FD (Always available)
        offers.append({
            "id": 10,
            "title": "IDBI Tax Saver Fixed Deposit",
            "description": "Earn guaranteed 7.5% p.a. while claiming tax deductions up to ₹1.5L under Section 80C.",
            "eligibility": "Pre-approved based on your premium customer status.",
            "headline": "Save up to ₹46,800 in tax",
            "savings": "₹46,800/yr",
            "reasoning": "Maximize your Section 80C benefits while locking in guaranteed yields before rate fluctuations.",
            "confidence_score": 86,
            "cta_text": "Open Tax FD"
        })

        # New offer 11: Smart SIP Booster (Always available)
        offers.append({
            "id": 11,
            "title": "IDBI Smart SIP Booster",
            "description": "Automated incremental SIP sweep-in to top-rated mutual funds with zero advisory fees.",
            "eligibility": "Pre-approved based on your positive monthly cash flow surplus.",
            "headline": "Automated SIP Compounding",
            "savings": "₹18,000/yr",
            "reasoning": "Redirecting ₹5,000 from your idle monthly surplus into dynamic equity compounding yields optimal growth.",
            "confidence_score": 94,
            "cta_text": "Boost SIP Now"
        })
            
        if len(offers) < 2:
            offers.append({
                "id": 7,
                "title": "Pre-Approved Personal Loan",
                "description": "Avail up to ₹1,000,000 at a special interest rate of 10.5% with zero processing fee and instant disbursal.",
                "eligibility": "Premium Customer Status with consistent monthly salary credits.",
                "headline": "Instant Disbursal up to ₹10L",
                "savings": "₹22,000 interest",
                "reasoning": "Pre-screened debt capacity enables low-risk instant liquidity buffering.",
                "confidence_score": 82,
                "cta_text": "Check Pre-Approved Limit"
            })

        return offers
