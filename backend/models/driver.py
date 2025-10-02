from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EmergencyContact(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relation: Optional[str] = None

class Driver(BaseModel):
    id: Optional[str] = None
    name: str
    employeeId: str
    email: str
    phone: str
    dateOfBirth: Optional[str] = None
    nationality: Optional[str] = None
    licenseNumber: str
    licenseType: str = 'Full'
    licenseExpiry: str
    experience: Optional[str] = None
    hireDate: Optional[str] = None
    salary: Optional[float] = None
    status: str = 'Active'
    assignedVehicle: Optional[str] = None
    location: Optional[str] = None
    emergencyContact: EmergencyContact = EmergencyContact()
    address: Optional[str] = None
    performance: str = 'Good'
    rating: float = 4.0
    totalTrips: int = 0
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None