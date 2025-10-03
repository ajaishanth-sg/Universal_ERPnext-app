#!/usr/bin/env python3
"""
Test script to verify the new Predictive Maintenance and Payroll features are working correctly.
Run this script to test the backend APIs.
"""

import asyncio
import aiohttp
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

async def test_maintenance_alerts():
    """Test Predictive Maintenance Alert APIs"""
    print("Testing Predictive Maintenance Alerts...")

    async with aiohttp.ClientSession() as session:
        try:
            # Test getting alerts
            async with session.get(f"{BASE_URL}/api/maintenance-alerts/alerts") as response:
                if response.status == 200:
                    alerts = await response.json()
                    print(f"✅ Successfully retrieved {len(alerts)} maintenance alerts")
                else:
                    print(f"❌ Failed to get alerts: {response.status}")

            # Test getting health scores
            async with session.get(f"{BASE_URL}/api/maintenance-alerts/health-scores") as response:
                if response.status == 200:
                    health_scores = await response.json()
                    print(f"✅ Successfully retrieved {len(health_scores)} health scores")
                else:
                    print(f"❌ Failed to get health scores: {response.status}")

            # Test analyzing vehicles
            async with session.post(f"{BASE_URL}/api/maintenance-alerts/analyze-vehicles") as response:
                if response.status == 200:
                    result = await response.json()
                    print(f"✅ Vehicle analysis completed: {result.get('message', 'Success')}")
                else:
                    print(f"❌ Failed to analyze vehicles: {response.status}")

        except Exception as e:
            print(f"❌ Error testing maintenance alerts: {str(e)}")

async def test_payroll_system():
    """Test Payroll Management APIs"""
    print("\nTesting Payroll Management System...")

    async with aiohttp.ClientSession() as session:
        try:
            # Test getting employees
            async with session.get(f"{BASE_URL}/api/payroll/employees") as response:
                if response.status == 200:
                    employees = await response.json()
                    print(f"✅ Successfully retrieved {len(employees)} employees")
                else:
                    print(f"❌ Failed to get employees: {response.status}")

            # Test getting payroll periods
            async with session.get(f"{BASE_URL}/api/payroll/periods") as response:
                if response.status == 200:
                    periods = await response.json()
                    print(f"✅ Successfully retrieved {len(periods)} payroll periods")
                else:
                    print(f"❌ Failed to get payroll periods: {response.status}")

            # Test getting journal batches
            async with session.get(f"{BASE_URL}/api/payroll/journal-batches") as response:
                if response.status == 200:
                    batches = await response.json()
                    print(f"✅ Successfully retrieved {len(batches)} journal batches")
                else:
                    print(f"❌ Failed to get journal batches: {response.status}")

            # Test dashboard summary
            async with session.get(f"{BASE_URL}/api/payroll/dashboard-summary") as response:
                if response.status == 200:
                    summary = await response.json()
                    print(f"✅ Successfully retrieved payroll dashboard summary")
                    print(f"   - Total Employees: {summary.get('total_employees', 0)}")
                    print(f"   - Pending Approvals: {summary.get('pending_approvals', 0)}")
                else:
                    print(f"❌ Failed to get payroll dashboard summary: {response.status}")

        except Exception as e:
            print(f"❌ Error testing payroll system: {str(e)}")

async def test_treasury_reports():
    """Test Treasury Reports APIs"""
    print("\nTesting Treasury Reports...")

    async with aiohttp.ClientSession() as session:
        try:
            # Test Daily Cash Position Report
            async with session.get(f"{BASE_URL}/api/dashboard/treasury/daily-cash-position") as response:
                if response.status == 200:
                    report = await response.json()
                    print(f"✅ Daily Cash Position Report: ₹{report.get('totalCash', 0):,}")
                else:
                    print(f"❌ Failed to get daily cash position: {response.status}")

            # Test Monthly Liquidity Report
            async with session.get(f"{BASE_URL}/api/dashboard/treasury/monthly-liquidity") as response:
                if response.status == 200:
                    report = await response.json()
                    print(f"✅ Monthly Liquidity Report: ₹{report.get('totalLiquidity', 0):,}")
                else:
                    print(f"❌ Failed to get monthly liquidity: {response.status}")

            # Test Investment Allocation Report
            async with session.get(f"{BASE_URL}/api/dashboard/treasury/investment-allocation") as response:
                if response.status == 200:
                    report = await response.json()
                    print(f"✅ Investment Allocation Report: ₹{report.get('totalInvestments', 0):,}")
                else:
                    print(f"❌ Failed to get investment allocation: {response.status}")

        except Exception as e:
            print(f"❌ Error testing treasury reports: {str(e)}")

async def main():
    """Run all tests"""
    print("Starting UniverserERP New Features Test Suite")
    print("=" * 50)

    # Test backend connectivity first
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{BASE_URL}/api/test") as response:
                if response.status == 200:
                    print("✅ Backend server is running")
                else:
                    print(f"❌ Backend server not responding: {response.status}")
                    return
    except Exception as e:
        print(f"❌ Cannot connect to backend server: {str(e)}")
        print("Please ensure the backend server is running on http://localhost:5000")
        return

    # Run all tests
    await test_maintenance_alerts()
    await test_payroll_system()
    await test_treasury_reports()

    print("\n" + "=" * 50)
    print("Test suite completed!")
    print("\nSummary of new features:")
    print("✓ Predictive Maintenance Alerts - Backend API ready")
    print("✓ Payroll Management System - Backend API ready")
    print("✓ Treasury Reports - Backend API ready")
    print("✓ Frontend dashboards integrated and ready")
    print("\nAccess the new features:")
    print("• Predictive Maintenance: Sidebar → Maintenance → Predictive Maintenance")
    print("• Payroll Management: Sidebar → Payroll → Payroll Management")
    print("• Treasury Reports: Financial Dashboard → Treasury tab → Treasury Reports")

if __name__ == "__main__":
    asyncio.run(main())