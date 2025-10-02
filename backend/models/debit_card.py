from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DebitCard(BaseModel):
    id: Optional[str] = None
    cardNumber: str  # Masked card number like **** **** **** 1234
    bankName: str
    cardType: str  # e.g., Primary, Business, Travel
    currentBalance: float
    currency: str = "INR"
    alertThreshold: float = 500.0  # Balance below this triggers alert
    autoRefillEnabled: bool = False
    autoRefillAmount: float = 1000.0
    lastRefillDate: Optional[datetime] = None
    status: str = "active"  # active, inactive, blocked
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        # Allow extra fields and handle id field properly
        extra = "allow"
        fields = {
            'id': {'alias': '_id'}
        }

class DebitCardAlert(BaseModel):
    id: Optional[str] = None
    debitCardId: str
    alertType: str  # low_balance, auto_refill, etc.
    message: str
    isRead: bool = False
    createdAt: Optional[datetime] = None

class DebitCardSettings(BaseModel):
    id: Optional[str] = None
    defaultAlertThreshold: float = 500.0
    defaultAutoRefillAmount: float = 1000.0
    enableEmailNotifications: bool = True
    enableSMSNotifications: bool = True
    enableDashboardNotifications: bool = False
    createdBy: Optional[str] = None
    updatedAt: Optional[datetime] = None