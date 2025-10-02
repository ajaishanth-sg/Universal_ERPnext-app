from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Inventory(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    quantity: float
    minQuantity: float
    maxQuantity: float
    location: str
    supplier: str
    partNumber: str
    unitCost: float
    totalValue: float
    lastRestocked: Optional[str] = None
    expiryDate: Optional[str] = None
    status: str
    notes: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None