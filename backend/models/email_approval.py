from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"

class ApprovalType(str, Enum):
    MAINTENANCE_REQUEST = "maintenance_request"
    LEAVE_REQUEST = "leave_request"
    TRAVEL_REQUEST = "travel_request"
    PURCHASE_REQUEST = "purchase_request"
    CAPITAL_CALL = "capital_call"
    GENERAL_APPROVAL = "general_approval"

class EmailApproval(BaseModel):
    id: Optional[str] = None
    approval_type: ApprovalType
    reference_id: str  # ID of the item being approved (e.g., maintenance request ID)
    reference_title: str  # Human-readable title of what's being approved

    # Requester information
    requested_by: str
    requester_email: EmailStr
    requester_name: str

    # Approver information
    approver_email: EmailStr
    approver_name: str

    # Approval details
    status: ApprovalStatus = ApprovalStatus.PENDING
    approval_token: str  # Secure token for one-click approval
    expires_at: datetime

    # Optional fields
    description: Optional[str] = None
    priority: str = "medium"  # low, medium, high, urgent
    department: Optional[str] = None

    # Tracking
    created_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None

    # Metadata
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        use_enum_values = True