from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
import random

from app.db.session import get_db
from app.models.models import User, Account, Setting
from app.schemas.schemas import UserRegister, UserLogin, Token, TokenRefreshRequest, UserOut
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).filter_by(email=user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = get_password_hash(user_in.password)
    
    # Create user
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=password_hash,
        phone=user_in.phone,
        role="Customer"
    )
    db.add(user)
    await db.flush() # get user id
    
    # Create default account
    # Generate unique account number
    account_number = "".join([str(random.randint(0, 9)) for _ in range(10)])
    account = Account(
        user_id=user.id,
        account_number=account_number,
        balance=0.0,
        account_type="Savings"
    )
    db.add(account)
    
    # Create default settings
    settings = Setting(
        user_id=user.id,
        language="English",
        notifications_enabled=True,
        biometrics_enabled=False
    )
    db.add(settings)
    
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter_by(email=credentials.email))
    user = result.scalars().first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_in: TokenRefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(refresh_in.refresh_token)
    if not payload or not payload.get("refresh"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload",
        )
        
    result = await db.execute(select(User).filter_by(email=email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    # In stateless JWT, logout client deletes the tokens.
    # Optionally blacklist on Redis here, but we will return success.
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
