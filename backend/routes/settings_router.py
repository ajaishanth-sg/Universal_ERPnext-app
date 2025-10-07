from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from database import db
from models.user_settings import (
    UserProfile, SecuritySettings, NotificationSettings, 
    AccountSettings, BillingSettings, SystemSettings, PreferenceSettings
)
from datetime import datetime
from typing import Optional

router = APIRouter()

# Collections
user_profiles_collection = db.user_profiles
security_settings_collection = db.security_settings
notification_settings_collection = db.notification_settings
account_settings_collection = db.account_settings
billing_settings_collection = db.billing_settings
system_settings_collection = db.system_settings
preference_settings_collection = db.preference_settings

# User Profile Endpoints
@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile by user ID"""
    try:
        profile = await user_profiles_collection.find_one({"userId": user_id})
        if not profile:
            # Return default profile
            return UserProfile(userId=user_id, firstName="John", lastName="Doe", email="john.doe@example.com")
        profile["_id"] = str(profile["_id"])
        return UserProfile(**profile)
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user profile")

@router.post("/profile")
async def create_or_update_user_profile(profile: UserProfile):
    """Create or update user profile"""
    try:
        profile.updatedAt = datetime.utcnow()
        if not profile.createdAt:
            profile.createdAt = datetime.utcnow()
        
        profile_dict = profile.dict(exclude_unset=True)
        
        # Upsert profile
        result = await user_profiles_collection.replace_one(
            {"userId": profile.userId},
            profile_dict,
            upsert=True
        )
        
        if result.upserted_id:
            profile.id = str(result.upserted_id)
        
        return profile
    except Exception as e:
        print(f"Error saving user profile: {e}")
        raise HTTPException(status_code=500, detail="Error saving user profile")

# Security Settings Endpoints
@router.get("/security/{user_id}")
async def get_security_settings(user_id: str):
    """Get security settings by user ID"""
    try:
        settings = await security_settings_collection.find_one({"userId": user_id})
        if not settings:
            # Return default security settings
            return SecuritySettings(userId=user_id)
        settings["_id"] = str(settings["_id"])
        return SecuritySettings(**settings)
    except Exception as e:
        print(f"Error fetching security settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching security settings")

@router.post("/security")
async def update_security_settings(settings: SecuritySettings):
    """Update security settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await security_settings_collection.replace_one(
            {"userId": settings.userId},
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving security settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving security settings")

# Notification Settings Endpoints
@router.get("/notifications/{user_id}")
async def get_notification_settings(user_id: str):
    """Get notification settings by user ID"""
    try:
        settings = await notification_settings_collection.find_one({"userId": user_id})
        if not settings:
            # Return default notification settings
            return NotificationSettings(userId=user_id)
        settings["_id"] = str(settings["_id"])
        return NotificationSettings(**settings)
    except Exception as e:
        print(f"Error fetching notification settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching notification settings")

@router.post("/notifications")
async def update_notification_settings(settings: NotificationSettings):
    """Update notification settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await notification_settings_collection.replace_one(
            {"userId": settings.userId},
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving notification settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving notification settings")

# Account Settings Endpoints
@router.get("/account/{user_id}")
async def get_account_settings(user_id: str):
    """Get account settings by user ID"""
    try:
        settings = await account_settings_collection.find_one({"userId": user_id})
        if not settings:
            # Return default account settings
            return AccountSettings(userId=user_id)
        settings["_id"] = str(settings["_id"])
        return AccountSettings(**settings)
    except Exception as e:
        print(f"Error fetching account settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching account settings")

@router.post("/account")
async def update_account_settings(settings: AccountSettings):
    """Update account settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await account_settings_collection.replace_one(
            {"userId": settings.userId},
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving account settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving account settings")

# Billing Settings Endpoints
@router.get("/billing/{user_id}")
async def get_billing_settings(user_id: str):
    """Get billing settings by user ID"""
    try:
        settings = await billing_settings_collection.find_one({"userId": user_id})
        if not settings:
            # Return default billing settings
            return BillingSettings(userId=user_id)
        settings["_id"] = str(settings["_id"])
        return BillingSettings(**settings)
    except Exception as e:
        print(f"Error fetching billing settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching billing settings")

@router.post("/billing")
async def update_billing_settings(settings: BillingSettings):
    """Update billing settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await billing_settings_collection.replace_one(
            {"userId": settings.userId},
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving billing settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving billing settings")

# Preference Settings Endpoints
@router.get("/preferences/{user_id}")
async def get_preference_settings(user_id: str):
    """Get preference settings by user ID"""
    try:
        settings = await preference_settings_collection.find_one({"userId": user_id})
        if not settings:
            # Return default preference settings
            return PreferenceSettings(userId=user_id)
        settings["_id"] = str(settings["_id"])
        return PreferenceSettings(**settings)
    except Exception as e:
        print(f"Error fetching preference settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching preference settings")

@router.post("/preferences")
async def update_preference_settings(settings: PreferenceSettings):
    """Update preference settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await preference_settings_collection.replace_one(
            {"userId": settings.userId},
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving preference settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving preference settings")

# System Settings Endpoints (Admin only)
@router.get("/system")
async def get_system_settings():
    """Get system settings"""
    try:
        settings = await system_settings_collection.find_one()
        if not settings:
            # Return default system settings
            return SystemSettings()
        settings["_id"] = str(settings["_id"])
        return SystemSettings(**settings)
    except Exception as e:
        print(f"Error fetching system settings: {e}")
        raise HTTPException(status_code=500, detail="Error fetching system settings")

@router.post("/system")
async def update_system_settings(settings: SystemSettings):
    """Update system settings"""
    try:
        settings.updatedAt = datetime.utcnow()
        if not settings.createdAt:
            settings.createdAt = datetime.utcnow()
        
        settings_dict = settings.dict(exclude_unset=True)
        
        # Upsert settings
        result = await system_settings_collection.replace_one(
            {},  # Empty filter to match any document
            settings_dict,
            upsert=True
        )
        
        if result.upserted_id:
            settings.id = str(result.upserted_id)
        
        return settings
    except Exception as e:
        print(f"Error saving system settings: {e}")
        raise HTTPException(status_code=500, detail="Error saving system settings")

# Password Change Endpoint
@router.post("/change-password/{user_id}")
async def change_password(user_id: str, current_password: str, new_password: str):
    """Change user password"""
    try:
        # In a real implementation, you would:
        # 1. Verify the current password
        # 2. Hash the new password
        # 3. Update the password in the user database
        # 4. Update the security settings
        
        # For now, just update the security settings
        security_settings = await security_settings_collection.find_one({"userId": user_id})
        if security_settings:
            await security_settings_collection.update_one(
                {"userId": user_id},
                {"$set": {"passwordLastChanged": datetime.utcnow()}}
            )
        
        return {"message": "Password changed successfully"}
    except Exception as e:
        print(f"Error changing password: {e}")
        raise HTTPException(status_code=500, detail="Error changing password")
