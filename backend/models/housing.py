from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Property(BaseModel):
    id: Optional[str] = None
    name: str
    type: str  # Villa, Apartment, Penthouse, etc.
    location: str
    address: str
    country: str
    city: str
    monthlyCost: float
    currency: str = "USD"
    status: str = "Active"  # Active, Inactive, Maintenance
    staffCount: int = 0
    bedrooms: int = 0
    bathrooms: int = 0
    squareFootage: Optional[float] = None
    purchaseDate: Optional[str] = None
    purchasePrice: Optional[float] = None
    currentValue: Optional[float] = None
    description: Optional[str] = None
    amenities: List[str] = []
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class HousingStaff(BaseModel):
    id: Optional[str] = None
    name: str
    position: str  # House Manager, Chef, Housekeeper, Security, etc.
    propertyId: str
    propertyName: str
    location: str
    employmentType: str = "Full-time"  # Full-time, Part-time, Contract
    salary: float
    currency: str = "USD"
    status: str = "Active"  # Active, Inactive, On Leave
    hireDate: str
    experience: Optional[str] = None
    contactNumber: Optional[str] = None
    email: Optional[str] = None
    emergencyContact: Optional[str] = None
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class HousingMaintenance(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    propertyId: str
    propertyName: str
    location: str
    priority: str = "Medium"  # Low, Medium, High, Critical
    status: str = "Pending"  # Pending, In Progress, Completed, Cancelled
    category: str = "General"  # General, Plumbing, Electrical, Cleaning, etc.
    estimatedCost: float
    actualCost: Optional[float] = None
    currency: str = "USD"
    scheduledDate: Optional[str] = None
    completionDate: Optional[str] = None
    assignedTo: Optional[str] = None
    assignedTechnician: Optional[str] = None
    notes: Optional[str] = None
    beforePhotos: List[str] = []
    afterPhotos: List[str] = []
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class HousingPurchase(BaseModel):
    id: Optional[str] = None
    propertyId: str
    propertyName: str
    itemName: str
    category: str  # Furniture, Appliances, Cleaning, Maintenance, etc.
    quantity: int
    unitPrice: float
    totalCost: float
    currency: str = "USD"
    supplier: str
    purchaseDate: str
    deliveryDate: Optional[str] = None
    status: str = "Ordered"  # Ordered, Delivered, Cancelled
    invoiceNumber: Optional[str] = None
    receipt: Optional[str] = None
    notes: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None