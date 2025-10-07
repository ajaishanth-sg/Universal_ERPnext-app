from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserProfile(BaseModel):
    id: Optional[str] = None
    userId: str
    firstName: str
    lastName: str
    email: str
    phone: Optional[str] = None
    profilePicture: Optional[str] = None
    role: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    
    # Organization Information
    businessName: Optional[str] = None
    organizationEmail: Optional[str] = None
    fax: Optional[str] = None
    
    # Address Information
    country: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    address: Optional[str] = None
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class SecuritySettings(BaseModel):
    id: Optional[str] = None
    userId: str
    
    # Two-Step Verification
    twoFactorEnabled: bool = False
    twoFactorMethod: str = "email"  # email, sms, app
    
    # Email Setup
    emailSetupEnabled: bool = False
    emailNotificationsEnabled: bool = True
    
    # SMS Setup
    smsSetupEnabled: bool = False
    smsNotificationsEnabled: bool = False
    
    # Password Security
    passwordLastChanged: Optional[datetime] = None
    passwordExpiryDays: int = 90
    requirePasswordChange: bool = False
    
    # Login Security
    maxLoginAttempts: int = 5
    lockoutDuration: int = 30  # minutes
    sessionTimeout: int = 480  # minutes (8 hours)
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class NotificationSettings(BaseModel):
    id: Optional[str] = None
    userId: str
    
    # Security Alerts
    securityAlertsEnabled: bool = True
    
    # SMS Notifications
    smsNotificationsEnabled: bool = True
    
    # Subscription Alerts
    subscriptionAlertsEnabled: bool = False
    
    # Email Notifications
    emailNotificationsEnabled: bool = True
    
    # Event Notifications
    eventNotificationsEnabled: bool = False
    
    # Device Login Alerts
    deviceLoginAlertsEnabled: bool = False
    
    # Maintenance Alerts
    maintenanceAlertsEnabled: bool = True
    
    # Financial Alerts
    financialAlertsEnabled: bool = True
    
    # System Updates
    systemUpdateAlertsEnabled: bool = True
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class AccountSettings(BaseModel):
    id: Optional[str] = None
    userId: str
    accountType: str = "Standard"  # Standard, Premium, Enterprise
    accountStatus: str = "Active"  # Active, Suspended, Inactive
    subscriptionPlan: Optional[str] = None
    subscriptionExpiry: Optional[datetime] = None
    storageUsed: float = 0.0  # GB
    storageLimit: float = 10.0  # GB
    apiCallsUsed: int = 0
    apiCallsLimit: int = 1000
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class BillingSettings(BaseModel):
    id: Optional[str] = None
    userId: str
    billingEmail: Optional[str] = None
    billingAddress: Optional[str] = None
    billingCity: Optional[str] = None
    billingState: Optional[str] = None
    billingCountry: Optional[str] = None
    billingPostcode: Optional[str] = None
    paymentMethod: Optional[str] = None  # credit_card, bank_transfer, paypal
    cardLastFour: Optional[str] = None
    cardExpiry: Optional[str] = None
    autoRenewal: bool = True
    invoicePreference: str = "email"  # email, postal, both
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class SystemSettings(BaseModel):
    id: Optional[str] = None
    
    # System Configuration
    systemName: str = "UniverserERP"
    systemVersion: str = "1.0.0"
    maintenanceMode: bool = False
    
    # Default Settings
    defaultLanguage: str = "en"
    defaultTimezone: str = "UTC"
    defaultCurrency: str = "USD"
    
    # Security Defaults
    defaultPasswordPolicy: dict = {
        "minLength": 8,
        "requireUppercase": True,
        "requireLowercase": True,
        "requireNumbers": True,
        "requireSpecialChars": True
    }
    
    # Notification Defaults
    defaultNotificationSettings: dict = {
        "email": True,
        "sms": False,
        "push": True
    }
    
    # Feature Flags
    featuresEnabled: dict = {
        "chatbot": True,
        "predictiveMaintenance": True,
        "advancedReporting": True,
        "apiAccess": True
    }
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class PreferenceSettings(BaseModel):
    id: Optional[str] = None
    userId: str
    
    # UI Preferences
    theme: str = "light"  # light, dark, auto
    language: str = "en"
    timezone: str = "UTC"
    dateFormat: str = "MM/DD/YYYY"
    timeFormat: str = "12"  # 12, 24
    currency: str = "USD"
    
    # Dashboard Preferences
    defaultDashboard: str = "executive"
    dashboardLayout: str = "grid"  # grid, list
    showWelcomeMessage: bool = True
    
    # Notification Preferences
    desktopNotifications: bool = True
    soundNotifications: bool = False
    
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
