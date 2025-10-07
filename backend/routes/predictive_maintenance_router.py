from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from database import db
from models.predictive_maintenance import (
    PredictiveMaintenanceAlert,
    MaintenancePredictionConfig,
    MaintenanceAnalytics,
    AssetType,
    MaintenanceStatus,
    MaintenancePriority
)
from datetime import datetime, date, timedelta
from typing import List, Optional
import random

router = APIRouter()
alerts_collection = db.predictive_maintenance_alerts
config_collection = db.maintenance_prediction_config
analytics_collection = db.maintenance_analytics

# Predictive Maintenance Alerts Routes
@router.get("/alerts")
async def get_maintenance_alerts(
    status: Optional[MaintenanceStatus] = None,
    priority: Optional[MaintenancePriority] = None,
    asset_type: Optional[AssetType] = None,
    limit: int = Query(default=50, le=200)
):
    """Get all predictive maintenance alerts with optional filtering"""
    query = {}

    if status:
        query["status"] = status.value
    if priority:
        query["priority"] = priority.value
    if asset_type:
        query["assetType"] = asset_type.value

    items = []
    cursor = alerts_collection.find(query).sort("predictedFailureDate", 1).limit(limit)

    async for item in cursor:
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]

        # Handle data conversion for backward compatibility
        try:
            # Convert enum values if they're stored as strings
            if "assetType" in item and isinstance(item["assetType"], str):
                item["assetType"] = item["assetType"].title()  # Convert 'vehicle' to 'Vehicle'

            # Map status values to new enum values
            if "status" in item and isinstance(item["status"], str):
                status_value = item["status"].lower()
                if status_value == "active":
                    item["status"] = "Predicted"  # Map existing "Active" to "Predicted"
                else:
                    item["status"] = item["status"].title()

            # Set default values for missing required fields
            if "confidenceLevel" not in item:
                item["confidenceLevel"] = 85.0
            if "failureComponent" not in item:
                item["failureComponent"] = "General"
            if "failureDescription" not in item:
                item["failureDescription"] = "Maintenance required"
            if "recommendedAction" not in item:
                item["recommendedAction"] = "Schedule maintenance inspection"
            if "predictedFailureDate" not in item:
                from datetime import date
                item["predictedFailureDate"] = date.today().isoformat()

            items.append(PredictiveMaintenanceAlert(**item))
        except Exception as e:
            print(f"Error processing alert item: {e}")
            continue

    return items

@router.post("/alerts")
async def create_maintenance_alert(alert: PredictiveMaintenanceAlert):
    """Create a new predictive maintenance alert"""
    alert_dict = alert.dict(exclude_unset=True)
    alert_dict["createdAt"] = datetime.utcnow()

    result = await alerts_collection.insert_one(alert_dict)
    alert.id = str(result.inserted_id)

    # Update analytics
    await update_maintenance_analytics(alert.assetId, alert.assetType)

    return alert

