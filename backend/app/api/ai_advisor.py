from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, List
from pydantic import BaseModel

from app.db.session import get_db
from app.models.models import User
from app.auth.dependencies import get_current_user
from app.ai.provider import ai_provider
from app.ai.schemas import ChatResponse

router = APIRouter(tags=["ai-advisor"])

# Simple in-memory history storage
chat_histories: Dict[int, List[dict]] = {}

class ChatRequest(BaseModel):
    message: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_advisor(
    chat_in: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id
    user_message = chat_in.message
    
    if user_id not in chat_histories:
        chat_histories[user_id] = []
        
    history = chat_histories[user_id]
    
    # 1. Fetch user accounts, transactions, and life events
    from sqlalchemy import or_
    from sqlalchemy.future import select
    from app.models.models import Account, Transaction, LifeEvent
    
    res_acc = await db.execute(select(Account).filter_by(user_id=user_id))
    accounts = res_acc.scalars().all()
    
    res_tx = await db.execute(
        select(Transaction)
        .filter(
            or_(
                Transaction.sender_id == user_id,
                Transaction.receiver_id == user_id,
                Transaction.sender_name == current_user.name,
                Transaction.receiver_name == current_user.name
            )
        )
    )
    transactions = res_tx.scalars().all()
    
    res_le = await db.execute(select(LifeEvent).filter_by(user_id=user_id))
    life_events = res_le.scalars().all()
    
    # 2. Get persona name deterministically
    import hashlib
    seed_source = f"{current_user.id}-{current_user.email.lower()}"
    seed_int = int(hashlib.sha256(seed_source.encode()).hexdigest(), 16) % (10**8)
    from app.services.personas import PERSONAS
    persona_keys = list(PERSONAS.keys())
    persona_name = persona_keys[seed_int % len(persona_keys)]
    if current_user.email.lower() == "aarav.sharma@idbi.co.in":
        persona_name = "Experienced Salaried Employee"
        
    # 3. Compute analytics and structured context
    from app.services.financial_analytics import FinancialAnalyticsCalculator
    from app.services.context_builder import ContextBuilder
    
    analytics = FinancialAnalyticsCalculator.compute_all_metrics(accounts, transactions, persona_name)
    context_obj = ContextBuilder.build_context(current_user, accounts, analytics, life_events)
    
    # 4. Generate AI advisor response
    response = await ai_provider.generate_response(
        user_message=user_message,
        history=history,
        user_name=current_user.name,
        financial_context=context_obj
    )
    
    # 5. Extract clean topic title from user prompt
    msg_lower = user_message.lower()
    if "home" in msg_lower or "villa" in msg_lower or "house" in msg_lower or "property" in msg_lower:
        topic_title = "Home Purchase Consultation"
    elif "education" in msg_lower or "college" in msg_lower or "school" in msg_lower or "mba" in msg_lower:
        topic_title = "Education Planning Consultation"
    elif "sip" in msg_lower or "savings" in msg_lower or "invest" in msg_lower:
        topic_title = "Savings & Investment Advice"
    elif "emergency" in msg_lower or "fd" in msg_lower:
        topic_title = "Emergency Fund Consultation"
    elif "insurance" in msg_lower or "cover" in msg_lower:
        topic_title = "Insurance Coverage Advice"
    else:
        # Default topic based on the first few words of the user's message
        words = user_message.split()
        short_msg = " ".join(words[:4]) + "..." if len(words) > 4 else user_message
        topic_title = f"AI Advisor: {short_msg}"

    detailed = response.detailed
    confidence = detailed.confidence if detailed else 85
    description = response.reply
    reasoning = detailed.reasoning if detailed else user_message
    alternatives = detailed.alternatives if detailed else "Consider reviewing alternative deposit rates or asset allocations."
    
    if detailed and detailed.signals:
        impact_desc = f"Observed signals: {', '.join(detailed.signals[:3])}"
    else:
        impact_desc = f"Accessed available balance of ₹{analytics['total_balance']:,.2f}."

    # Record AI_RECOMMENDATION_SHOWN trust entry for audit (explainable trace)
    from app.models.models import TrustLedgerEntry
    tl = TrustLedgerEntry(
        user_id=user_id,
        action_type="AI_RECOMMENDATION_SHOWN",
        title=topic_title,
        description=description,
        reasoning=reasoning,
        alternative_options=alternatives,
        impact=impact_desc,
        confidence_score=confidence
    )
    db.add(tl)
    await db.commit()
    
    return response

@router.post("/chat/reset")
async def reset_chat(current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    if user_id in chat_histories:
        chat_histories[user_id] = []
    return {"message": "Chat history cleared"}

@router.get("/ai/health")
async def ai_health():
    configured = not ai_provider.mock_mode
    response_data = {
        "provider": "NVIDIA NIM",
        "configured": configured,
        "mockMode": ai_provider.mock_mode
    }
    if configured:
        response_data["model"] = ai_provider.model
    return response_data
