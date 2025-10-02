from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Item(BaseModel):
    id: int
    item: Optional[str] = None
    quantity: float = 0
    rate: float = 0
    amount: float = 0

class TaxCharge(BaseModel):
    id: int
    type: Optional[str] = None
    accountHead: Optional[str] = None
    taxRate: float = 0
    amount: float = 0
    total: float = 0

class TimeSheet(BaseModel):
    id: int
    activityType: Optional[str] = None
    description: Optional[str] = None
    billingHours: float = 0
    billingAmount: float = 0

class SalesInvoice(BaseModel):
    id: Optional[str] = None
    series: str
    date: str
    customer: str
    postingTime: Optional[str] = None
    paymentDueDate: Optional[str] = None
    includePaymentPOS: bool = False
    isReturn: bool = False
    isRateAdjustment: bool = False
    editPostingDateTime: bool = False
    updateStock: bool = False
    taxCategory: Optional[str] = None
    shippingRule: Optional[str] = None
    incoterm: Optional[str] = None
    salesTaxTemplate: Optional[str] = None
    applyDiscountOn: str = 'Grand Total'
    isCashDiscount: bool = False
    discountPercentage: float = 0
    discountAmount: float = 0
    useCompanyRoundOff: bool = False
    items: List[Item] = []
    taxCharges: List[TaxCharge] = []
    timeSheets: List[TimeSheet] = []
    totalQuantity: float = 0
    totalAmount: float = 0
    totalTaxes: float = 0
    grandTotal: float = 0
    outstandingAmount: float = 0
    calculatedDiscountAmount: float = 0
    status: str = 'Draft'
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None