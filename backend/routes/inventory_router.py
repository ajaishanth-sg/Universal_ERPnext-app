from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.inventory import Inventory

router = APIRouter()
collection = db.inventory

@router.get("/")
async def get_inventory():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(Inventory(**item))
    return items

@router.post("/")
async def create_inventory(item: Inventory):
    try:
        item_dict = item.dict(exclude_unset=True)
        result = await collection.insert_one(item_dict)
        item.id = str(result.inserted_id)
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{item_id}")
async def get_inventory_item(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return Inventory(**item)

@router.put("/{item_id}")
async def update_inventory_item(item_id: str, item: Inventory):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_inventory_item(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": "Inventory item deleted"}