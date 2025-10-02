from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RacingPayment(BaseModel):
    id: Optional[str] = None
    type: str  # 'Income' or 'Expense'
    category: str
    title: str
    amount: float
    status: str  # 'Received', 'Paid', 'Pending', 'Overdue', 'Cancelled'
    date: str
    dueDate: Optional[str] = None
    description: Optional[str] = None
    reference: Optional[str] = None
    paymentMethod: Optional[str] = None
    fromAccount: Optional[str] = None
    toAccount: Optional[str] = None
    notes: Optional[str] = None
    attachments: int = 0
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None