from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PurchaseItem(BaseModel):
    id: int
    item: Optional[str] = None
    acceptedQty: float = 0
    rate: float = 0
    amount: float = 0

class PurchaseTaxCharge(BaseModel):
    id: int
    type: Optional[str] = None
    accountHead: Optional[str] = None
    taxRate: float = 0
    amount: float = 0
    total: float = 0

class PurchaseInvoice(BaseModel):
    id: Optional[str] = None
    series: str
    date: str
    supplier: str
    postingTime: Optional[str] = None
    dueDate: Optional[str] = None
    isPaid: bool = False
    isReturn: bool = False
    applyTaxWithholding: bool = False
    isReverseCharge: bool = False
    editPostingDateTime: bool = False
    updateStock: bool = False
    isSubcontracted: bool = False
    taxCategory: Optional[str] = None
    shippingRule: Optional[str] = None
    incoterm: Optional[str] = None
    purchaseTaxTemplate: Optional[str] = None
    useCompanyRoundOff: bool = False
    items: List[PurchaseItem] = []
    taxCharges: List[PurchaseTaxCharge] = []
    totalQuantity: float = 0
    totalAmount: float = 0
    totalTaxesAdded: float = 0
    grandTotal: float = 0
    status: str = 'Draft'
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None