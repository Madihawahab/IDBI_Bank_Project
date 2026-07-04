from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List

from app.db.session import get_db
from app.models.models import User, Account, Transaction, AIRecommendation, LifeEvent, Notification
from app.schemas.schemas import DashboardOut
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard", response_model=DashboardOut)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Accounts
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    # 2. Total Balance
    total_balance = sum(acc.balance for acc in accounts)
    
    # 3. Recent Transactions (sender or receiver is the current user)
    # Since our mock user has name "Aarav Sharma", we also show transactions where sender_name or receiver_name matches
    result = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
        .order_by(Transaction.timestamp.desc())
        .limit(4)
    )
    recent_transactions = result.scalars().all()
    
    # Format transactions amounts for display (e.g. adding "+" or "−" or keeping it as positive float)
    # React side will format, but let's make sure transaction.amount is positive and we indicate direction.
    # In the schema, amount is float. That is perfect.
    
    # 4. AI Insight
    result = await db.execute(
        select(AIRecommendation)
        .filter_by(user_id=current_user.id)
        .order_by(AIRecommendation.timestamp.desc())
    )
    ai_insight = result.scalars().first()
    
    # 5. Upcoming Life Event
    result = await db.execute(
        select(LifeEvent)
        .filter_by(user_id=current_user.id)
        .order_by(LifeEvent.confidence.desc())
    )
    upcoming_life_event = result.scalars().first()
    
    # 6. Notifications
    result = await db.execute(
        select(Notification)
        .filter_by(user_id=current_user.id, read=False)
        .order_by(Notification.timestamp.desc())
        .limit(5)
    )
    notifications = result.scalars().all()
    
    # 7. Quick Actions
    quick_actions = [
        {"icon": "Send", "label": "Transfer"},
        {"icon": "Receipt", "label": "Pay Bills"},
        {"icon": "ScanLine", "label": "Scan & Pay"},
        {"icon": "TrendingUp", "label": "Invest"},
        {"icon": "Shield", "label": "Insurance"},
        {"icon": "MoreHorizontal", "label": "More"},
    ]
    
    return {
        "balance": total_balance,
        "accounts": accounts,
        "recent_transactions": recent_transactions,
        "quick_actions": quick_actions,
        "ai_insight": ai_insight,
        "upcoming_life_event": upcoming_life_event,
        "notifications": notifications
    }
