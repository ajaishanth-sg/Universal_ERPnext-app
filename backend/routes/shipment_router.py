from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.shipment import Shipment

router = APIRouter()
collection = db.shipments

@router.get("/")
async def get_shipments():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(Shipment(**item))
    return items

@router.post("/")
async def create_shipment(item: Shipment):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_shipment(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Shipment not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return Shipment(**item)

@router.put("/{item_id}")
async def update_shipment(item_id: str, item: Shipment):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Shipment not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_shipment(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return {"message": "Shipment deleted"}