from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.spv_expenditure import SPVExpenditure

router = APIRouter()
collection = db.spv_expenditures

@router.get("/")
async def get_spv_expenditures():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(SPVExpenditure(**item))
    return items

@router.post("/")
async def create_spv_expenditure(item: SPVExpenditure):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_spv_expenditure(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="SPV expenditure not found")
    item["_id"] = str(item["_id"])
    return SPVExpenditure(**item)

@router.put("/{item_id}")
async def update_spv_expenditure(item_id: str, item: SPVExpenditure):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="SPV expenditure not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_spv_expenditure(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="SPV expenditure not found")
    return {"message": "SPV expenditure deleted"}