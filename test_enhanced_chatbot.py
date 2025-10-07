#!/usr/bin/env python3

import sys
import os
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from routes.chatbot_router import ERPChatbot, load_erp_training_data, DataQueryService
from database import db

async def populate_test_data():
    """Populate database with test data for chatbot testing"""
    print("Populating test data...")
    
    # Test debit cards
    test_cards = [
        {
            "cardNumber": "**** **** **** 1234",
            "bankName": "HDFC Bank",
            "cardType": "Primary",
            "currentBalance": 15000.0,
            "currency": "INR",
            "status": "active"
        },
        {
            "cardNumber": "**** **** **** 5678",
            "bankName": "ICICI Bank", 
            "cardType": "Business",
            "currentBalance": 8500.0,
            "currency": "INR",
            "status": "active"
        },
        {
            "cardNumber": "**** **** **** 9012",
            "bankName": "SBI",
            "cardType": "Travel",
            "currentBalance": 2300.0,
            "currency": "INR",
            "status": "inactive"
        }
    ]
    
    for card in test_cards:
        await db.debit_cards.insert_one(card)
    
    # Test drivers
    test_drivers = [
        {
            "name": "John Smith",
            "employeeId": "DRV001",
            "email": "john.smith@company.com",
            "phone": "+91-9876543210",
            "licenseNumber": "DL123456789",
            "licenseType": "Full",
            "licenseExpiry": "2025-12-31",
            "status": "Active",
            "assignedVehicle": "Car-001",
            "rating": 4.5,
            "totalTrips": 150
        },
        {
            "name": "Sarah Johnson",
            "employeeId": "DRV002", 
            "email": "sarah.johnson@company.com",
            "phone": "+91-9876543211",
            "licenseNumber": "DL987654321",
            "licenseType": "Full",
            "licenseExpiry": "2026-06-30",
            "status": "Active",
            "assignedVehicle": "Car-002",
            "rating": 4.8,
            "totalTrips": 200
        },
        {
            "name": "Mike Wilson",
            "employeeId": "DRV003",
            "email": "mike.wilson@company.com", 
            "phone": "+91-9876543212",
            "licenseNumber": "DL456789123",
            "licenseType": "Full",
            "licenseExpiry": "2024-03-15",
            "status": "Inactive",
            "assignedVehicle": None,
            "rating": 4.2,
            "totalTrips": 75
        }
    ]
    
    for driver in test_drivers:
        await db.drivers.insert_one(driver)
    
    # Test vehicles
    test_vehicles = [
        {
            "make": "Toyota",
            "model": "Camry",
            "year": 2022,
            "licensePlate": "MH01AB1234",
            "status": "Active",
            "mileage": 25000,
            "fuelType": "Petrol"
        },
        {
            "make": "Honda",
            "model": "Accord", 
            "year": 2021,
            "licensePlate": "MH01CD5678",
            "status": "Active",
            "mileage": 30000,
            "fuelType": "Petrol"
        },
        {
            "make": "BMW",
            "model": "X5",
            "year": 2023,
            "licensePlate": "MH01EF9012",
            "status": "Maintenance",
            "mileage": 15000,
            "fuelType": "Diesel"
        }
    ]
    
    for vehicle in test_vehicles:
        await db.vehicles.insert_one(vehicle)
    
    # Test team members
    test_team_members = [
        {
            "name": "Alex Rodriguez",
            "role": "Lead Driver",
            "status": "Active",
            "location": "Mumbai",
            "phone": "+91-9876543213",
            "email": "alex.rodriguez@company.com",
            "joinDate": "2023-01-15",
            "rating": 4.9,
            "racesCompleted": 25,
            "wins": 8,
            "podiums": 15
        },
        {
            "name": "Emma Thompson",
            "role": "Race Engineer",
            "status": "Active", 
            "location": "Delhi",
            "phone": "+91-9876543214",
            "email": "emma.thompson@company.com",
            "joinDate": "2022-08-20",
            "rating": 4.7,
            "racesCompleted": 30,
            "wins": 0,
            "podiums": 0
        }
    ]
    
    for member in test_team_members:
        await db.team_members.insert_one(member)
    
    # Test inventory
    test_inventory = [
        {
            "name": "Engine Oil",
            "category": "Maintenance",
            "quantity": 50,
            "unit": "liters",
            "status": "In Stock",
            "minQuantity": 10,
            "maxQuantity": 100
        },
        {
            "name": "Brake Pads",
            "category": "Parts",
            "quantity": 25,
            "unit": "sets",
            "status": "In Stock", 
            "minQuantity": 5,
            "maxQuantity": 50
        },
        {
            "name": "Tires",
            "category": "Parts",
            "quantity": 2,
            "unit": "sets",
            "status": "Low Stock",
            "minQuantity": 8,
            "maxQuantity": 20
        }
    ]
    
    for item in test_inventory:
        await db.inventory.insert_one(item)
    
    print("Test data populated successfully!")

