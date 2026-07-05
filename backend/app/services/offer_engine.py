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
                "eligibility": f"Eligible because your monthly income is ₹{income_this_month:,.2f}, exceeding the ₹1,50,000 threshold."
            })
        elif income_this_month >= 70000.0:
            offers.append({
                "id": 2,
                "title": "IDBI BANK Cashback Card",
                "description": "Get 5% unlimited cashback on online shopping and 1% on offline purchases. Free airport lounge access included.",
                "eligibility": f"Eligible because your monthly income of ₹{income_this_month:,.2f} is in the premium customer bracket."
            })
        else:
            offers.append({
                "id": 2,
                "title": "IDBI BANK Cashback Card",
                "description": "Get 5% unlimited cashback on online shopping and 1% on offline purchases. Free airport lounge access included.",
                "eligibility": "Eligible for premium customer accounts with consistent monthly salary credits."
            })

        fd_bal = analytics.get("fixed_deposit_balance", 0.0)
        if fd_bal >= 500000.0:
            offers.append({
                "id": 3,
                "title": "Wealth Management Advisory",
                "description": "Access dedicated wealth managers, custom portfolios, and zero-fee premium trading accounts.",
                "eligibility": f"Eligible because your Fixed Deposit balance is ₹{fd_bal:,.2f}, exceeding the HNI ₹5,00,000 threshold."
            })

        home_goal = next((le for le in life_events if "home" in le.title.lower() or "villa" in le.title.lower() or "purchase" in le.title.lower()), None)
        if home_goal:
            offers.append({
                "id": 4,
                "title": "Home Loan Booster",
                "description": "Avail a special home loan interest rate of 8.4% with zero processing fee and instant processing for your upcoming home purchase.",
                "eligibility": f"Recommended based on your predicted '{home_goal.title}' goal set for {home_goal.prediction_date}."
            })

        investment_total = analytics.get("investments_total", 0.0)
        if investment_total >= 300000.0:
            offers.append({
                "id": 5,
                "title": "Portfolio Advisory Services",
                "description": "Get automated portfolio rebalancing advice and tax-saving investment recommendations.",
                "eligibility": f"Eligible because your total investment is ₹{investment_total:,.2f}, exceeding the investment threshold."
            })
            
        if analytics.get("credit_card_balance", 0.0) > 30000.0:
            offers.append({
                "id": 6,
                "title": "IDBI Travel Signature Card",
                "description": "Earn 5x reward points on travel bookings and fuel. Free airport lounge access included.",
                "eligibility": "Recommended due to active travel spending categories and credit profile."
            })
            
        if len(offers) < 2:
            offers.append({
                "id": 7,
                "title": "Pre-Approved Personal Loan",
                "description": "Avail up to ₹1,000,000 at a special interest rate of 10.5% with zero processing fee and instant disbursal.",
                "eligibility": "Premium Customer Status with consistent monthly salary credits."
            })

        return offers
