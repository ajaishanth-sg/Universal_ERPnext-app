from fastapi import APIRouter, HTTPException, BackgroundTasks
from bson import ObjectId
from database import db
from models.debit_card import DebitCard, DebitCardAlert, DebitCardSettings
from datetime import datetime
import asyncio

router = APIRouter()
debit_cards_collection = db.debit_cards
alerts_collection = db.debit_card_alerts
settings_collection = db.debit_card_settings

# Debit Cards CRUD
@router.get("/")
async def get_debit_cards():
    items = []
    async for item in debit_cards_collection.find():
        # Convert ObjectId to string and set both _id and id fields
        item["_id"] = str(item["_id"])
        item["id"] = str(item["_id"])
        # Remove the MongoDB _id field from the item dict before creating DebitCard
        item_copy = item.copy()
        item_copy.pop("_id", None)  # Remove _id to avoid conflicts
        items.append(DebitCard(**item_copy))
    return items

@router.post("/")
async def create_debit_card(item: DebitCard, background_tasks: BackgroundTasks):
    item.createdAt = datetime.utcnow()
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await debit_cards_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)

    # Check for alerts after creation
    background_tasks.add_task(check_card_alerts, item.id)
    return item

@router.get("/{item_id}")
async def get_debit_card(item_id: str):
    item = await debit_cards_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Debit card not found")
    item["_id"] = str(item["_id"])
    item["id"] = str(item["_id"])  # Ensure id field is set
    # Remove the MongoDB _id field from the item dict before creating DebitCard
    item_copy = item.copy()
    item_copy.pop("_id", None)  # Remove _id to avoid conflicts
    return DebitCard(**item_copy)

@router.put("/{item_id}")
async def update_debit_card(item_id: str, item: DebitCard, background_tasks: BackgroundTasks):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await debit_cards_collection.replace_one({"_id": ObjectId(item_id)}, item_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Debit card not found")
    item.id = item_id

    # Check for alerts after update
    background_tasks.add_task(check_card_alerts, item_id)
    return item

@router.delete("/{item_id}")
async def delete_debit_card(item_id: str):
    result = await debit_cards_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Debit card not found")
    return {"message": "Debit card deleted"}

# Alerts
@router.get("/alerts/")
async def get_alerts():
    items = []
    async for item in alerts_collection.find():
        item["_id"] = str(item["_id"])
        items.append(DebitCardAlert(**item))
    return items

@router.post("/alerts/")
async def create_alert(item: DebitCardAlert):
    item.createdAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)
    result = await alerts_collection.insert_one(item_dict)
    item.id = str(result.inserted_id)
    return item

@router.put("/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    result = await alerts_collection.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"isRead": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert marked as read"}

# Settings
@router.get("/settings/")
async def get_settings():
    # Return default settings if none exist
    settings = await settings_collection.find_one()
    if not settings:
        default_settings = DebitCardSettings()
        return default_settings
    settings["_id"] = str(settings["_id"])
    return DebitCardSettings(**settings)

@router.post("/settings/")
async def update_settings(item: DebitCardSettings):
    item.updatedAt = datetime.utcnow()
    item_dict = item.dict(exclude_unset=True)

    # Upsert settings
    result = await settings_collection.replace_one(
        {},  # Empty filter to match any document
        item_dict,
        upsert=True
    )
    if result.upserted_id:
        item.id = str(result.upserted_id)
    return item

# Auto-refill endpoint
@router.post("/{card_id}/refill")
async def auto_refill_card(card_id: str):
    card = await debit_cards_collection.find_one({"_id": ObjectId(card_id)})
    if not card:
        raise HTTPException(status_code=404, detail="Debit card not found")

    if not card.get("autoRefillEnabled", False):
        raise HTTPException(status_code=400, detail="Auto-refill not enabled for this card")

    refill_amount = card.get("autoRefillAmount", 1000)
    new_balance = card["currentBalance"] + refill_amount

    # Update balance and last refill date
    await debit_cards_collection.update_one(
        {"_id": ObjectId(card_id)},
        {
            "$set": {
                "currentBalance": new_balance,
                "lastRefillDate": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        }
    )

    # Create refill alert
    alert = DebitCardAlert(
        debitCardId=card_id,
        alertType="auto_refill",
        message=f"Card {card['cardNumber']} auto-refilled with ₹{refill_amount}. New balance: ₹{new_balance}"
    )
    await create_alert(alert)

    return {"message": f"Card refilled with ₹{refill_amount}", "new_balance": new_balance}

# Background task to check alerts
async def check_card_alerts(card_id: str):
    await asyncio.sleep(1)  # Small delay to ensure update is processed

    card = await debit_cards_collection.find_one({"_id": ObjectId(card_id)})
    if not card:
        return

    balance = card["currentBalance"]
    threshold = card.get("alertThreshold", 500)

    if balance <= threshold:
        # Check if alert already exists
        existing_alert = await alerts_collection.find_one({
            "debitCardId": card_id,
            "alertType": "low_balance",
            "isRead": False
        })

        if not existing_alert:
            alert = DebitCardAlert(
                debitCardId=card_id,
                alertType="low_balance",
                message=f"Low balance alert: Card {card['cardNumber']} has ₹{balance} remaining (threshold: ₹{threshold})"
            )
            await create_alert(alert)

            # Send notification (console log for now, can be extended to email/SMS)
            print(f"🚨 ALERT: {alert.message}")

            # Auto-refill if enabled
            if card.get("autoRefillEnabled", False):
                await auto_refill_card(card_id)

# Periodic alert check (could be called by a scheduler)
@router.post("/check-all-alerts")
async def check_all_alerts():
    cards = []
    async for card in debit_cards_collection.find():
        cards.append(card)

    for card in cards:
        await check_card_alerts(str(card["_id"]))

    return {"message": f"Checked alerts for {len(cards)} cards"}