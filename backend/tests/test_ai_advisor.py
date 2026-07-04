import pytest
import httpx
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.ai.provider import ai_provider
from openai import APITimeoutError, RateLimitError

# Helper to log in and get auth headers
async def get_auth_headers(ac: AsyncClient):
    login_response = await ac.post("/auth/login", json={
        "email": "aarav.sharma@idbi.co.in",
        "password": "demo1234"
    })
    assert login_response.status_code == 200
    tokens = login_response.json()
    return {"Authorization": f"Bearer {tokens['access_token']}"}

# Sub-test 1: Health check
async def run_health_check_endpoint(ac: AsyncClient):
    # Save original state
    original_mock_mode = ai_provider.mock_mode
    
    # Test configured mode
    ai_provider.mock_mode = False
    response = await ac.get("/ai/health")
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "NVIDIA NIM"
    assert data["configured"] is True
    assert data["mockMode"] is False
    assert "model" in data
    
    # Test mock mode
    ai_provider.mock_mode = True
    response = await ac.get("/ai/health")
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "NVIDIA NIM"
    assert data["configured"] is False
    assert data["mockMode"] is True
    assert "model" not in data
    
    # Restore state
    ai_provider.mock_mode = original_mock_mode

# Sub-test 2: Chat mock mode
async def run_chat_advisor_mock_mode(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = True
    
    response = await ac.post("/chat", json={"message": "What is my balance?"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "demo mode" in data["reply"].lower() or "configured" in data["reply"].lower()
    assert data["detailed"] is not None
    assert "Balance: ₹4.82L" in data["detailed"]["signals"]
    assert data["detailed"]["humanReview"] is False
    
    # Test high risk word triggers humanReview = True
    response_risk = await ac.post("/chat", json={"message": "I want to apply for a loan"}, headers=headers)
    assert response_risk.status_code == 200
    data_risk = response_risk.json()
    assert data_risk["detailed"]["humanReview"] is True
    
    ai_provider.mock_mode = original_mock_mode

# Sub-test 3: Successful NVIDIA response
async def run_chat_advisor_successful_nvidia_response(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = False
    
    # Mock completions.create call
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = '{"text": "Hello Aarav! Based on your upcoming home purchase in March 2026, let us look at some deposits.", "signals": ["Balance: ₹4.82L", "Savings rate: 12%"], "reasoning": "Reasoning here.", "alternatives": "Alternatives here.", "confidence": 92, "humanReview": true}'
    mock_response.choices = [mock_choice]
    mock_response.usage = MagicMock(prompt_tokens=15, completion_tokens=30, total_tokens=45)
    
    original_create = ai_provider.client.chat.completions.create
    ai_provider.client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    try:
        response = await ac.post("/chat", json={"message": "Give me advice for buying a home"}, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "Hello Aarav!" in data["reply"]
        assert data["detailed"]["signals"] == ["Balance: ₹4.82L", "Savings rate: 12%"]
        assert data["detailed"]["confidence"] == 92
        assert data["detailed"]["humanReview"] is True
    finally:
        ai_provider.client.chat.completions.create = original_create
        ai_provider.mock_mode = original_mock_mode

# Sub-test 4: Timeout fallback
async def run_chat_advisor_timeout_fallback(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = False
    
    # Mock API to raise Timeout error
    mock_request = httpx.Request("POST", "https://integrate.api.nvidia.com/v1/chat/completions")
    original_create = ai_provider.client.chat.completions.create
    ai_provider.client.chat.completions.create = AsyncMock(side_effect=APITimeoutError(request=mock_request))
    
    try:
        response = await ac.post("/chat", json={"message": "Timeout test"}, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "fallback" in data["reply"].lower() or "operating in fallback mode" in data["reply"].lower()
        assert data["detailed"]["signals"] == ["Balance: ₹4.82L", "Fallback active", "Stable cash flow"]
    finally:
        ai_provider.client.chat.completions.create = original_create
        ai_provider.mock_mode = original_mock_mode

# Sub-test 5: Rate limit fallback
async def run_chat_advisor_rate_limit_fallback(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = False
    
    # Mock API to raise Rate Limit error
    mock_request = httpx.Request("POST", "https://integrate.api.nvidia.com/v1/chat/completions")
    mock_response = httpx.Response(status_code=429, request=mock_request)
    original_create = ai_provider.client.chat.completions.create
    ai_provider.client.chat.completions.create = AsyncMock(side_effect=RateLimitError("Rate limit exceeded", response=mock_response, body=None))
    
    try:
        response = await ac.post("/chat", json={"message": "Rate limit test"}, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "fallback" in data["reply"].lower() or "operating in fallback mode" in data["reply"].lower()
    finally:
        ai_provider.client.chat.completions.create = original_create
        ai_provider.mock_mode = original_mock_mode

# Sub-test 6: Invalid JSON fallback
async def run_chat_advisor_invalid_json_fallback(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = False
    
    # Mock completions.create call returning malformed JSON
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = '{"text": "malformed JSON string without matching brackets'
    mock_response.choices = [mock_choice]
    mock_response.usage = None
    
    original_create = ai_provider.client.chat.completions.create
    ai_provider.client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    try:
        response = await ac.post("/chat", json={"message": "Malformed JSON test"}, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "fallback" in data["reply"].lower() or "operating in fallback mode" in data["reply"].lower()
    finally:
        ai_provider.client.chat.completions.create = original_create
        ai_provider.mock_mode = original_mock_mode

# Sub-test 7: History and reset
async def run_chat_advisor_history_and_reset(ac: AsyncClient, headers: dict):
    original_mock_mode = ai_provider.mock_mode
    ai_provider.mock_mode = False
    
    # Mock completions.create call
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = '{"text": "Chat answer.", "signals": [], "reasoning": "", "alternatives": "", "confidence": 90, "humanReview": false}'
    mock_response.choices = [mock_choice]
    mock_response.usage = None
    
    original_create = ai_provider.client.chat.completions.create
    ai_provider.client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    try:
        # 1. Clear history first
        reset_res = await ac.post("/chat/reset", headers=headers)
        assert reset_res.status_code == 200
        
        # 2. First message
        response1 = await ac.post("/chat", json={"message": "Message 1"}, headers=headers)
        assert response1.status_code == 200
        
        # Verify message 1 went through and history was built
        assert ai_provider.client.chat.completions.create.call_count == 1
        
        # 3. Second message (this should send history too)
        response2 = await ac.post("/chat", json={"message": "Message 2"}, headers=headers)
        assert response2.status_code == 200
        assert ai_provider.client.chat.completions.create.call_count == 2
        
        # Verify history passed in the second request contains the first message & answer
        called_args = ai_provider.client.chat.completions.create.call_args[1]
        history_messages = called_args["messages"]
        assert len(history_messages) == 4
        assert history_messages[0]["role"] == "system"
        assert history_messages[1]["role"] == "user"
        assert history_messages[1]["content"] == "Message 1"
        assert history_messages[2]["role"] == "assistant"
        assert history_messages[2]["content"] == '{"text": "Chat answer.", "signals": [], "reasoning": "", "alternatives": "", "confidence": 90, "humanReview": false}'
        assert history_messages[3]["role"] == "user"
        assert history_messages[3]["content"] == "Message 2"
        
        # 4. Reset history
        reset_res2 = await ac.post("/chat/reset", headers=headers)
        assert reset_res2.status_code == 200
        
        # 5. Third message (should start fresh without history)
        response3 = await ac.post("/chat", json={"message": "Message 3"}, headers=headers)
        assert response3.status_code == 200
        
        called_args_reset = ai_provider.client.chat.completions.create.call_args[1]
        history_messages_reset = called_args_reset["messages"]
        assert len(history_messages_reset) == 2
        assert history_messages_reset[0]["role"] == "system"
        assert history_messages_reset[1]["role"] == "user"
        assert history_messages_reset[1]["content"] == "Message 3"
        
    finally:
        ai_provider.client.chat.completions.create = original_create
        ai_provider.mock_mode = original_mock_mode


# Main Orchestrator Test Function
@pytest.mark.asyncio
async def test_ai_advisor_flows():
    from app.db.session import engine
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # Run health check first
            await run_health_check_endpoint(ac)
            
            # Login and get headers
            headers = await get_auth_headers(ac)
            
            # Run chat-related test cases sequentially
            await run_chat_advisor_mock_mode(ac, headers)
            await run_chat_advisor_successful_nvidia_response(ac, headers)
            await run_chat_advisor_timeout_fallback(ac, headers)
            await run_chat_advisor_rate_limit_fallback(ac, headers)
            await run_chat_advisor_invalid_json_fallback(ac, headers)
            await run_chat_advisor_history_and_reset(ac, headers)
    finally:
        await engine.dispose()
