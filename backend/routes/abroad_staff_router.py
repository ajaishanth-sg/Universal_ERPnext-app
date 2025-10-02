from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.abroad_staff import AbroadStaff

router = APIRouter()
collection = db.abroad_staff

@router.get("/")
async def get_abroad_staff():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(AbroadStaff(**item))
    return items

@router.post("/")
async def create_abroad_staff(item: AbroadStaff):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_abroad_staff_item(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Abroad staff not found")
    item["_id"] = str(item["_id"])
    return AbroadStaff(**item)

@router.put("/{item_id}")
async def update_abroad_staff_item(item_id: str, item: AbroadStaff):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Abroad staff not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_abroad_staff_item(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Abroad staff not found")
    return {"message": "Abroad staff deleted"}