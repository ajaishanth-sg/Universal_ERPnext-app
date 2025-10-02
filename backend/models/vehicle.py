from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Vehicle(BaseModel):
    id: Optional[str] = None
    make: str
    model: str
    year: Optional[str] = None
    plate: str
    vin: Optional[str] = None
    status: str = 'Active'
    driver: Optional[str] = None
    location: Optional[str] = None
    mileage: Optional[float] = None
    fuelType: str = 'Petrol'
    fuelEfficiency: Optional[str] = None
    nextPM: Optional[str] = None
    insuranceExpiry: Optional[str] = None
    registrationExpiry: Optional[str] = None
    purchaseDate: Optional[str] = None
    purchasePrice: Optional[str] = None
    color: Optional[str] = None
    seats: Optional[int] = None
    engineSize: Optional[str] = None
    transmission: str = 'Automatic'
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None