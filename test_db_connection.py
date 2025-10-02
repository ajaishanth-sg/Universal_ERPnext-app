import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.database import db

async def test_db():
    try:
        print("Testing database connection...")
        # Try to find one document in debit_cards collection
        result = await db.debit_cards.find_one({})
        print(f"Database query result: {result}")

        # Try to insert a test document
        test_card = {
            "cardNumber": "**** **** **** 9999",
            "bankName": "Test Bank",
            "cardType": "Test Card",
            "currentBalance": 1000.0,
            "currency": "INR",
            "alertThreshold": 500.0,
            "autoRefillEnabled": False,
            "autoRefillAmount": 1000.0,
            "status": "active"
        }

        insert_result = await db.debit_cards.insert_one(test_card)
        print(f"Insert result: {insert_result}")

        # Try to find the inserted document
        find_result = await db.debit_cards.find_one({"_id": insert_result.inserted_id})
        print(f"Find inserted document: {find_result}")

        print("Database test completed successfully!")

    except Exception as e:
        print(f"Database test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db())