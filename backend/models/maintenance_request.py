from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceRequest(BaseModel):
    id: Optional[str] = None
    property: str
    location: str
    title: str
    description: str
    priority: str  # 'High', 'Medium', 'Low'
    status: str  # 'Pending Approval', 'In Progress', 'Completed', 'Pending Quote', 'Scheduled', 'Cancelled'
    assignedTo: Optional[str] = None
    estimatedCost: str
    requestedDate: str
    dueDate: str
    category: str  # 'HVAC', 'Electrical', 'Plumbing', 'Cleaning', 'Landscaping', 'Security', 'Renovation', 'Other'
    urgency: str  # 'Critical', 'Important', 'Normal', 'Routine'
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None