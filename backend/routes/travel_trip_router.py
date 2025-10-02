from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import db
from models.travel_trip import TravelTrip

router = APIRouter()
collection = db.travel_trips

@router.get("/")
async def get_travel_trips():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(TravelTrip(**item))
    return items

@router.post("/")
async def create_travel_trip(item: TravelTrip):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.get("/{item_id}")
async def get_travel_trip(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Travel trip not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return TravelTrip(**item)

@router.put("/{item_id}")
async def update_travel_trip(item_id: str, item: TravelTrip):
    item_dict = item.dict(exclude_unset=True)
    result = await collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Travel trip not found")
    item.id = item_id
    return item

@router.delete("/{item_id}")
async def delete_travel_trip(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Travel trip not found")
    return {"message": "Travel trip deleted"}