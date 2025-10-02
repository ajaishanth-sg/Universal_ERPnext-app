import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.database import db
import json

async def check_db_data():
    try:
        print("Checking current debit cards in database...")

        # Get all debit cards
        cards = []
        async for card in db.debit_cards.find({}):
            card["_id"] = str(card["_id"])
            cards.append(card)

        print(f"\nFound {len(cards)} debit cards in database:")
        for i, card in enumerate(cards, 1):
            print(f"\n{i}. Card Details:")
            print(f"   ID: {card.get('_id', 'N/A')}")
            print(f"   Card Number: {card.get('cardNumber', 'N/A')}")
            print(f"   Bank Name: {card.get('bankName', 'N/A')}")
            print(f"   Card Type: {card.get('cardType', 'N/A')}")
            print(f"   Balance: {card.get('currentBalance', 'N/A')}")
            print(f"   Status: {card.get('status', 'N/A')}")
            print(f"   Created At: {card.get('createdAt', 'N/A')}")

        # Check if there are any recent cards (created in the last minute)
        from datetime import datetime, timedelta
        one_minute_ago = datetime.utcnow() - timedelta(minutes=1)

        recent_cards = []
        async for card in db.debit_cards.find({"createdAt": {"$gte": one_minute_ago.isoformat()}}):
            card["_id"] = str(card["_id"])
            recent_cards.append(card)

        if recent_cards:
            print(f"\nFound {len(recent_cards)} cards created in the last minute:")
            for card in recent_cards:
                print(f"   - {card.get('cardNumber')} ({card.get('bankName')})")
        else:
            print("\nNo cards created in the last minute.")

    except Exception as e:
        print(f"Error checking database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_db_data())