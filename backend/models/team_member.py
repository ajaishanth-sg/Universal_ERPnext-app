from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EmergencyContact(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relation: Optional[str] = None

class TeamMember(BaseModel):
    id: Optional[str] = None
    name: str
    role: str  # 'Lead Driver', 'Driver', 'Reserve Driver', 'Team Principal', 'Race Engineer', 'Mechanic'
    status: str  # 'Active', 'Inactive', 'On Leave', 'Injured'
    location: str
    phone: str
    email: str
    joinDate: str
    experience: Optional[str] = None
    performance: Optional[str] = None  # 'Excellent', 'Good', 'Needs Improvement', 'Poor'
    rating: float = 0
    racesCompleted: int = 0
    wins: int = 0
    podiums: int = 0
    championshipPoints: int = 0
    salary: float = 0
    contractExpiry: Optional[str] = None
    specializations: List[str] = []
    certifications: List[str] = []
    emergencyContact: Optional[EmergencyContact] = None
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None