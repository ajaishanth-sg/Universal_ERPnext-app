from fastapi import APIRouter, HTTPException, BackgroundTasks
from bson import ObjectId
from database import db
from models.predictive_maintenance import PredictiveMaintenanceAlert, MaintenancePrediction, AssetHealthScore
from models.vehicle import Vehicle
from models.maintenance_schedule import MaintenanceSchedule
from services.maintenance_alert_service import maintenance_alert_service
from email_service import send_maintenance_alert_email
import asyncio
from typing import List

router = APIRouter()
alert_collection = db.predictive_maintenance_alerts
prediction_collection = db.maintenance_predictions
health_collection = db.asset_health_scores

@router.get("/alerts")
async def get_maintenance_alerts():
    """Get all maintenance alerts"""
    items = []
    async for item in alert_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(PredictiveMaintenanceAlert(**item))
    return items

@router.post("/alerts")
async def create_maintenance_alert(alert: PredictiveMaintenanceAlert):
    """Create a new maintenance alert"""
    alert_dict = alert.dict(exclude_unset=True)
    result = await alert_collection.insert_one(alert_dict)
    alert.id = str(result.inserted_id)
    return alert

@router.get("/alerts/{alert_id}")
async def get_maintenance_alert(alert_id: str):
    """Get a specific maintenance alert"""
    item = await alert_collection.find_one({"_id": ObjectId(alert_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return PredictiveMaintenanceAlert(**item)

@router.put("/alerts/{alert_id}")
async def update_maintenance_alert(alert_id: str, alert: PredictiveMaintenanceAlert):
    """Update a maintenance alert"""
    alert_dict = alert.dict(exclude_unset=True)
    result = await alert_collection.replace_one({"_id": ObjectId(alert_id)}, alert_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")
    alert.id = alert_id
    return alert

@router.delete("/alerts/{alert_id}")
async def delete_maintenance_alert(alert_id: str):
    """Delete a maintenance alert"""
    result = await alert_collection.delete_one({"_id": ObjectId(alert_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance alert not found")
    return {"message": "Maintenance alert deleted"}

@router.post("/analyze-vehicles")
async def analyze_vehicles(background_tasks: BackgroundTasks):
    """Analyze all vehicles and generate maintenance alerts"""
    try:
        # Get all vehicles and maintenance schedules
        vehicles = []
        async for vehicle in db.vehicles.find():
            vehicle["_id"] = str(vehicle["_id"])
            vehicle["id"] = vehicle["_id"]
            vehicles.append(Vehicle(**vehicle))

        schedules = []
        async for schedule in db.maintenance_schedules.find():
            schedule["_id"] = str(schedule["_id"])
            schedule["id"] = schedule["_id"]
            schedules.append(MaintenanceSchedule(**schedule))

        # Analyze and generate alerts
        alerts = await maintenance_alert_service.analyze_vehicle_maintenance(vehicles, schedules)

        # Save alerts to database
        saved_alerts = []
        for alert in alerts:
            alert_dict = alert.dict(exclude_unset=True)
            result = await alert_collection.insert_one(alert_dict)
            alert.id = str(result.inserted_id)
            saved_alerts.append(alert)

        # Send email notifications in background
        if saved_alerts:
            background_tasks.add_task(
                send_alert_notifications,
                saved_alerts,
                ["fleet.manager@universererp.com"]  # Default recipients
            )

        return {
            "message": f"Analysis complete. Generated {len(saved_alerts)} alerts.",
            "alerts": saved_alerts
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing vehicles: {str(e)}")

@router.get("/health-scores")
async def get_asset_health_scores():
    """Get all asset health scores"""
    items = []
    async for item in health_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(AssetHealthScore(**item))
    return items

@router.post("/health-scores/{asset_id}")
async def calculate_health_score(asset_id: str):
    """Calculate health score for a specific asset"""
    try:
        # Get vehicle data
        vehicle_data = await db.vehicles.find_one({"_id": ObjectId(asset_id)})
        if not vehicle_data:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        vehicle_data["_id"] = str(vehicle_data["_id"])
        vehicle_data["id"] = vehicle_data["_id"]
        vehicle = Vehicle(**vehicle_data)

        # Calculate health score
        health_score = await maintenance_alert_service.calculate_asset_health_score(vehicle)

        # Save to database
        health_dict = health_score.dict(exclude_unset=True)
        result = await health_collection.replace_one(
            {"assetId": asset_id},
            health_dict,
            upsert=True
        )

        return health_score

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating health score: {str(e)}")

@router.get("/predictions")
async def get_maintenance_predictions():
    """Get all maintenance predictions"""
    items = []
    async for item in prediction_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(MaintenancePrediction(**item))
    return items

@router.post("/predictions")
async def create_maintenance_prediction(prediction: MaintenancePrediction):
    """Create a new maintenance prediction"""
    prediction_dict = prediction.dict(exclude_unset=True)
    result = await prediction_collection.insert_one(prediction_dict)
    prediction.id = str(result.inserted_id)
    return prediction

@router.get("/dashboard-summary")
async def get_maintenance_dashboard_summary():
    """Get summary data for maintenance dashboard"""
    try:
        # Count alerts by severity
        alert_counts = await alert_collection.aggregate([
            {"$group": {"_id": "$severity", "count": {"$sum": 1}}}
        ]).to_list(None)

        # Count alerts by status
        status_counts = await alert_collection.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]).to_list(None)

        # Get recent alerts (last 7 days)
        from datetime import datetime, timedelta
        seven_days_ago = datetime.now() - timedelta(days=7)

        recent_alerts = []
        async for alert in alert_collection.find({
            "createdAt": {"$gte": seven_days_ago.isoformat()}
        }).limit(10):
            alert["_id"] = str(alert["_id"])
            alert["id"] = alert["_id"]
            recent_alerts.append(PredictiveMaintenanceAlert(**alert))

        # Get average health scores
        health_stats = await health_collection.aggregate([
            {"$group": {"_id": None, "avg_score": {"$avg": "$overallScore"}}}
        ]).to_list(None)

        return {
            "alert_counts": {item["_id"]: item["count"] for item in alert_counts},
            "status_counts": {item["_id"]: item["count"] for item in status_counts},
            "recent_alerts": recent_alerts,
            "average_health_score": health_stats[0]["avg_score"] if health_stats else 0,
            "total_assets": await health_collection.count_documents({})
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting dashboard summary: {str(e)}")

async def send_alert_notifications(alerts: List[PredictiveMaintenanceAlert], recipients: List[str]):
    """Send email notifications for alerts (background task)"""
    for alert in alerts:
        for recipient in recipients:
            try:
                await send_maintenance_alert_email(
                    recipient_email=recipient,
                    alert=alert
                )
            except Exception as e:
                print(f"Failed to send alert email: {str(e)}")