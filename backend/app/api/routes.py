from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.models import User, LifeEvent, AIRecommendation, Offer, Notification, Setting
from app.schemas.schemas import (
    LifeEventOut,
    AIRecommendationOut,
    OfferOut,
    NotificationOut,
    SettingOut,
    SettingUpdate
)
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["general"])

# 1. Life Events
@router.get("/life-events", response_model=List[LifeEventOut])
async def get_life_events(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(LifeEvent).filter_by(user_id=current_user.id))
    return result.scalars().all()

@router.get("/life-events/{id}", response_model=LifeEventOut)
async def get_life_event(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(LifeEvent).filter_by(id=id, user_id=current_user.id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Life event not found")
    return event

# 2. Trust Ledger (Explainable AI Recommendations)
@router.get("/trust-ledger", response_model=List[AIRecommendationOut])
async def get_trust_ledger(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AIRecommendation)
        .filter_by(user_id=current_user.id)
        .order_by(AIRecommendation.timestamp.desc())
    )
    return result.scalars().all()

# 3. Money Mood
@router.get("/money-mood")
async def get_money_mood(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Returns dataset matching standard dashboard Recharts formatting
    # These are hardcoded trends that are tailored to Aarav Sharma's database
    # In production, these aggregate sum(amount) group by date/category.
    savings_data = [
        {"name": "Oct", "amount": 15000},
        {"name": "Nov", "amount": 18000},
        {"name": "Dec", "amount": 22000},
        {"name": "Jan", "amount": 25000},
        {"name": "Feb", "amount": 27000},
        {"name": "Mar", "amount": 32000}
    ]
    spending_data = [
        {"name": "Oct", "amount": 34000},
        {"name": "Nov", "amount": 31000},
        {"name": "Dec", "amount": 42000},
        {"name": "Jan", "amount": 28000},
        {"name": "Feb", "amount": 33000},
        {"name": "Mar", "amount": 29000}
    ]
    investment_data = [
        {"name": "Oct", "amount": 20000},
        {"name": "Nov", "amount": 20000},
        {"name": "Dec", "amount": 25000},
        {"name": "Jan", "amount": 25000},
        {"name": "Feb", "amount": 25000},
        {"name": "Mar", "amount": 28000}
    ]
    
    return {
        "savings": savings_data,
        "spending": spending_data,
        "investment": investment_data,
        "mood_score": 88
    }

# 4. Offers
@router.get("/offers", response_model=List[OfferOut])
async def get_offers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Offer))
    return result.scalars().all()

# 5. Notifications
@router.get("/notifications", response_model=List[NotificationOut])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification)
        .filter_by(user_id=current_user.id)
        .order_by(Notification.timestamp.desc())
    )
    return result.scalars().all()

@router.patch("/notifications/read")
async def mark_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Notification).filter_by(user_id=current_user.id, read=False))
    unread_notifications = result.scalars().all()
    for notif in unread_notifications:
        notif.read = True
    await db.commit()
    return {"message": "All notifications marked as read", "count": len(unread_notifications)}

# 6. Settings
@router.get("/settings", response_model=SettingOut)
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Setting).filter_by(user_id=current_user.id))
    setting = result.scalars().first()
    if not setting:
        # Create default setting if missing
        setting = Setting(
            user_id=current_user.id,
            language="English",
            notifications_enabled=True,
            biometrics_enabled=False
        )
        db.add(setting)
        await db.commit()
        await db.refresh(setting)
    return setting

@router.put("/settings", response_model=SettingOut)
async def update_settings(
    setting_in: SettingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Setting).filter_by(user_id=current_user.id))
    setting = result.scalars().first()
    if not setting:
        setting = Setting(user_id=current_user.id)
        db.add(setting)
        
    setting.language = setting_in.language
    setting.notifications_enabled = setting_in.notifications_enabled
    setting.biometrics_enabled = setting_in.biometrics_enabled
    
    await db.commit()
    await db.refresh(setting)
    return setting
