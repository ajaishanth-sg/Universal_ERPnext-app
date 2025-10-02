from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MaintenanceScheduling(BaseModel):
    id: Optional[str] = None
    vehicle: str
    plate: str
    description: str
    category: str  # 'CM' for Corrective Maintenance
    status: str  # 'Scheduled', 'In Progress', 'Completed', 'Pending Approval', 'Cancelled'
    priority: str  # 'High', 'Medium', 'Low'
    scheduledDate: str
    estimatedDuration: Optional[str] = None
    estimatedCost: float = 0
    assignedTechnician: Optional[str] = None
    location: Optional[str] = None
    partsRequired: List[str] = []
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None