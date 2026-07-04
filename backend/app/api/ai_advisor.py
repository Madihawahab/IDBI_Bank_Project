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
    
    return await ai_provider.generate_response(
        user_message=user_message,
        history=history,
        user_name=current_user.name
    )

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
