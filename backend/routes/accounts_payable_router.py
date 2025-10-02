from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.accounts_payable import AccountsPayable

router = APIRouter()
collection = db.accounts_payable

@router.get("/")
async def get_accounts_payable():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(AccountsPayable(**item))
    return items

@router.post("/")
async def create_accounts_payable(item: AccountsPayable):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_accounts_payable_item(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Accounts payable not found")
    item["_id"] = str(item["_id"])
    return AccountsPayable(**item)

@router.put("/{item_id}")
async def update_accounts_payable_item(item_id: str, item: AccountsPayable):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Accounts payable not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_accounts_payable_item(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Accounts payable not found")
    return {"message": "Accounts payable deleted"}