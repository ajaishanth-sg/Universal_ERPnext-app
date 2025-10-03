from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from bson import ObjectId
from database import db
from models.email_approval import EmailApproval, ApprovalStatus, ApprovalType
from typing import Dict, Any, Optional
import secrets
import string
from datetime import datetime, timedelta
from email_service import send_approval_email

router = APIRouter()
collection = db.email_approvals

def generate_approval_token(length: int = 32) -> str:
    """Generate a secure token for email approvals"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

@router.get("/")
async def get_email_approvals(status: Optional[str] = None):
    """Get all email approvals, optionally filtered by status"""
    query = {}
    if status:
        query["status"] = status

    items = []
    async for item in collection.find(query):
        item["_id"] = str(item["_id"])
        item["id"] = item["_id"]
        items.append(EmailApproval(**item))
    return items

@router.post("/")
async def create_email_approval(
    approval_data: Dict[str, Any],
    background_tasks: BackgroundTasks
):
    """Create a new email approval request"""
    # Generate secure approval token
    approval_token = generate_approval_token()

    # Set expiration (7 days from now)
    expires_at = datetime.utcnow() + timedelta(days=7)

    # Create approval record
    approval = EmailApproval(
        **approval_data,
        approval_token=approval_token,
        expires_at=expires_at,
        created_at=datetime.utcnow()
    )

    approval_dict = approval.dict(exclude_unset=True)
    result = await collection.insert_one(approval_dict)

    # Send approval email in background
    background_tasks.add_task(
        send_approval_email,
        approval.requester_email,
        approval.approver_email,
        approval.approver_name,
        approval.reference_title,
        approval.approval_type,
        str(result.inserted_id),
        approval_token,
        approval.description
    )

    return {"message": "Approval request created and email sent", "id": str(result.inserted_id)}

@router.get("/approve/{token}")
async def approve_by_token(token: str):
    """One-click approval via email link"""
    # Find approval by token
    approval = await collection.find_one({"approval_token": token})

    if not approval:
        raise HTTPException(status_code=404, detail="Invalid or expired approval token")

    # Check if expired
    expires_at = datetime.fromisoformat(approval["expires_at"].replace('Z', '+00:00'))
    if datetime.utcnow() > expires_at:
        await collection.update_one(
            {"_id": approval["_id"]},
            {"$set": {"status": ApprovalStatus.EXPIRED.value}}
        )
        raise HTTPException(status_code=400, detail="Approval token has expired")

    # Check if already processed
    if approval["status"] != ApprovalStatus.PENDING.value:
        raise HTTPException(status_code=400, detail=f"Approval already {approval['status']}")

    # Update approval status
    await collection.update_one(
        {"_id": approval["_id"]},
        {
            "$set": {
                "status": ApprovalStatus.APPROVED.value,
                "approved_at": datetime.utcnow(),
                "approved_by": "email_approval"
            }
        }
    )

    # Here you would trigger the actual approval action based on approval_type
    # For example, update the related maintenance request, leave request, etc.

    return {
        "message": "Approval successful",
        "reference_id": approval["reference_id"],
        "approval_type": approval["approval_type"]
    }

@router.post("/approve/{token}")
async def approve_with_details(
    token: str,
    approval_details: Dict[str, Any]
):
    """Approve with additional details/notes"""
    # Find approval by token
    approval = await collection.find_one({"approval_token": token})

    if not approval:
        raise HTTPException(status_code=404, detail="Invalid or expired approval token")

    # Check if expired
    expires_at = datetime.fromisoformat(approval["expires_at"].replace('Z', '+00:00'))
    if datetime.utcnow() > expires_at:
        await collection.update_one(
            {"_id": approval["_id"]},
            {"$set": {"status": ApprovalStatus.EXPIRED.value}}
        )
        raise HTTPException(status_code=400, detail="Approval token has expired")

    # Update approval status with details
    update_data = {
        "status": ApprovalStatus.APPROVED.value,
        "approved_at": datetime.utcnow(),
        "approved_by": "email_approval"
    }

    if "notes" in approval_details:
        update_data["approval_notes"] = approval_details["notes"]

    await collection.update_one(
        {"_id": approval["_id"]},
        {"$set": update_data}
    )

    return {
        "message": "Approval successful",
        "reference_id": approval["reference_id"],
        "approval_type": approval["approval_type"]
    }

@router.post("/reject/{token}")
async def reject_by_token(
    token: str,
    rejection_data: Dict[str, Any]
):
    """Reject approval via email link"""
    # Find approval by token
    approval = await collection.find_one({"approval_token": token})

    if not approval:
        raise HTTPException(status_code=404, detail="Invalid or expired approval token")

    # Check if expired
    expires_at = datetime.fromisoformat(approval["expires_at"].replace('Z', '+00:00'))
    if datetime.utcnow() > expires_at:
        await collection.update_one(
            {"_id": approval["_id"]},
            {"$set": {"status": ApprovalStatus.EXPIRED.value}}
        )
        raise HTTPException(status_code=400, detail="Approval token has expired")

    # Update approval status
    await collection.update_one(
        {"_id": approval["_id"]},
        {
            "$set": {
                "status": ApprovalStatus.REJECTED.value,
                "approved_at": datetime.utcnow(),
                "approved_by": "email_approval",
                "rejection_reason": rejection_data.get("reason", "")
            }
        }
    )

    return {
        "message": "Rejection recorded",
        "reference_id": approval["reference_id"],
        "approval_type": approval["approval_type"]
    }

@router.get("/{approval_id}")
async def get_email_approval(approval_id: str):
    """Get specific email approval"""
    try:
        object_id = ObjectId(approval_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid approval ID")

    approval = await collection.find_one({"_id": object_id})
    if not approval:
        raise HTTPException(status_code=404, detail="Email approval not found")

    approval["_id"] = str(approval["_id"])
    approval["id"] = approval["_id"]
    return EmailApproval(**approval)

@router.put("/{approval_id}")
async def update_email_approval(approval_id: str, updates: Dict[str, Any]):
    """Update email approval"""
    try:
        object_id = ObjectId(approval_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid approval ID")

    existing_approval = await collection.find_one({"_id": object_id})
    if not existing_approval:
        raise HTTPException(status_code=404, detail="Email approval not found")

    # Update only provided fields
    update_dict = {"$set": updates}
    if "updated_at" not in updates:
        update_dict["$set"]["updated_at"] = datetime.utcnow()

    result = await collection.update_one({"_id": object_id}, update_dict)

    # Get updated approval
    updated_approval = await collection.find_one({"_id": object_id})
    updated_approval["_id"] = str(updated_approval["_id"])
    updated_approval["id"] = updated_approval["_id"]

    return EmailApproval(**updated_approval)

@router.delete("/{approval_id}")
async def delete_email_approval(approval_id: str):
    """Delete email approval"""
    try:
        object_id = ObjectId(approval_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid approval ID")

    result = await collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Email approval not found")

    return {"message": "Email approval deleted"}

@router.get("/stats/summary")
async def get_approval_stats():
    """Get approval statistics"""
    pipeline = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        }
    ]

    stats = {}
    async for stat in collection.aggregate(pipeline):
        stats[stat["_id"]] = stat["count"]

    return {
        "total_approvals": sum(stats.values()),
        "pending": stats.get(ApprovalStatus.PENDING.value, 0),
        "approved": stats.get(ApprovalStatus.APPROVED.value, 0),
        "rejected": stats.get(ApprovalStatus.REJECTED.value, 0),
        "expired": stats.get(ApprovalStatus.EXPIRED.value, 0)
    }