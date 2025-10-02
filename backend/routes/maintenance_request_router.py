from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.maintenance_request import MaintenanceRequest
from typing import Dict, Any

router = APIRouter()
collection = db.maintenance_requests

@router.get("/")
async def get_maintenance_requests():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(MaintenanceRequest(**item))
    return items

@router.post("/")
async def create_maintenance_request(item: MaintenanceRequest):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_maintenance_request(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return MaintenanceRequest(**item)

@router.put("/{item_id}")
async def update_maintenance_request(item_id: str, updates: Dict[str, Any]):
    # Handle case where item_id might be "undefined" or invalid
    if item_id == "undefined" or not item_id:
        raise HTTPException(status_code=400, detail="Invalid item ID")

    try:
        object_id = ObjectId(item_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    # Get existing item
    existing_item = await collection.find_one({"_id": object_id})
    if not existing_item:
        raise HTTPException(status_code=404, detail="Maintenance request not found")

    # Update only provided fields
    update_dict = {"$set": updates}
    result = await collection.update_one({"_id": object_id}, update_dict)

    # Get updated item
    updated_item = await collection.find_one({"_id": object_id})
    updated_item["_id"] = str(updated_item["_id"])
    updated_item["id"] = updated_item["_id"]

    return MaintenanceRequest(**updated_item)

@router.delete("/{item_id}")
async def delete_maintenance_request(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    return {"message": "Maintenance request deleted"}