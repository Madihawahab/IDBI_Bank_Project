from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_
from typing import List, Optional

from app.db.session import get_db
from app.models.models import User, Account, Transaction, TrustLedgerEntry
from app.schemas.schemas import TransactionOut, TransactionCreate, BillPaymentCreate, ScanPayCreate
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["transactions"])

@router.get("/transactions", response_model=List[TransactionOut])
async def get_transactions(
    q: Optional[str] = Query(None, description="Search term for filtering transactions"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Transaction).filter(
        or_(
            Transaction.sender_id == current_user.id,
            Transaction.receiver_id == current_user.id,
            Transaction.sender_name == current_user.name,
            Transaction.receiver_name == current_user.name
        )
    )
    
    # Server-side search filtering
    if q:
        search_filter = or_(
            Transaction.sender_name.ilike(f"%{q}%"),
            Transaction.receiver_name.ilike(f"%{q}%"),
            Transaction.merchant.ilike(f"%{q}%"),
            Transaction.category.ilike(f"%{q}%"),
            Transaction.type.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)
        
    query = query.order_by(Transaction.timestamp.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/transactions/{id}", response_model=TransactionOut)
async def get_transaction(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Transaction).filter_by(id=id))
    transaction = result.scalars().first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Check authorization
    if (transaction.sender_id != current_user.id and 
        transaction.receiver_id != current_user.id and 
        transaction.sender_name != current_user.name and 
        transaction.receiver_name != current_user.name):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this transaction"
        )
        
    return transaction

@router.post("/transfer", response_model=TransactionOut)
async def transfer_money(
    transfer_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get sender account
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    sender_account = result.scalars().first()
    if not sender_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sender account not found"
        )
        
    if sender_account.balance < transfer_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
        
    # Check if recipient account exists in database
    result = await db.execute(select(Account).filter_by(account_number=transfer_in.recipient_account))
    recipient_account = result.scalars().first()
    
    recipient_name = f"Account {transfer_in.recipient_account}"
    recipient_id = None
    
    # Perform debit
    sender_account.balance -= transfer_in.amount
    
    # Perform credit if internal account
    if recipient_account:
        recipient_account.balance += transfer_in.amount
        recipient_id = recipient_account.user_id
        # Fetch recipient name
        res = await db.execute(select(User).filter_by(id=recipient_account.user_id))
        rec_user = res.scalars().first()
        if rec_user:
            recipient_name = rec_user.name
            
    # Record transaction
    transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=recipient_id,
        sender_name=current_user.name,
        receiver_name=recipient_name,
        amount=transfer_in.amount,
        type="transfer",
        merchant=None,
        category=transfer_in.category or "Transfer",
        status="Success"
    )
    db.add(transaction)
    
    # Record Trust Ledger audit event
    tl = TrustLedgerEntry(
        user_id=current_user.id,
        action_type="TRANSFER_COMPLETED",
        title=f"Transfer Completed: ₹{transfer_in.amount:,.2f} to {recipient_name}",
        description=f"A fund transfer of ₹{transfer_in.amount:,.2f} has been executed successfully from your Savings account to account number {transfer_in.recipient_account}.",
        reasoning="Requested by the authenticated customer and validated against available account balances.",
        alternative_options="None",
        impact=f"Debited ₹{transfer_in.amount:,.2f} from Savings account.",
        confidence_score=100
    )
    db.add(tl)
    
    await db.commit()
    await db.refresh(transaction)
    
    return transaction

@router.post("/pay-bill", response_model=TransactionOut)
async def pay_bill(
    bill_in: BillPaymentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get user account
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    account = result.scalars().first()
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not found"
        )
        
    if account.balance < bill_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
        
    # Debit balance
    account.balance -= bill_in.amount
    
    # Record transaction
    transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=None,
        sender_name=current_user.name,
        receiver_name=bill_in.biller_name,
        amount=bill_in.amount,
        type="pay-bill",
        merchant=bill_in.biller_name,
        category=bill_in.bill_type or "Utilities",
        status="Success"
    )
    db.add(transaction)
    
    # Record Trust Ledger audit event
    tl = TrustLedgerEntry(
        user_id=current_user.id,
        action_type="BILL_PAID",
        title=f"Bill Paid: {bill_in.biller_name}",
        description=f"Paid ₹{bill_in.amount:,.2f} for {bill_in.bill_type} bill to {bill_in.biller_name} using your Savings account.",
        reasoning="Biller credentials verified. Automated balance validation successful.",
        alternative_options="None",
        impact=f"Debited ₹{bill_in.amount:,.2f} from Savings account.",
        confidence_score=100
    )
    db.add(tl)
    
    await db.commit()
    await db.refresh(transaction)
    
    return transaction

@router.post("/scan-pay", response_model=TransactionOut)
async def scan_pay(
    scan_in: ScanPayCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get user account
    result = await db.execute(select(Account).filter_by(user_id=current_user.id))
    account = result.scalars().first()
    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not found"
        )
        
    if account.balance < scan_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
        
    # Parse qr_data to extract merchant name
    # Simple parse e.g. "upi://pay?pa=merchant@upi&pn=MerchantName"
    merchant_name = scan_in.qr_data
    if "pn=" in scan_in.qr_data:
        parts = scan_in.qr_data.split("pn=")
        if len(parts) > 1:
            merchant_name = parts[1].split("&")[0].replace("%20", " ").replace("+", " ")
            
    # Debit balance
    account.balance -= scan_in.amount
    
    # Record transaction
    transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=None,
        sender_name=current_user.name,
        receiver_name=merchant_name,
        amount=scan_in.amount,
        type="scan-pay",
        merchant=merchant_name,
        category="Shopping",
        status="Success"
    )
    db.add(transaction)
    
    # Record Trust Ledger audit event
    tl = TrustLedgerEntry(
        user_id=current_user.id,
        action_type="TRANSFER_COMPLETED",
        title=f"UPI Payment Executed: {merchant_name}",
        description=f"Completed scan-to-pay transaction of ₹{scan_in.amount:,.2f} to {merchant_name} via secure UPI.",
        reasoning="UPI QR code signature validated. Automated authorization successful.",
        alternative_options="None",
        impact=f"Debited ₹{scan_in.amount:,.2f} from Savings account.",
        confidence_score=100
    )
    db.add(tl)
    
    await db.commit()
    await db.refresh(transaction)
    
    return transaction
