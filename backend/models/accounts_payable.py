from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccountsPayable(BaseModel):
    id: Optional[str] = None
    company: str
    reportDate: str
    financeBook: Optional[str] = None
    costCenter: Optional[str] = None
    payableAccount: Optional[str] = None
    dueDate: Optional[str] = None
    paymentTermsTemplate: Optional[str] = None
    partyType: Optional[str] = None
    party: Optional[str] = None
    supplier: str
    invoiceNumber: str
    invoiceDate: Optional[str] = None
    outstandingAmount: float
    totalAmount: Optional[float] = None
    paymentTerms: Optional[str] = None
    reference: Optional[str] = None
    description: Optional[str] = None
    basedOnPaymentTerms: bool = False
    showRemarks: bool = False
    showFuturePayments: bool = False
    revaluationJournals: bool = False
    groupByVoucher: bool = False
    groupBySupplier: bool = False
    inPartyCurrency: bool = False
    handleEmployeeAdvances: bool = False
    age: Optional[str] = None
    overdue: bool = False
    lastPayment: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None