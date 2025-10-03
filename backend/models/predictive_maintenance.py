from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PredictiveMaintenanceAlert(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: str  # 'vehicle', 'equipment', 'property'
    assetName: str
    alertType: str  # 'mileage_based', 'time_based', 'condition_based', 'usage_based'
    severity: str  # 'low', 'medium', 'high', 'critical'
    title: str
    description: str
    predictedFailureDate: str
    confidence: float  # 0-100 percentage
    recommendedAction: str
    estimatedCost: Optional[float] = None
    status: str = 'active'  # 'active', 'acknowledged', 'resolved', 'dismissed'
    assignedTo: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    resolvedAt: Optional[datetime] = None
    maintenanceScheduled: Optional[str] = None

class MaintenancePrediction(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: str
    predictionModel: str  # 'mileage_regression', 'time_series', 'condition_monitoring'
    currentValue: float
    thresholdValue: float
    predictedDate: str
    confidence: float
    factors: List[str]  # Factors influencing the prediction
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class AssetHealthScore(BaseModel):
    id: Optional[str] = None
    assetId: str
    assetType: str
    overallScore: float  # 0-100
    components: dict  # Component-specific scores
    lastCalculated: Optional[datetime] = None
    trend: str  # 'improving', 'stable', 'declining'
    recommendations: List[str]