from fastapi import APIRouter, HTTPException, BackgroundTasks
from bson import ObjectId
from database import db
from models.payroll import (
    Employee, PayrollPeriod, PayrollEntry, JournalEntry, JournalLine,
    PayrollJournalBatch, PayrollTaxInfo, PayrollDeduction
)
from services.payroll_journal_service import payroll_journal_service
import asyncio
from typing import List
from datetime import datetime

router = APIRouter()

# Employee endpoints
employee_collection = db.employees

@router.get("/employees")
async def get_employees():
    """Get all employees"""
    items = []
    async for item in employee_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(Employee(**item))
    return items

@router.post("/employees")
async def create_employee(employee: Employee):
    """Create a new employee"""
    employee_dict = employee.dict(exclude_unset=True)
    result = await employee_collection.insert_one(employee_dict)
    employee.id = str(result.inserted_id)
    return employee

@router.get("/employees/{employee_id}")
async def get_employee(employee_id: str):
    """Get a specific employee"""
    item = await employee_collection.find_one({"_id": ObjectId(employee_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Employee not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return Employee(**item)

@router.put("/employees/{employee_id}")
async def update_employee(employee_id: str, employee: Employee):
    """Update an employee"""
    employee_dict = employee.dict(exclude_unset=True)
    result = await employee_collection.replace_one({"_id": ObjectId(employee_id)}, employee_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    employee.id = employee_id
    return employee

# Payroll Period endpoints
period_collection = db.payroll_periods

@router.get("/periods")
async def get_payroll_periods():
    """Get all payroll periods"""
    items = []
    async for item in period_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(PayrollPeriod(**item))
    return items

@router.post("/periods")
async def create_payroll_period(period: PayrollPeriod):
    """Create a new payroll period"""
    period_dict = period.dict(exclude_unset=True)
    result = await period_collection.insert_one(period_dict)
    period.id = str(result.inserted_id)
    return period

@router.get("/periods/{period_id}")
async def get_payroll_period(period_id: str):
    """Get a specific payroll period"""
    item = await period_collection.find_one({"_id": ObjectId(period_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Payroll period not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return PayrollPeriod(**item)

# Payroll Entry endpoints
entry_collection = db.payroll_entries

@router.get("/entries")
async def get_payroll_entries():
    """Get all payroll entries"""
    items = []
    async for item in entry_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(PayrollEntry(**item))
    return items

@router.post("/entries")
async def create_payroll_entry(entry: PayrollEntry):
    """Create a new payroll entry"""
    entry_dict = entry.dict(exclude_unset=True)
    result = await entry_collection.insert_one(entry_dict)
    entry.id = str(result.inserted_id)
    return entry

@router.get("/entries/{entry_id}")
async def get_payroll_entry(entry_id: str):
    """Get a specific payroll entry"""
    item = await entry_collection.find_one({"_id": ObjectId(entry_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Payroll entry not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return PayrollEntry(**item)

@router.put("/entries/{entry_id}/approve")
async def approve_payroll_entry(entry_id: str, approved_by: str):
    """Approve a payroll entry"""
    entry = await entry_collection.find_one({"_id": ObjectId(entry_id)})
    if not entry:
        raise HTTPException(status_code=404, detail="Payroll entry not found")

    # Update entry status
    result = await entry_collection.update_one(
        {"_id": ObjectId(entry_id)},
        {
            "$set": {
                "status": "Approved",
                "approvedBy": approved_by,
                "approvedAt": datetime.now()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payroll entry not found")

    return {"message": "Payroll entry approved"}

# Journal Entry endpoints
journal_collection = db.journal_entries

@router.get("/journals")
async def get_journal_entries():
    """Get all journal entries"""
    items = []
    async for item in journal_collection.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(JournalEntry(**item))
    return items

@router.post("/journals")
async def create_journal_entry(journal_entry: JournalEntry):
    """Create a new journal entry"""
    journal_dict = journal_entry.dict(exclude_unset=True)
    result = await journal_collection.insert_one(journal_dict)
    journal_entry.id = str(result.inserted_id)
    return journal_entry

@router.get("/journals/{journal_id}")
async def get_journal_entry(journal_id: str):
    """Get a specific journal entry"""
    item = await journal_collection.find_one({"_id": ObjectId(journal_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return JournalEntry(**item)

# Payroll Journal Processing
@router.post("/process-journal/{period_id}")
async def process_payroll_journal(period_id: str, background_tasks: BackgroundTasks, processed_by: str):
    """Process payroll journal for a specific period"""
    try:
        # Process journal in background
        background_tasks.add_task(
            process_journal_background,
            period_id,
            processed_by
        )

        return {
            "message": "Payroll journal processing started",
            "period_id": period_id,
            "status": "Processing"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting journal processing: {str(e)}")

@router.get("/journal-batches")
async def get_journal_batches():
    """Get all payroll journal batches"""
    items = []
    async for item in db.payroll_journal_batches.find():
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(PayrollJournalBatch(**item))
    return items

@router.get("/journal-batches/{batch_id}")
async def get_journal_batch(batch_id: str):
    """Get a specific journal batch"""
    item = await db.payroll_journal_batches.find_one({"_id": ObjectId(batch_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Journal batch not found")
    item["_id"] = str(item["_id"])
    item["id"] = item["_id"]
    return PayrollJournalBatch(**item)

# Payroll Reports
@router.get("/reports/payroll-summary/{period_id}")
async def get_payroll_summary(period_id: str):
    """Get payroll summary for a specific period"""
    try:
        report = await payroll_journal_service.generate_payroll_report(period_id)
        return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating payroll report: {str(e)}")

@router.get("/reports/accounting-impact/{period_id}")
async def get_accounting_impact(period_id: str):
    """Get accounting impact of payroll for a specific period"""
    try:
        impact = await payroll_journal_service.get_accounting_impact(period_id)
        return {"period_id": period_id, "accounting_impact": impact}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating accounting impact: {str(e)}")

# Tax Calculation
@router.post("/calculate-taxes")
async def calculate_payroll_taxes(gross_pay: float, tax_info: dict):
    """Calculate payroll taxes for an employee"""
    try:
        taxes = await payroll_journal_service.calculate_payroll_taxes(gross_pay, tax_info)
        return {"gross_pay": gross_pay, "taxes": taxes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating taxes: {str(e)}")

# Dashboard endpoints
@router.get("/dashboard-summary")
async def get_payroll_dashboard_summary():
    """Get summary data for payroll dashboard"""
    try:
        # Get recent payroll periods
        recent_periods = []
        async for period in period_collection.find().sort("createdAt", -1).limit(5):
            period["_id"] = str(period["_id"])
            period["id"] = period["_id"]
            recent_periods.append(PayrollPeriod(**period))

        # Get pending approvals count
        pending_approvals = await entry_collection.count_documents({"status": "Draft"})

        # Get recent journal batches
        recent_batches = []
        async for batch in db.payroll_journal_batches.find().sort("createdAt", -1).limit(5):
            batch["_id"] = str(batch["_id"])
            batch["id"] = batch["_id"]
            recent_batches.append(PayrollJournalBatch(**batch))

        # Calculate total payroll this month
        from datetime import datetime, timedelta
        start_of_month = datetime.now().replace(day=1)
        end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        monthly_total = 0
        async for entry in entry_collection.find({
            "createdAt": {
                "$gte": start_of_month.isoformat(),
                "$lte": end_of_month.isoformat()
            }
        }):
            monthly_total += entry.get("netPay", 0)

        return {
            "recent_periods": recent_periods,
            "pending_approvals": pending_approvals,
            "recent_batches": recent_batches,
            "monthly_payroll_total": monthly_total,
            "total_employees": await employee_collection.count_documents({})
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting dashboard summary: {str(e)}")

async def process_journal_background(period_id: str, processed_by: str):
    """Process payroll journal in background"""
    try:
        batch = await payroll_journal_service.process_payroll_journal(period_id, processed_by)
        print(f"Payroll journal processed successfully: {batch.batchNumber}")
    except Exception as e:
        print(f"Error processing payroll journal: {str(e)}")