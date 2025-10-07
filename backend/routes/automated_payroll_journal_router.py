from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from services.automated_payroll_journal_service import payroll_journal_service
from models.payroll import PayrollJournalBatch
from typing import List, Optional

router = APIRouter()

@router.post("/generate-journal-entries/{payroll_period_id}")
async def generate_payroll_journal_entries(payroll_period_id: str, created_by: str = "System"):
    """Generate automated journal entries for a payroll period"""
    try:
        batch = await payroll_journal_service.generate_payroll_journal_entries(payroll_period_id, created_by)
        return {
            "message": "Journal entries generated successfully",
            "batch": batch,
            "batchId": batch.id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/journal-batches")
async def get_payroll_journal_batches(status: Optional[str] = None):
    """Get all payroll journal batches"""
    try:
        batches = await payroll_journal_service.get_payroll_journal_batches(status)
        return batches
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/journal-batches/{batch_id}")
async def get_payroll_journal_batch(batch_id: str):
    """Get a specific payroll journal batch"""
    try:
        from database import db
        batch_collection = db.payroll_journal_batches

        batch = await batch_collection.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")

        batch["_id"] = str(batch["_id"])
        batch["id"] = batch["_id"]
        return PayrollJournalBatch(**batch)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/post-journal-batch/{batch_id}")
async def post_payroll_journal_batch(batch_id: str, approved_by: str = "System"):
    """Post/approve a payroll journal batch"""
    try:
        success = await payroll_journal_service.post_payroll_journal_batch(batch_id, approved_by)
        if success:
            return {"message": "Journal batch posted successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to post journal batch")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/pending-payroll-periods")
async def get_pending_payroll_periods():
    """Get payroll periods that need journal entries generated"""
    try:
        from database import db
        payroll_collection = db.payroll_entries

        # Find payroll periods that have entries but no journal batches
        pipeline = [
            {
                "$group": {
                    "_id": "$payrollPeriodId",
                    "totalEntries": {"$sum": 1},
                    "totalGrossPay": {"$sum": "$grossPay"},
                    "hasJournalBatch": {"$sum": 0}  # Placeholder for now
                }
            },
            {
                "$match": {
                    "totalGrossPay": {"$gt": 0}
                }
            }
        ]

        periods = []
        async for period in payroll_collection.aggregate(pipeline):
            # Check if journal batch exists for this period
            batch_collection = db.payroll_journal_batches
            existing_batch = await batch_collection.find_one({
                "payrollPeriodId": period["_id"]
            })

            if not existing_batch:
                periods.append({
                    "payrollPeriodId": period["_id"],
                    "totalEntries": period["totalEntries"],
                    "totalGrossPay": period["totalGrossPay"],
                    "needsJournalEntry": True
                })

        return periods
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/journal-entries")
async def get_journal_entries(
    payroll_period_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """Get journal entries with optional filtering"""
    try:
        from database import db
        journal_collection = db.journal_entries

        query = {"source": "Payroll"}
        if payroll_period_id:
            query["reference"] = {"$regex": payroll_period_id}
        if status:
            query["status"] = status

        entries = []
        cursor = journal_collection.find(query).sort("createdAt", -1).limit(limit)

        async for entry in cursor:
            entry["_id"] = str(entry["_id"])
            entry["id"] = entry["_id"]

            # Convert journal lines
            if "lines" in entry:
                lines = []
                for line in entry["lines"]:
                    line["id"] = str(ObjectId())  # Generate temp ID for frontend
                    lines.append(line)
                entry["lines"] = lines

            entries.append(entry)

        return entries
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dashboard-summary")
async def get_payroll_journal_dashboard_summary():
    """Get summary data for the payroll journal dashboard"""
    try:
        batches = await payroll_journal_service.get_payroll_journal_batches()

        summary = {
            "totalBatches": len(batches),
            "draftBatches": len([b for b in batches if b.status == "Draft"]),
            "processingBatches": len([b for b in batches if b.status == "Processing"]),
            "postedBatches": len([b for b in batches if b.status == "Posted"]),
            "errorBatches": len([b for b in batches if b.status == "Error"]),
            "totalAmount": sum(b.totalAmount for b in batches if b.totalAmount),
            "recentBatches": batches[:5]  # Last 5 batches
        }

        return summary
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))