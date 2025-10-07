from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class MaintenancePriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class MaintenanceStatus(str, Enum):
    PREDICTED = "Predicted"
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class AssetType(str, Enum):
    VEHICLE = "Vehicle"
    EQUIPMENT = "Equipment"
    FACILITY = "Facility"
    OTHER = "Other"

class PredictiveMaintenanceAlert(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: AssetType
    assetName: str
    assetModel: Optional[str] = None
    licensePlate: Optional[str] = None  # For vehicles

    # Prediction details
    predictedFailureDate: date
    confidenceLevel: float  # 0-100 percentage
    failureComponent: str
    failureDescription: str

    # Maintenance details
    recommendedAction: str
    estimatedCost: Optional[float] = None
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    status: MaintenanceStatus = MaintenanceStatus.PREDICTED

    # Scheduling
    scheduledDate: Optional[date] = None
    assignedTechnician: Optional[str] = None
    estimatedDuration: Optional[int] = None  # hours

    # Historical data used for prediction
    currentMileage: Optional[float] = None
    currentHours: Optional[int] = None
    lastMaintenanceDate: Optional[date] = None
    maintenanceHistory: List[str] = []  # List of past maintenance record IDs

    # Prediction algorithm info
    algorithmUsed: str = "Machine Learning"
    factorsConsidered: List[str] = []
    predictionAccuracy: Optional[float] = None

    # Notifications
    notificationsSent: List[datetime] = []
    lastNotificationDate: Optional[datetime] = None

    # Audit fields
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    resolvedAt: Optional[datetime] = None
    resolvedBy: Optional[str] = None

class MaintenancePredictionConfig(BaseModel):
    id: Optional[str] = None
    assetType: AssetType
    componentType: str  # Engine, Transmission, Brakes, etc.

    # Prediction parameters
    mileageThreshold: Optional[float] = None
    hoursThreshold: Optional[int] = None
    daysThreshold: Optional[int] = None

    # Algorithm settings
    lookbackPeriod: int = 365  # days
    confidenceThreshold: float = 75.0  # minimum confidence to create alert

    # Cost estimation
    averageRepairCost: Optional[float] = None
    costCalculationMethod: str = "Historical Average"

    isActive: bool = True
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class MaintenanceAnalytics(BaseModel):
    id: Optional[str] = None
    assetType: AssetType
    assetId: str

    # Analytics data
    totalMaintenanceCost: float = 0.0
    averageMaintenanceCost: float = 0.0
    maintenanceFrequency: int = 0  # per year
    downtimeHours: float = 0.0
    uptimePercentage: float = 100.0

    # Prediction accuracy
    predictionsMade: int = 0
    accuratePredictions: int = 0
    predictionAccuracyRate: float = 0.0

    # Trends
    costTrend: str = "Stable"  # Increasing, Decreasing, Stable
    reliabilityTrend: str = "Stable"

    lastCalculated: Optional[datetime] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class MaintenancePrediction(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: AssetType
    component: str
    predictedFailureDate: date
    confidenceLevel: float
    failureMode: str
    recommendedAction: str
    estimatedCost: Optional[float] = None
    riskLevel: str = "Medium"  # Low, Medium, High, Critical
    factors: List[str] = []
    algorithm: str = "Machine Learning"
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class AssetHealthScore(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: AssetType
    assetName: str

    # Health scores (0-100)
    overallScore: float = 100.0
    engineScore: Optional[float] = None
    transmissionScore: Optional[float] = None
    brakeScore: Optional[float] = None
    tireScore: Optional[float] = None
    electricalScore: Optional[float] = None

    # Contributing factors
    mileage: Optional[float] = None
    age: Optional[int] = None  # years
    maintenanceHistory: Optional[int] = None  # number of maintenance events
    lastMaintenanceDate: Optional[date] = None

    # Recommendations
    recommendations: List[str] = []
    nextMaintenanceDue: Optional[date] = None

    # Status
    healthStatus: str = "Good"  # Excellent, Good, Fair, Poor, Critical
    riskLevel: str = "Low"  # Low, Medium, High

    calculatedAt: Optional[datetime] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None