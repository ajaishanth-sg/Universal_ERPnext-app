import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.database import db
from backend.models.debit_card import DebitCard, DebitCardAlert

async def create_sample_data():
    # Clear existing data
    await db.debit_cards.delete_many({})
    await db.debit_card_alerts.delete_many({})
    await db.debit_card_settings.delete_many({})

    # Create sample debit cards
    cards_data = [
        {
            "cardNumber": "**** **** **** 1234",
            "bankName": "HSBC",
            "cardType": "Primary Card",
            "currentBalance": 2450.00,
            "currency": "INR",
            "alertThreshold": 500.0,
            "autoRefillEnabled": False,
            "autoRefillAmount": 1000.0,
            "status": "active"
        },
        {
            "cardNumber": "**** **** **** 5678",
            "bankName": "Standard Chartered",
            "cardType": "Business Card",
            "currentBalance": 320.00,
            "currency": "INR",
            "alertThreshold": 500.0,
            "autoRefillEnabled": True,
            "autoRefillAmount": 1000.0,
            "status": "active"
        },
        {
            "cardNumber": "**** **** **** 9012",
            "bankName": "Emirates NBD",
            "cardType": "Travel Card",
            "currentBalance": 1850.00,
            "currency": "INR",
            "alertThreshold": 300.0,
            "autoRefillEnabled": False,
            "autoRefillAmount": 800.0,
            "status": "active"
        }
    ]

    for card_data in cards_data:
        card = DebitCard(**card_data)
        await db.debit_cards.insert_one(card.dict(exclude_unset=True))

    print("Sample debit cards created successfully!")

    # Create a low balance alert for the second card
    alert = DebitCardAlert(
        debitCardId="sample_id_5678",  # This will be updated after creation
        alertType="low_balance",
        message="Low balance alert: Card **** **** **** 5678 has ₹320.00 remaining (threshold: ₹500.00)"
    )
    await db.debit_card_alerts.insert_one(alert.dict(exclude_unset=True))

    print("Sample alert created!")

if __name__ == "__main__":
    asyncio.run(create_sample_data())