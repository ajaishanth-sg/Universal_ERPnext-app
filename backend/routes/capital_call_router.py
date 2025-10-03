from fastapi import APIRouter, HTTPException, BackgroundTasks
from bson import ObjectId
from database import db
from models.capital_call import CapitalCall, CapitalCallStatus, InvestmentType
from models.email_approval import ApprovalType
from typing import Dict, Any, List
from datetime import datetime, date
import uuid

router = APIRouter()
collection = db.capital_calls

@router.get("/")
async def get_capital_calls(status: str = None):
    """Get all capital calls, optionally filtered by status"""
    query = {}
    if status:
        query["status"] = status

    items = []
    async for item in collection.find(query).sort("created_at", -1):
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(CapitalCall(**item))
    return items

@router.post("/")
async def create_capital_call(capital_call: CapitalCall):
    """Create a new capital call"""
    call_dict = capital_call.dict(exclude_unset=True)
    call_dict["created_at"] = datetime.utcnow()
    call_dict["updated_at"] = datetime.utcnow()

    # Generate call number if not provided
    if not call_dict.get("call_number"):
        call_dict["call_number"] = f"CC-{datetime.now().strftime('%Y-%m-%d')}-{str(uuid.uuid4())[:8].upper()}"

    result = await collection.insert_one(call_dict)

    return {"message": "Capital call created", "id": str(result.inserted_id)}

@router.get("/{call_id}")
async def get_capital_call(call_id: str):
    """Get specific capital call"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    call = await collection.find_one({"_id": object_id})
    if not call:
        raise HTTPException(status_code=404, detail="Capital call not found")

    call["_id"] = str(call["_id"])
    call["id"] = call["_id"]
    return CapitalCall(**call)

@router.put("/{call_id}")
async def update_capital_call(call_id: str, updates: Dict[str, Any]):
    """Update capital call"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    existing_call = await collection.find_one({"_id": object_id})
    if not existing_call:
        raise HTTPException(status_code=404, detail="Capital call not found")

    # Update only provided fields
    update_dict = {"$set": updates}
    update_dict["$set"]["updated_at"] = datetime.utcnow()

    result = await collection.update_one({"_id": object_id}, update_dict)

    # Get updated call
    updated_call = await collection.find_one({"_id": object_id})
    updated_call["_id"] = str(updated_call["_id"])
    updated_call["id"] = updated_call["_id"]

    return CapitalCall(**updated_call)

@router.delete("/{call_id}")
async def delete_capital_call(call_id: str):
    """Delete capital call"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    result = await collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Capital call not found")

    return {"message": "Capital call deleted"}

@router.post("/{call_id}/approve")
async def approve_capital_call(call_id: str, background_tasks: BackgroundTasks):
    """Approve capital call and send alerts to investors"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    call = await collection.find_one({"_id": object_id})
    if not call:
        raise HTTPException(status_code=404, detail="Capital call not found")

    if call["status"] != CapitalCallStatus.PENDING_APPROVAL.value:
        raise HTTPException(status_code=400, detail="Capital call not pending approval")

    # Update status
    await collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": CapitalCallStatus.APPROVED.value,
                "approved_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    )

    # Send alerts to investors (implement email service)
    # background_tasks.add_task(send_capital_call_alerts, call)

    return {"message": "Capital call approved and investor alerts queued"}

@router.post("/{call_id}/send-alerts")
async def send_capital_call_alerts(call_id: str, background_tasks: BackgroundTasks):
    """Send capital call alerts to investors"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    call = await collection.find_one({"_id": object_id})
    if not call:
        raise HTTPException(status_code=404, detail="Capital call not found")

    if call["status"] != CapitalCallStatus.APPROVED.value:
        raise HTTPException(status_code=400, detail="Capital call must be approved before sending alerts")

    # Update alert status
    await collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "alert_sent": True,
                "alert_sent_at": datetime.utcnow(),
                "status": CapitalCallStatus.SENT.value,
                "updated_at": datetime.utcnow()
            }
        }
    )

    # Send email alerts to all investors
    # background_tasks.add_task(send_investor_alerts, call)

    return {"message": "Capital call alerts sent to investors"}

@router.get("/investor/{investor_id}")
async def get_investor_capital_calls(investor_id: str):
    """Get capital calls for a specific investor"""
    items = []
    async for item in collection.find({"investor_commitments.investor_id": investor_id}):
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(CapitalCall(**item))
    return items

@router.get("/stats/summary")
async def get_capital_call_stats():
    """Get capital call statistics"""
    pipeline = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1},
                "total_amount": {"$sum": "$called_amount"}
            }
        }
    ]

    stats = {}
    async for stat in collection.aggregate(pipeline):
        stats[stat["_id"]] = {
            "count": stat["count"],
            "total_amount": stat["total_amount"]
        }

    return {
        "total_calls": sum(stat["count"] for stat in stats.values()),
        "total_called_amount": sum(stat["total_amount"] for stat in stats.values()),
        "by_status": stats
    }

@router.post("/{call_id}/update-payment")
async def update_investor_payment(call_id: str, payment_data: Dict[str, Any]):
    """Update investor payment status"""
    try:
        object_id = ObjectId(call_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid capital call ID")

    call = await collection.find_one({"_id": object_id})
    if not call:
        raise HTTPException(status_code=404, detail="Capital call not found")

    investor_id = payment_data["investor_id"]
    payment_amount = payment_data["payment_amount"]
    payment_status = payment_data.get("payment_status", "paid")

    # Find and update investor commitment
    for commitment in call["investor_commitments"]:
        if commitment["investor_id"] == investor_id:
            commitment["paid_amount"] += payment_amount
            commitment["remaining_amount"] -= payment_amount
            commitment["payment_status"] = payment_status
            commitment["payment_date"] = date.today().isoformat()
            break

    # Update call totals
    total_paid = sum(commitment["paid_amount"] for commitment in call["investor_commitments"])
    total_remaining = sum(commitment["remaining_amount"] for commitment in call["investor_commitments"])

    # Determine overall status
    if total_paid == 0:
        new_status = CapitalCallStatus.SENT.value
    elif total_remaining == 0:
        new_status = CapitalCallStatus.FULLY_FUNDED.value
    else:
        new_status = CapitalCallStatus.PARTIALLY_FUNDED.value

    await collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "investor_commitments": call["investor_commitments"],
                "status": new_status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Payment updated successfully", "new_status": new_status}