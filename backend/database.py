from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
    db = client.universerererp
    print("Connected to MongoDB - using real database")
except Exception as e:
    print(f"MongoDB not available: {e}")
    print("Using in-memory mock database")
    # Mock database for development
    class MockAsyncIterator:
        def __init__(self, data):
            self.data = data
            self.index = 0

        def __aiter__(self):
            return self

        async def __anext__(self):
            if self.index >= len(self.data):
                raise StopAsyncIteration
            item = self.data[self.index]
            self.index += 1
            return item

    class MockCursor:
        def __init__(self, data):
            self.data = data

        def sort(self, field, direction=1):
            # Simple sort implementation
            reverse = direction == -1
            try:
                self.data.sort(key=lambda x: x.get(field, ""), reverse=reverse)
            except:
                pass  # Ignore sort errors in mock
            return self

        def limit(self, count):
            self.data = self.data[:count]
            return self

        def __aiter__(self):
            return MockAsyncIterator(self.data)

        async def to_list(self, length=None):
            import asyncio
            await asyncio.sleep(0)  # Make it truly async
            if length is None:
                return self.data
            return self.data[:length]

    class MockCollection:
        def __init__(self):
            self.data = {}
            self.next_id = 1

        def find(self, query=None):
            # Simple filtering - only support exact matches for now
            filtered_data = list(self.data.values())
            if query:
                # Very basic filtering - only check exact matches
                filtered_data = [item for item in filtered_data if all(item.get(k) == v for k, v in query.items())]
            return MockCursor(filtered_data)

        async def find_one(self, query):
            if "_id" in query:
                return self.data.get(str(query["_id"]))
            return None

        async def insert_one(self, document):
            import asyncio
            await asyncio.sleep(0)  # Make it truly async
            doc_id = str(self.next_id)
            self.next_id += 1
            document["_id"] = doc_id
            self.data[doc_id] = document
            class Result:
                inserted_id = doc_id
            return Result()

        async def replace_one(self, query, document):
            import asyncio
            await asyncio.sleep(0)  # Make it truly async
            doc_id = str(query["_id"])
            if doc_id in self.data:
                document["_id"] = doc_id
                self.data[doc_id] = document
                class Result:
                    matched_count = 1
                return Result()
            class Result:
                matched_count = 0
            return Result()

        async def delete_one(self, query):
            import asyncio
            await asyncio.sleep(0)  # Make it truly async
            doc_id = str(query["_id"])
            if doc_id in self.data:
                del self.data[doc_id]
                class Result:
                    deleted_count = 1
                return Result()
            class Result:
                deleted_count = 0
            return Result()

        def aggregate(self, pipeline):
            # Simple mock for aggregation - return empty list wrapped in cursor
            return MockCursor([])

        def count_documents(self, query=None):
            if query:
                # Simple count with filtering
                count = 0
                for item in self.data.values():
                    if all(item.get(k) == v for k, v in query.items()):
                        count += 1
                return count
            return len(self.data)

    class MockDB:
        def __init__(self):
            self.abroad_staff = MockCollection()
            self.accounts_payable = MockCollection()
            self.accounts_receivable = MockCollection()
            self.accounts_receivable_payments = MockCollection()
            self.debit_cards = MockCollection()
            self.debit_card_alerts = MockCollection()
            self.debit_card_settings = MockCollection()
            self.drivers = MockCollection()
            self.housing_maintenance = MockCollection()
            self.housing_purchases = MockCollection()
            self.housing_staff = MockCollection()
            self.inventory = MockCollection()
            self.maintenance_requests = MockCollection()
            self.maintenance_schedules = MockCollection()
            self.maintenance_scheduling = MockCollection()
            self.properties = MockCollection()
            self.purchase_invoices = MockCollection()
            self.racing_payments = MockCollection()
            self.sales_invoices = MockCollection()
            self.shipments = MockCollection()
            self.spv_companies = MockCollection()
            self.spv_expenditures = MockCollection()
            self.team_members = MockCollection()
            self.travel_trips = MockCollection()
            self.vehicles = MockCollection()

    db = MockDB()