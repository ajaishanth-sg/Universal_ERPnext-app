from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Content(BaseModel):
    item: str
    quantity: float
    weight: str
    value: float

class Shipment(BaseModel):
    id: Optional[str] = None
    title: str
    type: str
    status: str
    origin: str
    destination: str
    departureDate: str
    estimatedArrival: str
    actualArrival: Optional[str] = None
    transportMethod: str
    carrier: str
    trackingNumber: str
    contents: List[Content]
    totalWeight: str
    totalValue: float
    insurance: float
    cost: float
    priority: str
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None