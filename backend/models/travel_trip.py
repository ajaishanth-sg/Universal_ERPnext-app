from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Traveler(BaseModel):
    name: str
    role: str
    status: str  # 'Confirmed', 'Pending', 'Cancelled'

class Transport(BaseModel):
    type: str
    airline: Optional[str] = None
    company: Optional[str] = None
    vessel: Optional[str] = None
    flightNumber: Optional[str] = None
    departure: Optional[str] = None
    arrival: Optional[str] = None
    date: Optional[str] = None

class Accommodation(BaseModel):
    hotel: Optional[str] = None
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    rooms: int = 0
    cost: float = 0

class TravelTrip(BaseModel):
    id: Optional[str] = None
    title: str
    type: str  # 'Race Event', 'Testing', 'Business', 'Logistics'
    status: str  # 'Confirmed', 'In Progress', 'Pending Approval', 'Completed', 'Cancelled'
    destination: str
    departureLocation: str
    startDate: str
    endDate: str
    travelers: List[Traveler] = []
    transport: dict  # {'outbound': Transport, 'return': Transport}
    accommodation: Accommodation
    estimatedCost: float = 0
    actualCost: float = 0
    purpose: Optional[str] = None
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdDate: Optional[str] = None
    lastUpdated: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None