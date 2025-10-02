from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.spv_company import SPVCompany

router = APIRouter()
collection = db.spv_companies

@router.get("/")
async def get_spv_companies():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(SPVCompany(**item))
    return items

@router.post("/")
async def create_spv_company(item: SPVCompany):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_spv_company(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="SPV company not found")
    item["_id"] = str(item["_id"])
    return SPVCompany(**item)

@router.put("/{item_id}")
async def update_spv_company(item_id: str, item: SPVCompany):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="SPV company not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_spv_company(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="SPV company not found")
    return {"message": "SPV company deleted"}