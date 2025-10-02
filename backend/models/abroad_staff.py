from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AbroadStaff(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    location: str
    department: str
    salary: str
    status: str
    contractEnd: str
    performance: str
    lastReview: str
    spv: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None