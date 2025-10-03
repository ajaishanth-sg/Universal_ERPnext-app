from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.accounts_receivable import AccountsReceivable, AccountsReceivablePayment
from datetime import datetime

router = APIRouter()
accounts_receivable_collection = db.accounts_receivable
payments_collection = db.accounts_receivable_payments

# Accounts Receivable CRUD
@router.get("/")
async def get_accounts_receivable():
    items = []
    async for item in accounts_receivable_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        # Remove the MongoDB _id field from the item dict before creating AccountsReceivable
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(AccountsReceivable(**item_copy))
    return items

@router.post("/")
async def create_accounts_receivable(item: AccountsReceivable):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await accounts_receivable_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_accounts_receivable(item_id: str):
    item = await accounts_receivable_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Accounts receivable not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])
    item_copy = item.copy()
    item_copy.pop("_id", None)
    return AccountsReceivable(**item_copy)

@router.put("/{item_id}")
async def update_accounts_receivable(item_id: str, item: AccountsReceivable):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await accounts_receivable_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Accounts receivable not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_accounts_receivable(item_id: str):
    result = await accounts_receivable_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Accounts receivable not found")
    return {"message": "Accounts receivable deleted"}

# Payments CRUD
@router.get("/payments/")
async def get_payments():
    items = []
    async for item in payments_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(AccountsReceivablePayment(**item_copy))
    return items

@router.post("/payments/")
async def create_payment(item: AccountsReceivablePayment):
    item.createdAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await payments_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)

    # Update the outstanding amount in the receivable
    receivable = await accounts_receivable_collection.find_one({"_id": ObjectId(item.receivableId)})
    if receivable:
        new_outstanding = receivable["outstandingAmount"] - item.amount
        if new_outstanding < 0:
            new_outstanding = 0
        await accounts_receivable_collection.update_one(
            {"_id": ObjectId(item.receivableId)},
            {"$set": {"outstandingAmount": new_outstanding, "updatedAt": datetime.utcnow()}}
        )

    return item

# Dashboard specific endpoints
@router.get("/aging-summary")
async def get_receivable_aging_summary():
    """Get accounts receivable aging summary for dashboard"""
    pipeline = [
        {"$group": {
            "_id": "$age",
            "total": {"$sum": "$outstandingAmount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    result = await accounts_receivable_collection.aggregate(pipeline).to_list(length=None)

    return result

@router.get("/overdue")
async def get_overdue_receivables():
    """Get overdue accounts receivable"""
    current_date = datetime.now().strftime("%Y-%m-%d")
    overdue_items = []

    async for item in accounts_receivable_collection.find({"dueDate": {"$lt": current_date}, "status": {"$ne": "Paid"}}):
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        overdue_items.append(AccountsReceivable(**item_copy))

    return overdue_items