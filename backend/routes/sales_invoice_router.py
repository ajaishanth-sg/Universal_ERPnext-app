from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.sales_invoice import SalesInvoice

router = APIRouter()
collection = db.sales_invoices

@router.get("/")
async def get_sales_invoices():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(SalesInvoice(**item))
    return items

@router.post("/")
async def create_sales_invoice(item: SalesInvoice):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_sales_invoice(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    item["_id"] = str(item["_id"])
    return SalesInvoice(**item)

@router.put("/{item_id}")
async def update_sales_invoice(item_id: str, item: SalesInvoice):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_sales_invoice(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    return {"message": "Sales invoice deleted"}