from typing import List, Dict, Any
from datetime import datetime, timezone

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(analytics: Dict[str, Any], life_events: List[Any]) -> List[Dict[str, Any]]:
        recommendations = []
        
        savings_bal = analytics.get("savings_balance", 0.0)
        cc_bal = analytics.get("credit_card_balance", 0.0)
        savings_rate = analytics.get("savings_rate", 0.20)
        credit_util = analytics.get("credit_utilization", 0.0)
        
        if credit_util > 0.35:
            recommendations.append({
                "id": 101,
                "title": "Reduce Credit Card Outstanding Dues",
                "description": f"Your Credit Card utilization has touched {credit_util*100:.1f}%. Consider paying off ₹{cc_bal:,.2f} early to protect your credit score.",
                "reasoning": "High credit utilization ratio negatively impacts your credit bureau rating. Keeping utilization below 30% is a best practice.",
                "alternative_options": "1. Set up an auto-debit for full payment on the due date.\n2. Convert high-value transactions into low-cost EMI.",
                "impact": "Saves potential interest charges and raises your credit score by up to 25 points.",
                "confidence_score": 95,
                "timestamp": datetime.now(timezone.utc)
            })

        home_goal = next((le for le in life_events if "home" in le.title.lower() or "villa" in le.title.lower() or "purchase" in le.title.lower()), None)
        if home_goal and savings_rate > 0.20:
            recommendations.append({
                "id": 102,
                "title": "Increase Monthly SIP by ₹3,000",
                "description": f"You're making great progress towards your '{home_goal.title}' goal. Consider increasing your monthly mutual fund SIP by ₹3,000 to reach your target 4 months earlier.",
                "reasoning": f"Your current savings rate of {savings_rate*100:.1f}% leaves surplus cash yielding low interest in your savings account. Investing this in mutual funds speeds up compound growth.",
                "alternative_options": "1. Direct the surplus to a 1-year Fixed Deposit at 7.2% interest.\n2. Keep funds in your high-interest savings account (4% p.a.).",
                "impact": "Expected returns increase by ₹38,400 over the goal duration, allowing you to reach your down payment target earlier.",
                "confidence_score": 92,
                "timestamp": datetime.now(timezone.utc)
            })

        if savings_bal < 150000.0:
            recommendations.append({
                "id": 103,
                "title": "Top-up Emergency Fund",
                "description": f"Your savings balance of ₹{savings_bal:,.2f} is below the recommended 6 months expense buffer. Top up by ₹20,000.",
                "reasoning": "Maintaining an emergency fund equivalent to 6 months of expenses protects you against sudden cash requirements or job transitions.",
                "alternative_options": "1. Set up a sweep-in Fixed Deposit that links to your Savings account.\n2. Direct ₹5,000/month to a liquid mutual fund.",
                "impact": "Full financial cushion achieved, providing peace of mind against unexpected life events.",
                "confidence_score": 88,
                "timestamp": datetime.now(timezone.utc)
            })

        if analytics.get("investments_total", 0.0) < 500000.0:
            recommendations.append({
                "id": 104,
                "title": "Invest in Tax-Saving ELSS",
                "description": "Optimize your taxes under Section 80C by investing up to ₹1,50,000 in Mirae ELSS Mutual Fund.",
                "reasoning": "ELSS funds offer tax savings alongside equity-linked returns with a lock-in period of only 3 years.",
                "alternative_options": "1. Invest in Public Provident Fund (PPF) at 7.1% interest (15-year lock-in).\n2. Open a Tax-Saver Fixed Deposit (5-year lock-in).",
                "impact": "Reduces your annual tax liability by up to ₹46,800 depending on your tax bracket.",
                "confidence_score": 90,
                "timestamp": datetime.now(timezone.utc)
            })

        return recommendations[:3]
