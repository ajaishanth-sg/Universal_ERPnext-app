#!/usr/bin/env python3
"""
Script to populate sample data for testing the Predictive Maintenance and Payroll features.
Run this script to add sample data to the database.
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from database import db

async def populate_maintenance_data():
    """Populate sample maintenance data"""
    print("Populating sample maintenance data...")

    # Sample health scores
    health_scores = [
        {
            "assetId": "vehicle_001",
            "assetType": "vehicle",
            "overallScore": 92.0,
            "components": {
                "engine": 95,
                "transmission": 90,
                "brakes": 88,
                "mileage": 92
            },
            "lastCalculated": datetime.now(),
            "trend": "improving",
            "recommendations": ["Regular maintenance on schedule"]
        },
        {
            "assetId": "vehicle_002",
            "assetType": "vehicle",
            "overallScore": 78.0,
            "components": {
                "engine": 75,
                "transmission": 80,
                "brakes": 82,
                "mileage": 76
            },
            "lastCalculated": datetime.now(),
            "trend": "stable",
            "recommendations": ["Monitor engine performance", "Check transmission fluid"]
        },
        {
            "assetId": "vehicle_003",
            "assetType": "vehicle",
            "overallScore": 65.0,
            "components": {
                "engine": 60,
                "transmission": 65,
                "brakes": 70,
                "mileage": 63
            },
            "lastCalculated": datetime.now(),
            "trend": "declining",
            "recommendations": ["Schedule immediate maintenance", "Engine diagnostics required"]
        }
    ]

    # Insert health scores
    for score in health_scores:
        await db.asset_health_scores.insert_one(score)

    print(f"[OK] Inserted {len(health_scores)} health scores")

    # Sample alerts
    alerts = [
        {
            "assetId": "vehicle_002",
            "assetType": "vehicle",
            "assetName": "BMW 7 Series",
            "alertType": "mileage_based",
            "severity": "high",
            "title": "Maintenance Due Soon",
            "description": "Vehicle will need maintenance in 2,500 km",
            "predictedFailureDate": (datetime.now() + timedelta(days=50)).strftime('%Y-%m-%d'),
            "confidence": 85.0,
            "recommendedAction": "Schedule maintenance appointment within 2 weeks",
            "estimatedCost": 750.0,
            "status": "active",
            "createdAt": datetime.now()
        },
        {
            "assetId": "vehicle_003",
            "assetType": "vehicle",
            "assetName": "Range Rover",
            "alertType": "condition_based",
            "severity": "critical",
            "title": "Critical Maintenance Required",
            "description": "Vehicle showing signs of engine wear",
            "predictedFailureDate": (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d'),
            "confidence": 90.0,
            "recommendedAction": "Immediate engine inspection required",
            "estimatedCost": 1500.0,
            "status": "active",
            "createdAt": datetime.now()
        }
    ]

    # Insert alerts
    for alert in alerts:
        await db.predictive_maintenance_alerts.insert_one(alert)

    print(f"[OK] Inserted {len(alerts)} maintenance alerts")

async def populate_payroll_data():
    """Populate sample payroll data"""
    print("Populating sample payroll data...")

    # Sample employees
    employees = [
        {
            "employeeId": "EMP001",
            "firstName": "Ahmed",
            "lastName": "Al-Rashid",
            "email": "ahmed@univerererp.com",
            "department": "Operations",
            "position": "Fleet Manager",
            "hireDate": "2023-06-15",
            "baseSalary": 5500.0,
            "employmentType": "Full-time",
            "status": "Active",
            "bankAccount": "****1234",
            "createdAt": datetime.now()
        },
        {
            "employeeId": "EMP002",
            "firstName": "Sarah",
            "lastName": "Johnson",
            "email": "sarah@univerererp.com",
            "department": "Finance",
            "position": "Accountant",
            "hireDate": "2023-08-20",
            "baseSalary": 4200.0,
            "employmentType": "Full-time",
            "status": "Active",
            "bankAccount": "****5678",
            "createdAt": datetime.now()
        },
        {
            "employeeId": "EMP003",
            "firstName": "Mohammed",
            "lastName": "Hassan",
            "email": "mohammed@univerererp.com",
            "department": "Operations",
            "position": "Driver",
            "hireDate": "2023-09-10",
            "baseSalary": 3800.0,
            "employmentType": "Full-time",
            "status": "Active",
            "bankAccount": "****9012",
            "createdAt": datetime.now()
        }
    ]

    # Insert employees
    for employee in employees:
        await db.employees.insert_one(employee)

    print(f"[OK] Inserted {len(employees)} employees")

    # Sample payroll periods
    periods = [
        {
            "periodName": "January 2024",
            "startDate": "2024-01-01",
            "endDate": "2024-01-31",
            "payDate": "2024-01-31",
            "status": "Closed",
            "totalEmployees": 3,
            "totalGrossPay": 13500.0,
            "totalNetPay": 11475.0,
            "totalDeductions": 2025.0,
            "createdAt": datetime.now()
        },
        {
            "periodName": "December 2023",
            "startDate": "2023-12-01",
            "endDate": "2023-12-31",
            "payDate": "2023-12-31",
            "status": "Posted",
            "totalEmployees": 3,
            "totalGrossPay": 13500.0,
            "totalNetPay": 11475.0,
            "totalDeductions": 2025.0,
            "createdAt": datetime.now()
        }
    ]

    # Insert periods
    for period in periods:
        await db.payroll_periods.insert_one(period)

    print(f"[OK] Inserted {len(periods)} payroll periods")

async def main():
    """Populate all sample data"""
    print("Starting data population for UniverserERP...")

    try:
        await populate_maintenance_data()
        await populate_payroll_data()

        print("\n[OK] Sample data population completed!")
        print("\nYou can now test the features:")
        print("* Predictive Maintenance: Sidebar -> Maintenance -> Predictive Maintenance")
        print("* Payroll Management: Sidebar -> Payroll -> Payroll Management")
        print("* Treasury Reports: Financial Dashboard -> Treasury tab")

    except Exception as e:
        print(f"[ERROR] Error populating data: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())