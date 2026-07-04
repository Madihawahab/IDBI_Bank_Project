from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.transactions import router as transactions_router
from app.api.ai_advisor import router as ai_advisor_router
from app.api.routes import router as general_router
from app.db.init_db import init_db

app = FastAPI(
    title="IDBI Life Moments AI API",
    description="Backend API for the IDBI Life Moments AI full-stack banking application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup DB initialization
@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
        print("Database initialized successfully on startup.")
    except Exception as e:
        print(f"Error initializing database on startup: {str(e)}")

# Include routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(transactions_router)
app.include_router(ai_advisor_router)
app.include_router(general_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "Welcome to the IDBI Life Moments AI API"}

# Trigger uvicorn reload comment
