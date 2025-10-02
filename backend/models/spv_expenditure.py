from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SPVExpenditure(BaseModel):
    id: Optional[str] = None
    category: str
    amount: str
    date: str
    status: str
    description: str
    spv: str
    property: str
    frequency: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None