@router.get("/alerts/{alert_id}")
async def get_maintenance_alert(alert_id: str):
    """Get a specific maintenance alert"""
    item = await alerts_collection.find_one({"_id": ObjectId(alert_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")

    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return PredictiveMaintenanceAlert(**item)

@router.put("/alerts/{alert_id}")
async def update_maintenance_alert(alert_id: str, alert: PredictiveMaintenanceAlert):
    """Update a maintenance alert"""
    alert_dict = alert.dict(exclude_unset=True)
    alert_dict["updatedAt"] = datetime.utcnow()

    result = await alerts_collection.replace_one(
        {"_id": ObjectId(alert_id)},
        alert_dict
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")

    alert.id = alert_id
    return alert

@router.delete("/alerts/{alert_id}")
async def delete_maintenance_alert(alert_id: str):
    """Delete a maintenance alert"""
    result = await alerts_collection.delete_one({"_id": ObjectId(alert_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")
    return {"message": "Maintenance alert deleted"}

@router.post("/alerts/generate-predictions")
async def generate_maintenance_predictions():
    """Generate predictive maintenance alerts based on asset data"""
    # Get all vehicles
    vehicles_collection = db.vehicles
    vehicles = await vehicles_collection.find().to_list(None)

    new_alerts = []

    for vehicle in vehicles:
        # Simulate predictive analysis based on mileage and last maintenance
        current_mileage = vehicle.get("mileage", 0)
        last_maintenance = vehicle.get("lastMaintenanceDate")

        # Simple prediction logic (in real scenario, use ML models)
        if current_mileage > 50000:  # Example threshold
            # Check if alert already exists
            existing_alert = await alerts_collection.find_one({
                "assetId": str(vehicle["_id"]),
                "status": {"$in": ["Predicted", "Scheduled"]}
            })

            if not existing_alert:
                alert = PredictiveMaintenanceAlert(
                    assetId=str(vehicle["_id"]),
                    assetType=AssetType.VEHICLE,
                    assetName=f"{vehicle.get('make', 'Unknown')} {vehicle.get('model', 'Vehicle')}",
                    licensePlate=vehicle.get("plate"),
                    predictedFailureDate=date.today() + timedelta(days=random.randint(30, 90)),
                    confidenceLevel=round(random.uniform(75, 95), 2),
                    failureComponent="Engine",
                    failureDescription="Predicted engine maintenance based on mileage analysis",
                    recommendedAction="Schedule engine inspection and oil change",
                    estimatedCost=500.0,
                    priority=MaintenancePriority.HIGH if current_mileage > 80000 else MaintenancePriority.MEDIUM,
                    currentMileage=current_mileage,
                    factorsConsidered=["Mileage", "Time since last service", "Vehicle age"],
                    createdBy="System",
                    createdAt=datetime.utcnow()
                )

                alert_dict = alert.dict(exclude_unset=True)
                result = await alerts_collection.insert_one(alert_dict)
                alert.id = str(result.inserted_id)
                new_alerts.append(alert)

    return {
        "message": f"Generated {len(new_alerts)} new predictive maintenance alerts",
        "alerts": new_alerts
    }

# Configuration Routes
@router.get("/config")
async def get_prediction_configs():
    """Get all prediction configurations"""
    items = []
    async for item in config_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(MaintenancePredictionConfig(**item))
    return items

@router.post("/config")
async def create_prediction_config(config: MaintenancePredictionConfig):
    """Create a new prediction configuration"""
    config_dict = config.dict(exclude_unset=True)
    result = await config_collection.insert_one(config_dict)
    config.id = str(result.inserted_id)
    return config

# Analytics Routes
@router.get("/analytics")
async def get_maintenance_analytics(asset_type: Optional[AssetType] = None):
    """Get maintenance analytics"""
    query = {}
    if asset_type:
        query["assetType"] = asset_type.value

    items = []
    async for item in analytics_collection.find(query):
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(MaintenanceAnalytics(**item))
    return items

@router.get("/analytics/{asset_id}")
async def get_asset_analytics(asset_id: str, asset_type: AssetType):
    """Get analytics for a specific asset"""
    item = await analytics_collection.find_one({
        "assetId": asset_id,
        "assetType": asset_type.value
    })

    if not item:
        # Create initial analytics record
        item = MaintenanceAnalytics(
            assetId=asset_id,
            assetType=asset_type,
            lastCalculated=datetime.utcnow()
        )
        item_dict = item.dict(exclude_unset=True)
        result = await analytics_collection.insert_one(item_dict)
        item.id = str(result.inserted_id)
    else:
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        item = MaintenanceAnalytics(**item)

    return item

async def update_maintenance_analytics(asset_id: str, asset_type: AssetType):
    """Update analytics when maintenance activities occur"""
    # This would typically involve complex calculations based on historical data
    # For now, we'll create a basic implementation
    analytics = await analytics_collection.find_one({
        "assetId": asset_id,
        "assetType": asset_type.value
    })

    if not analytics:
        analytics = {
            "assetId": asset_id,
            "assetType": asset_type.value,
            "totalMaintenanceCost": 0.0,
            "maintenanceFrequency": 0,
            "downtimeHours": 0.0,
            "predictionsMade": 0,
            "accuratePredictions": 0,
            "lastCalculated": datetime.utcnow()
        }
        await analytics_collection.insert_one(analytics)
    else:
        # Update existing analytics
        await analytics_collection.update_one(
            {"_id": analytics["_id"]},
            {"$set": {"lastCalculated": datetime.utcnow()}}
        )

# Dashboard summary endpoint
@router.get("/dashboard-summary")
async def get_maintenance_dashboard_summary():
    """Get summary data for the maintenance dashboard"""
    total_alerts = await alerts_collection.count_documents({})
    critical_alerts = await alerts_collection.count_documents({"priority": "Critical"})
    scheduled_alerts = await alerts_collection.count_documents({"status": "Scheduled"})
    completed_alerts = await alerts_collection.count_documents({"status": "Completed"})

    # Get alerts due in next 7 days
    next_week = date.today() + timedelta(days=7)
    urgent_alerts = await alerts_collection.count_documents({
        "predictedFailureDate": {"$lte": next_week.isoformat()},
        "status": "Predicted"
    })

    return {
        "totalAlerts": total_alerts,
        "criticalAlerts": critical_alerts,
        "scheduledAlerts": scheduled_alerts,
        "completedAlerts": completed_alerts,
        "urgentAlerts": urgent_alerts,
        "nextWeekDue": urgent_alerts
    }