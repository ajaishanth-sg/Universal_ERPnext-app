from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SPVCompany(BaseModel):
    id: Optional[str] = None
    name: str
    type: str
    location: str
    status: str
    totalAssets: str
    managedProperties: List[str]
    lastTransaction: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None