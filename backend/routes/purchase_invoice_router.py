from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.purchase_invoice import PurchaseInvoice

router = APIRouter()
collection = db.purchase_invoices

@router.get("/")
async def get_purchase_invoices():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(PurchaseInvoice(**item))
    return items

@router.post("/")
async def create_purchase_invoice(item: PurchaseInvoice):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_purchase_invoice(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Purchase invoice not found")
    item["_id"] = str(item["_id"])
    return PurchaseInvoice(**item)

@router.put("/{item_id}")
async def update_purchase_invoice(item_id: str, item: PurchaseInvoice):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Purchase invoice not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_purchase_invoice(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Purchase invoice not found")
    return {"message": "Purchase invoice deleted"}