from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class CapitalCallStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    SENT = "sent"
    PARTIALLY_FUNDED = "partially_funded"
    FULLY_FUNDED = "fully_funded"
    CANCELLED = "cancelled"
    OVERDUE = "overdue"

class InvestmentType(str, Enum):
    PRIVATE_EQUITY = "private_equity"
    VENTURE_CAPITAL = "venture_capital"
    REAL_ESTATE = "real_estate"
    HEDGE_FUND = "hedge_fund"
    INFRASTRUCTURE = "infrastructure"
    OTHER = "other"

class CapitalCall(BaseModel):
    id: Optional[str] = None

    # Basic Information
    fund_name: str
    investment_type: InvestmentType
    call_number: str  # e.g., "CC-2024-001"

    # Financial Details
    total_commitment_amount: float
    called_amount: float
    remaining_amount: float

    # Dates
    notice_date: date
    due_date: date
    first_close_date: Optional[date] = None
    final_close_date: Optional[date] = None

    # Status and Workflow
    status: CapitalCallStatus = CapitalCallStatus.DRAFT
    approval_required: bool = False
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None

    # Investor Information
    investor_commitments: List[dict] = []  # List of investor commitment details

    # Purpose and Details
    purpose: str  # What the capital call is for
    description: Optional[str] = None
    investment_opportunity: Optional[str] = None

    # Notifications
    alert_sent: bool = False
    alert_sent_at: Optional[datetime] = None
    reminder_sent: bool = False
    reminder_sent_at: Optional[datetime] = None

    # Legal and Compliance
    legal_review_required: bool = False
    legal_review_by: Optional[str] = None
    legal_review_at: Optional[datetime] = None
    regulatory_approval_required: bool = False

    # Tracking
    created_by: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Notifications
    notify_investors: bool = True
    notification_emails: List[EmailStr] = []

    class Config:
        use_enum_values = True

class InvestorCommitment(BaseModel):
    investor_id: str
    investor_name: str
    investor_email: EmailStr
    commitment_amount: float
    called_amount: float
    paid_amount: float
    remaining_amount: float
    payment_status: str  # pending, paid, overdue, defaulted
    payment_date: Optional[date] = None
    notes: Optional[str] = None