async def test_enhanced_chatbot():
    """Test the enhanced chatbot with data integration"""
    print("Testing Enhanced UniverserERP Chatbot with Data Integration...")
    
    # Populate test data first
    await populate_test_data()
    
    # Load training data
    training_data = load_erp_training_data()
    if not training_data:
        print("ERROR: Failed to load training data")
        return
    
    print("SUCCESS: Training data loaded successfully")
    
    # Initialize chatbot
    chatbot = ERPChatbot(training_data)
    if not chatbot:
        print("ERROR: Failed to initialize chatbot")
        return
    
    print("SUCCESS: Enhanced chatbot initialized successfully")
    
    # Test data queries
    test_queries = [
        # Basic conversational
        "Hi there!",
        "Thank you",
        
        # Data queries - Count
        "How many debit cards do we have?",
        "Count the number of drivers",
        "How many active vehicles are there?",
        
        # Data queries - List
        "Show me all debit cards",
        "List the drivers",
        "Display team members",
        
        # Data queries - Status
        "Show me active drivers",
        "List inactive vehicles", 
        "Get all active team members",
        
        # Data queries - Balance
        "What's the total balance on debit cards?",
        "Show me card balances",
        
        # Data queries - Recent
        "Show me recent inventory items",
        "Get latest team members",
        
        # Module questions
        "Tell me about financial management",
        "What is fleet management?",
        
        # General questions
        "What is UniverserERP?",
        "How do I navigate the system?"
    ]
    
    print("\n" + "="*80)
    print("TESTING CHATBOT RESPONSES")
    print("="*80)
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n[{i:2d}] QUERY: '{query}'")
        print("-" * 60)
        
        try:
            # Find module match
            module_match = chatbot.find_best_module_match(query)
            if module_match:
                print(f"     Module Match: {module_match}")
            
            # Get response (now async)
            response = await chatbot.get_contextual_response(query, module_match)
            
            # Clean and display response
            clean_response = response.encode('ascii', 'ignore').decode('ascii')
            print(f"     Response: {clean_response}")
            
        except Exception as e:
            print(f"     ERROR: {str(e)}")
    
    print("\n" + "="*80)
    print("SUCCESS: All enhanced chatbot tests completed!")
    print("="*80)

async def test_data_service_directly():
    """Test the data query service directly"""
    print("\n" + "="*80)
    print("TESTING DATA QUERY SERVICE DIRECTLY")
    print("="*80)
    
    data_service = DataQueryService()
    
    direct_queries = [
        "How many debit cards?",
        "Show me drivers",
        "What's the balance on cards?",
        "List active team members",
        "Count vehicles"
    ]
    
    for query in direct_queries:
        print(f"\nDirect Query: '{query}'")
        print("-" * 40)
        
        try:
            result = await data_service.execute_query(query)
            print(f"Success: {result['success']}")
            print(f"Message: {result['message']}")
            if result['data']:
                print(f"Data Keys: {list(result['data'].keys())}")
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    async def main():
        await test_enhanced_chatbot()
        await test_data_service_directly()
    
    asyncio.run(main())
