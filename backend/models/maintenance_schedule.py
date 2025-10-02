from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceSchedule(BaseModel):
    id: Optional[str] = None
    property: str
    task: str
    frequency: str  # 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'
    lastCompleted: str
    nextDue: str
    assignedTo: str
    cost: str
    status: str  # 'Scheduled', 'Active', 'Due Soon', 'Overdue', 'Completed', 'Cancelled'
    description: Optional[str] = None
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None