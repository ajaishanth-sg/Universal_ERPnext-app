from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccountsReceivable(BaseModel):
    id: Optional[str] = None
    invoiceNumber: str
    customerName: str
    customerId: str
    amount: float
    outstandingAmount: float
    dueDate: str
    invoiceDate: str
    status: str = "Unpaid"  # Unpaid, Partially Paid, Paid, Overdue
    age: str = "Current"  # Current, 1-30, 31-60, 61-90, 90+
    paymentTerms: str = "Net 30"
    description: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class AccountsReceivablePayment(BaseModel):
    id: Optional[str] = None
    receivableId: str
    amount: float
    paymentDate: str
    paymentMethod: str = "Bank Transfer"
    reference: Optional[str] = None
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None