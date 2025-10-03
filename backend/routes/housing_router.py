from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.housing import Property, HousingStaff, HousingMaintenance, HousingPurchase
from datetime import datetime

router = APIRouter()

# Collections
properties_collection = db.properties
housing_staff_collection = db.housing_staff
housing_maintenance_collection = db.housing_maintenance
housing_purchases_collection = db.housing_purchases

# Properties CRUD
@router.get("/properties/")
async def get_properties():
    items = []
    async for item in properties_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(Property(**item_copy))
    return items

@router.post("/properties/")
async def create_property(item: Property):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await properties_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/properties/{item_id}")
async def get_property(item_id: str):
    item = await properties_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Property not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])
    item_copy = item.copy()
    item_copy.pop("_id", None)
    return Property(**item_copy)

@router.put("/properties/{item_id}")
async def update_property(item_id: str, item: Property):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await properties_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    item.id = item_id
    return item

@router.delete("/properties/{item_id}")
async def delete_property(item_id: str):
    result = await properties_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted"}

# Housing Staff CRUD
@router.get("/staff/")
async def get_housing_staff():
    items = []
    async for item in housing_staff_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(HousingStaff(**item_copy))
    return items

@router.post("/staff/")
async def create_housing_staff(item: HousingStaff):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_staff_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/staff/{item_id}")
async def get_housing_staff(item_id: str):
    item = await housing_staff_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Housing staff not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])
    item_copy = item.copy()
    item_copy.pop("_id", None)
    return HousingStaff(**item_copy)

@router.put("/staff/{item_id}")
async def update_housing_staff(item_id: str, item: HousingStaff):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_staff_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Housing staff not found")
    item.id = item_id
    return item

@router.delete("/staff/{item_id}")
async def delete_housing_staff(item_id: str):
    result = await housing_staff_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Housing staff not found")
    return {"message": "Housing staff deleted"}

# Housing Maintenance CRUD
@router.get("/maintenance/")
async def get_housing_maintenance():
    items = []
    async for item in housing_maintenance_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(HousingMaintenance(**item_copy))
    return items

@router.post("/maintenance/")
async def create_housing_maintenance(item: HousingMaintenance):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_maintenance_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/maintenance/{item_id}")
async def get_housing_maintenance(item_id: str):
    item = await housing_maintenance_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Housing maintenance not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])
    item_copy = item.copy()
    item_copy.pop("_id", None)
    return HousingMaintenance(**item_copy)

@router.put("/maintenance/{item_id}")
async def update_housing_maintenance(item_id: str, item: HousingMaintenance):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_maintenance_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Housing maintenance not found")
    item.id = item_id
    return item

@router.delete("/maintenance/{item_id}")
async def delete_housing_maintenance(item_id: str):
    result = await housing_maintenance_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Housing maintenance not found")
    return {"message": "Housing maintenance deleted"}

# Housing Purchases CRUD
@router.get("/purchases/")
async def get_housing_purchases():
    items = []
    async for item in housing_purchases_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(HousingPurchase(**item_copy))
    return items

@router.post("/purchases/")
async def create_housing_purchase(item: HousingPurchase):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_purchases_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/purchases/{item_id}")
async def get_housing_purchase(item_id: str):
    item = await housing_purchases_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Housing purchase not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])
    item_copy = item.copy()
    item_copy.pop("_id", None)
    return HousingPurchase(**item_copy)

@router.put("/purchases/{item_id}")
async def update_housing_purchase(item_id: str, item: HousingPurchase):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await housing_purchases_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Housing purchase not found")
    item.id = item_id
    return item

@router.delete("/purchases/{item_id}")
async def delete_housing_purchase(item_id: str):
    result = await housing_purchases_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Housing purchase not found")
    return {"message": "Housing purchase deleted"}

# Dashboard specific endpoints
@router.get("/dashboard/summary")
async def get_housing_dashboard_summary():
    """Get housing dashboard summary data"""
    # Total properties
    total_properties = await properties_collection.count_documents({})

    # Active staff
    active_staff = await housing_staff_collection.count_documents({"status": "Active"})

    # Active maintenance requests
    active_maintenance = await housing_maintenance_collection.count_documents({"status": {"$ne": "Completed"}})

    # Monthly expenses (sum of all property monthly costs)
    monthly_expenses_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$monthlyCost"}}}
    ]
    monthly_expenses_result = await properties_collection.aggregate(monthly_expenses_pipeline).to_list(length=1)
    monthly_expenses = monthly_expenses_result[0]["total"] if monthly_expenses_result else 0

    return {
        "totalProperties": total_properties,
        "activeStaff": active_staff,
        "activeMaintenance": active_maintenance,
        "monthlyExpenses": monthly_expenses
    }

@router.get("/properties/by-location/{location}")
async def get_properties_by_location(location: str):
    """Get properties filtered by location"""
    items = []
    query = {"location": {"$regex": location, "$options": "i"}} if location != "all" else {}
    async for item in properties_collection.find(query):
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(Property(**item_copy))
    return items

@router.get("/staff/by-property/{property_id}")
async def get_staff_by_property(property_id: str):
    """Get staff members for a specific property"""
    items = []
    async for item in housing_staff_collection.find({"propertyId": property_id}):
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(HousingStaff(**item_copy))
    return items

@router.get("/maintenance/by-property/{property_id}")
async def get_maintenance_by_property(property_id: str):
    """Get maintenance records for a specific property"""
    items = []
    async for item in housing_maintenance_collection.find({"propertyId": property_id}):
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        item_copy = item.copy()
        item_copy.pop("_id", None)
        items.append(HousingMaintenance(**item_copy))
    return items