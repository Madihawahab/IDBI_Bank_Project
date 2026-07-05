from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import List

from app.db.session import get_db
from app.models.models import User, LifeEvent, AIRecommendation, Offer, Notification, Setting, TrustLedgerEntry, Account
from app.schemas.schemas import (
    LifeEventCreate,
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

@router.post("/life-events", response_model=LifeEventOut, status_code=status.HTTP_201_CREATED)
async def create_life_event(
    payload: LifeEventCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    confidence = payload.confidence
    if confidence is None:
        # Dynamic confidence based on title length and character sums
        # simulating AI/analytical feasibility assessment
        title_hash = sum(ord(c) for c in payload.title)
        confidence = 65 + (title_hash % 26)

    le = LifeEvent(
        user_id=current_user.id,
        title=payload.title,
        confidence=confidence,
        prediction_date=payload.prediction_date,
        explanation=payload.explanation
    )
    db.add(le)
    await db.commit()
    await db.refresh(le)
    return le

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
        select(TrustLedgerEntry)
        .filter_by(user_id=current_user.id)
        .order_by(TrustLedgerEntry.timestamp.desc())
    )
    return result.scalars().all()

# 3. Money Mood
@router.get("/money-mood")
async def get_money_mood(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    from app.models.models import Transaction
    result_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = result_tx.scalars().all()
    
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    from app.services.money_mood import MoneyMoodEngine
    
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    mood_data = MoneyMoodEngine.evaluate_mood(analytics, transactions)
    return mood_data

# 4. Offers
@router.get("/offers", response_model=List[OfferOut])
async def get_offers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    accounts = result.scalars().all()
    
    from app.models.models import Transaction
    result_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == current_user.id,
                Transaction.receiver_id == current_user.id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = result_tx.scalars().all()
    
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    
    result_le = await db.execute(select(LifeEvent).filter_by(user_id=current_user.id))
    life_events = result_le.scalars().all()
    
    from app.services.offer_engine import OfferEngine
    offers = OfferEngine.generate_offers(analytics, life_events, current_user.name)
    return offers

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
