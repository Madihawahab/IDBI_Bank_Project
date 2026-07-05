from typing import List, Dict, Any
from app.models.models import User, Account, LifeEvent

class ContextBuilder:
    @staticmethod
    def build_context(
        user: User, 
        accounts: List[Account], 
        analytics: Dict[str, Any], 
        life_events: List[LifeEvent]
    ) -> Dict[str, Any]:
        return {
            "name": user.name,
            "accounts": [
                {"account_type": acc.account_type, "balance": acc.balance, "account_number": acc.account_number}
                for acc in accounts
            ],
            "total_balance": analytics.get("total_balance", 0.0),
            "monthly_income": analytics.get("income_this_month", 0.0),
            "monthly_expense": analytics.get("expenses_this_month", 0.0),
            "investments": analytics.get("investments_total", 0.0),
            "goals": [
                {"title": le.title, "prediction_date": le.prediction_date, "confidence": le.confidence, "explanation": le.explanation}
                for le in life_events
            ],
            "life_events": [
                {"title": le.title, "prediction_date": le.prediction_date, "confidence": le.confidence, "explanation": le.explanation}
                for le in life_events
            ]
        }

    @staticmethod
    def get_system_instruction(context: Dict[str, Any]) -> str:
        user_name = context.get("name", "Customer")
        total_balance = context.get("total_balance", 0.0)
        life_events = context.get("life_events", [])
        
        events_str = ""
        if life_events:
            events_str = "Refer to their upcoming life events/goals: " + ", ".join([
                f"{e['title']} predicted for {e['prediction_date']} with {e['confidence']}% confidence" 
                for e in life_events
            ]) + "."
        else:
            events_str = "No specific upcoming life events predicted yet."
            
        return f"""You are the IDBI Bank AI Financial Advisor, a premium, intelligent digital banking companion. 
Your goal is to guide users with transparent, customer-first recommendations.
You help them manage their budgets, understand their spending/savings, plan for predicted life events (like home purchases or higher education), and make informed choices.

Always keep your tone professional, friendly, and premium.
If the user asks about their financial situation, recall that you have access to their current total balance.
For {user_name}, their current total balance is ₹{total_balance:,.2f}.
Do not provide generic advice; refer to their actual balance and goals. {events_str}

CRITICAL: You MUST respond with a JSON object. The keys must be:
- "text": a concise, beautifully formatted markdown response string explaining your advice/recommendation.
- "signals": a list of 3-4 specific financial indicators or account parameters (e.g. "Balance: ₹4.82L", "Savings rate up 12%") that support your advice.
- "reasoning": a paragraph of explainable AI reasoning explaining why you recommend this.
- "alternatives": a short summary of alternative financial options (e.g. Fixed Deposit or rebalancing).
- "confidence": an integer between 0 and 100 representing your prediction/recommendation confidence.
- "humanReview": a boolean value, true if the query involves high-risk financial changes (loans, purchasing a home, retirement, large equity investments), false otherwise.
"""
