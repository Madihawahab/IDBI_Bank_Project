import json
import logging
import time
from typing import List
from openai import AsyncOpenAI
from app.core.config import settings
from app.ai.prompts import SYSTEM_INSTRUCTION
from app.ai.schemas import ChatResponse, DetailedInfo

logger = logging.getLogger(__name__)

class NVIDIAAIProvider:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL
        self.model = settings.NVIDIA_MODEL
        
        # Configuration Validation during startup
        self.mock_mode = False
        if not self.api_key or self.api_key == "YOUR_NVIDIA_API_KEY" or self.api_key.strip() == "":
            logger.warning("NVIDIA_API_KEY is missing or empty. Automatically enabling mock/demo mode.")
            self.mock_mode = True
            
        # Reusable AsyncOpenAI client
        self.client = AsyncOpenAI(
            api_key=self.api_key or "dummy_key_to_prevent_sdk_init_crash",
            base_url=self.base_url,
            timeout=60.0,
            max_retries=2,
        )

    async def generate_response(
        self,
        user_message: str,
        history: List[dict],
        user_name: str
    ) -> ChatResponse:
        is_high_risk = any(word in user_message.lower() for word in ["loan", "home", "invest", "retire"])
        
        def get_fallback_response(reason: str) -> ChatResponse:
            logger.info("Fallback activated. Reason: %s", reason)
            return ChatResponse(
                reply=f"Hi {user_name}! I am currently operating in fallback mode. Based on your current balance of ₹4,82,350, you are in a healthy position to proceed with your goals. Let's configure the NVIDIA API key to enable live analysis!",
                detailed=DetailedInfo(
                    signals=["Balance: ₹4.82L", "Fallback active", "Stable cash flow"],
                    reasoning=f"This is a fallback response. Reason: {reason}",
                    alternatives="Verify the NVIDIA AI configurations or try again later.",
                    confidence=85,
                    humanReview=is_high_risk
                )
            )

        if self.mock_mode:
            logger.info("Mock mode active: generating mock financial advice response.")
            return ChatResponse(
                reply=f"Hi {user_name}! I am in demo mode because the NVIDIA API Key is not configured. Based on your current balance of ₹4,82,350, you are in a healthy position to proceed with your goals. Let's configure the NVIDIA API key to enable live analysis!",
                detailed=DetailedInfo(
                    signals=["Balance: ₹4.82L", "Demo mode active", "Stable cash flow"],
                    reasoning="This is a demo response. Once the NVIDIA API is connected, I will provide explainable AI reasoning here.",
                    alternatives="Configure NVIDIA_API_KEY in the backend .env file.",
                    confidence=85,
                    humanReview=is_high_risk
                )
            )

        # Convert conversation history to OpenAI-compatible messages format
        messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
        for msg in history:
            role = msg.get("role")
            if role == "model":
                role = "assistant"
            elif role not in ("user", "assistant", "system"):
                role = "user"
                
            content = ""
            if "content" in msg:
                content = msg["content"]
            elif "parts" in msg and len(msg["parts"]) > 0:
                content = msg["parts"][0].get("text", "")
            messages.append({"role": role, "content": content})
            
        messages.append({"role": "user", "content": user_message})

        logger.info("NVIDIA NIM AI request started for model: %s", self.model)
        start_time = time.perf_counter()
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.4,
                response_format={"type": "json_object"},
            )
            
            latency = time.perf_counter() - start_time
            reply_json_str = response.choices[0].message.content
            
            # Log token usage if available in SDK response
            token_usage_str = "N/A"
            if response.usage:
                token_usage_str = f"Prompt: {response.usage.prompt_tokens}, Completion: {response.usage.completion_tokens}, Total: {response.usage.total_tokens}"
                
            logger.info("NVIDIA NIM AI request completed. Latency: %.4f seconds. Token usage: %s", latency, token_usage_str)
            
            # Response Validation using Pydantic schemas
            try:
                parsed = json.loads(reply_json_str)
                detailed = DetailedInfo(
                    signals=parsed.get("signals", []),
                    reasoning=parsed.get("reasoning", ""),
                    alternatives=parsed.get("alternatives", ""),
                    confidence=parsed.get("confidence", 90),
                    humanReview=parsed.get("humanReview", False)
                )
                chat_res = ChatResponse(
                    reply=parsed.get("text", ""),
                    detailed=detailed
                )
                
                # Performance Optimization: update history cache in-place and slice to last 20 messages
                history.append({"role": "user", "content": user_message})
                history.append({"role": "assistant", "content": reply_json_str})
                if len(history) > 20:
                    history[:] = history[-20:]
                    
                return chat_res
                
            except Exception as parse_err:
                logger.error("NVIDIA NIM response validation failed: %s. Returning fallback.", str(parse_err))
                return get_fallback_response("Invalid response structure returned by model.")
                
        except Exception as api_err:
            logger.error("NVIDIA NIM provider error during API call: %s. Returning fallback.", str(api_err))
            return get_fallback_response(f"API call failed: {str(api_err)}")

    async def stream_response(
        self,
        user_message: str,
        history: List[dict],
        user_name: str
    ):
        """
        Streaming response generator using OpenAI SDK streaming API.
        Exposed for future-proofing.
        """
        if self.mock_mode:
            yield f"Hi {user_name}! operating in mock streaming mode."
            return

        messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
        for msg in history:
            role = msg.get("role")
            if role == "model":
                role = "assistant"
            elif role not in ("user", "assistant", "system"):
                role = "user"
                
            content = ""
            if "content" in msg:
                content = msg["content"]
            elif "parts" in msg and len(msg["parts"]) > 0:
                content = msg["parts"][0].get("text", "")
            messages.append({"role": role, "content": content})
            
        messages.append({"role": "user", "content": user_message})

        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.4,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error("NVIDIA NIM streaming error: %s", str(e))
            yield f"Streaming error: {str(e)}"
