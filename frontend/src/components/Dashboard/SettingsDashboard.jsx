import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Users,
  Receipt,
  Settings,
  Upload,
  Trash2,
  Save,
  X,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const API_BASE_URL = 'http://localhost:8000/api';

const SettingsDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [currentUserId] = useState('user123'); // In real app, get from auth context

  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    role: 'Admin',
    title: 'System Administrator',
    location: 'New York, USA',
    businessName: '',
    organizationEmail: '',
    fax: '',
    country: '',
    city: '',
    state: '',
    postcode: '',
    address: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailSetupEnabled: true,
    smsSetupEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    securityAlertsEnabled: true,
    smsNotificationsEnabled: true,
    subscriptionAlertsEnabled: false,
    emailNotificationsEnabled: true,
    eventNotificationsEnabled: false,
    deviceLoginAlertsEnabled: false
  });

  const [accountSettings, setAccountSettings] = useState({
    accountType: 'Premium',
    accountStatus: 'Active',
    storageUsed: 2.5,
    storageLimit: 10.0,
    apiCallsUsed: 450,
    apiCallsLimit: 1000
  });

  const [billingSettings, setBillingSettings] = useState({
    billingEmail: 'billing@example.com',
    paymentMethod: 'Credit Card',
    cardLastFour: '1234',
    autoRenewal: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // API Functions
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/profile/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/security/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setSecuritySettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/notifications/${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setNotificationSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  useEffect(() => {
    // Load settings on component mount
    fetchUserProfile();
    fetchSecuritySettings();
    fetchNotificationSettings();
  }, [currentUserId]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Save based on active tab
      switch (activeTab) {
        case 'general':
          await fetch(`${API_BASE_URL}/settings/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userProfile, userId: currentUserId })
          });
          break;
        case 'security':
          await fetch(`${API_BASE_URL}/settings/security`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...securitySettings, userId: currentUserId })
          });
          break;
        case 'notifications':
          await fetch(`${API_BASE_URL}/settings/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...notificationSettings, userId: currentUserId })
          });
          break;
      }
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values or navigate back
    console.log('Changes cancelled');
  };

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'profile':
        setUserProfile(prev => ({ ...prev, [field]: value }));
        break;
      case 'security':
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'account':
        setAccountSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'billing':
        setBillingSettings(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <h3 className="font-medium text-gray-900">{label}</h3>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${
          enabled ? 'bg-[#1E3A5F]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const tabItems = [
    { id: 'general', label: 'General Information', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: User },
    { id: 'account-manager', label: 'Account Manager', icon: Users },
    { id: 'billing', label: 'Billings', icon: Receipt }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {saveMessage && (
            <div className={`mt-2 flex items-center space-x-2 ${
              saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
            }`}>
              <Info className="w-4 h-4" />
              <span className="text-sm">{saveMessage}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 bg-[#1E3A5F] hover:bg-[#2C5F7F] text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white border-l-4 border-[#2C5F7F]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-8">
              {/* General Information Tab */}
              {activeTab === 'general' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">General Information</CardTitle>
                  </CardHeader>

                  {/* Profile Picture Upload */}
                  <div className="mb-10">
                    <h3 className="text-lg font-medium mb-4">Profile picture upload</h3>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                          <User className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Upload className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-900">{userProfile.firstName} {userProfile.lastName}</p>
                        <p className="text-sm text-gray-600">{userProfile.role}/{userProfile.title}</p>
                        <p className="text-sm text-gray-500">{userProfile.location}</p>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        >
                          Upload New Photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  <div className="mb-10">
                    <h3 className="text-lg font-medium mb-6">Organization Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <Input
                          value={userProfile.businessName}
                          onChange={(e) => handleInputChange('profile', 'businessName', e.target.value)}
                          placeholder="Enter business name"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <Input
                          value={userProfile.organizationEmail}
                          onChange={(e) => handleInputChange('profile', 'organizationEmail', e.target.value)}
                          placeholder="Enter email address"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <Input
                          value={userProfile.phone}
                          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                          placeholder="Enter phone number"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fax</label>
                        <div className="relative">
                          <Input
                            value={userProfile.fax}
                            onChange={(e) => handleInputChange('profile', 'fax', e.target.value)}
                            placeholder="Enter fax number"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-10">
                    <h3 className="text-lg font-medium mb-6">Address</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <div className="relative">
                          <select
                            className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                            value={userProfile.country}
                            onChange={(e) => handleInputChange('profile', 'country', e.target.value)}
                          >
                            <option value="">Select country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="OM">Oman</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <Input
                          value={userProfile.city}
                          onChange={(e) => handleInputChange('profile', 'city', e.target.value)}
                          placeholder="Enter city"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                        <Input
                          value={userProfile.postcode}
                          onChange={(e) => handleInputChange('profile', 'postcode', e.target.value)}
                          placeholder="Enter postcode"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <Input
                          value={userProfile.state}
                          onChange={(e) => handleInputChange('profile', 'state', e.target.value)}
                          placeholder="Enter state"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Security</CardTitle>
                  </CardHeader>

                  {/* Password Management */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 pb-2 border-b">Password Management</h3>
                    {/* This section would be empty as shown in the image */}
                  </div>

                  {/* Login Two-Step Verification */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Login Two-Step Verification</h3>
                    <ToggleSwitch
                      enabled={securitySettings.twoFactorEnabled}
                      onChange={(value) => handleInputChange('security', 'twoFactorEnabled', value)}
                      label="Login Two-Step Verification"
                    />
                  </div>

                  {/* Email Setup */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Email Setup</h3>
                    <ToggleSwitch
                      enabled={securitySettings.emailSetupEnabled}
                      onChange={(value) => handleInputChange('security', 'emailSetupEnabled', value)}
                      label="Email Setup"
                    />
                  </div>

                  {/* SMS Setup */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">SMS Setup</h3>
                    <ToggleSwitch
                      enabled={securitySettings.smsSetupEnabled}
                      onChange={(value) => handleInputChange('security', 'smsSetupEnabled', value)}
                      label="SMS Setup"
                    />
                  </div>

                  {/* Password Security */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Password Security</h3>
                    <div className="flex items-center justify-between py-6">
                      <div>
                        <h4 className="font-medium text-gray-900">Password change</h4>
                      </div>
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 px-6 py-2"
                        onClick={() => {
                          // Handle password change
                          console.log('Change password clicked');
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
                  </CardHeader>

                  <div className="space-y-6">
                    <ToggleSwitch
                      enabled={notificationSettings.securityAlertsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'securityAlertsEnabled', value)}
                      label="Security Alerts"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.smsNotificationsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'smsNotificationsEnabled', value)}
                      label="SMS Notification"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.subscriptionAlertsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'subscriptionAlertsEnabled', value)}
                      label="Subscription Alerts"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.emailNotificationsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'emailNotificationsEnabled', value)}
                      label="Email Notifications"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.eventNotificationsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'eventNotificationsEnabled', value)}
                      label="Event Notifications"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.deviceLoginAlertsEnabled}
                      onChange={(value) => handleInputChange('notifications', 'deviceLoginAlertsEnabled', value)}
                      label="Device Login Alerts"
                    />
                  </div>
                </div>
              )}

              {/* Preferences Tab - Fully Functional */}
              {activeTab === 'preferences' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
                  </CardHeader>

                  <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Theme Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="dark-blue">Dark Blue</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Position</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Display Settings */}
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Display Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Compact Mode</h4>
                            <p className="text-sm text-gray-500">Show more content in less space</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${false ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${false ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Show Animations</h4>
                            <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Language & Region</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="asia/kolkata">Asia/Kolkata (UTC+5:30)</option>
                            <option value="america/new_york">America/New_York (UTC-5:00)</option>
                            <option value="europe/london">Europe/London (UTC+0:00)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Settings */}
                    <div className="mb-10">
                      <h3 className="text-lg font-medium mb-6 pb-2 border-b border-gray-200">Dashboard Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-refresh Data</h4>
                            <p className="text-sm text-gray-500">Automatically refresh dashboard data every 5 minutes</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Show Quick Actions</h4>
                            <p className="text-sm text-gray-500">Display quick action buttons on dashboard</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Account</CardTitle>
                  </CardHeader>

                  <div className="space-y-6">
                    {/* Account Overview */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Account Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#1E3A5F] text-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Account Type</p>
                              <p className="text-xl font-bold">Premium</p>
                            </div>
                            <Users className="w-8 h-8 opacity-80" />
                          </div>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Status</p>
                              <p className="text-xl font-bold">Active</p>
                            </div>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#2C5F7F] text-white p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Users</p>
                              <p className="text-xl font-bold">5/10</p>
                            </div>
                            <Users className="w-8 h-8 opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          <Input
                            value={userProfile.businessName || 'UniverserERP'}
                            onChange={(e) => handleInputChange('profile', 'businessName', e.target.value)}
                            className="h-11 border-gray-300 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="technology">Technology</option>
                            <option value="finance">Finance</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="retail">Retail</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="january">January</option>
                            <option value="april">April</option>
                            <option value="july">July</option>
                            <option value="october">October</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Usage Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Storage Used</span>
                              <span>{accountSettings.storageUsed}GB / {accountSettings.storageLimit}GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-[#1E3A5F] h-2 rounded-full" style={{width: `${(accountSettings.storageUsed / accountSettings.storageLimit) * 100}%`}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>API Calls</span>
                              <span>{accountSettings.apiCallsUsed} / {accountSettings.apiCallsLimit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: `${(accountSettings.apiCallsUsed / accountSettings.apiCallsLimit) * 100}%`}}></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Plan Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Current Plan:</span>
                              <span className="font-medium">{accountSettings.accountType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Next Billing:</span>
                              <span className="font-medium">Dec 15, 2024</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">₹2,999/month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account-manager' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Account Manager</CardTitle>
                  </CardHeader>

                  <div className="space-y-6">
                    {/* User Management */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">User Management</h3>
                        <Button className="bg-[#1E3A5F] hover:bg-[#2C5F7F] text-white">
                          <Users className="w-4 h-4 mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                            <div>User</div>
                            <div>Role</div>
                            <div>Status</div>
                            <div>Actions</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {[
                            { name: 'John Doe', email: 'john.doe@company.com', role: 'Admin', status: 'Active' },
                            { name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Manager', status: 'Active' },
                            { name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'User', status: 'Inactive' },
                            { name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Manager', status: 'Active' },
                          ].map((user, index) => (
                            <div key={index} className="px-6 py-4">
                              <div className="grid grid-cols-4 gap-4 items-center">
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                                <div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </div>
                                <div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.status}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Role Management */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Role Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Administrator</h4>
                              <p className="text-sm text-gray-500">Full system access</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">2 users</span>
                              <Button size="sm" variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                                Manage
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Manager</h4>
                              <p className="text-sm text-gray-500">Department management access</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">3 users</span>
                              <Button size="sm" variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                                Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">User</h4>
                              <p className="text-sm text-gray-500">Standard user access</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">8 users</span>
                              <Button size="sm" variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                                Manage
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Viewer</h4>
                              <p className="text-sm text-gray-500">Read-only access</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">1 user</span>
                              <Button size="sm" variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                                Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permission Settings */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Permission Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Allow User Creation</h4>
                            <p className="text-sm text-gray-500">Administrators can create new user accounts</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Require Approval for New Users</h4>
                            <p className="text-sm text-gray-500">New user accounts require admin approval</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${false ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${false ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Enable Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <CardHeader className="px-0 pt-0 pb-2">
                    <CardTitle className="text-xl font-semibold">Billings</CardTitle>
                  </CardHeader>

                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Current Plan</h3>
                      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2C5F7F] text-white p-6 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xl font-bold">Premium Plan</h4>
                            <p className="text-sm opacity-90">₹2,999/month • Next billing: Dec 15, 2024</p>
                          </div>
                          <Button className="bg-white text-[#1E3A5F] hover:bg-gray-100">
                            Upgrade Plan
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Billing Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Email</label>
                          <Input
                            value={billingSettings.billingEmail}
                            onChange={(e) => handleInputChange('billing', 'billingEmail', e.target.value)}
                            className="h-11 border-gray-300 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-white">
                            <option value="credit-card">Credit Card (****1234)</option>
                            <option value="bank-transfer">Bank Transfer</option>
                            <option value="paypal">PayPal</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Billing History</h3>
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                            <div>Date</div>
                            <div>Description</div>
                            <div>Amount</div>
                            <div>Status</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {[
                            { date: 'Nov 15, 2024', description: 'Premium Plan - Monthly', amount: '₹2,999', status: 'Paid' },
                            { date: 'Oct 15, 2024', description: 'Premium Plan - Monthly', amount: '₹2,999', status: 'Paid' },
                            { date: 'Sep 15, 2024', description: 'Premium Plan - Monthly', amount: '₹2,999', status: 'Paid' },
                          ].map((bill, index) => (
                            <div key={index} className="px-6 py-4">
                              <div className="grid grid-cols-4 gap-4 items-center">
                                <div className="text-sm text-gray-900">{bill.date}</div>
                                <div className="text-sm text-gray-900">{bill.description}</div>
                                <div className="text-sm font-medium text-gray-900">{bill.amount}</div>
                                <div>
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    {bill.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Credit Card</p>
                            <p className="text-sm text-gray-500">**** **** **** 1234</p>
                          </div>
                        </div>
                        <Button variant="outline" className="text-[#1E3A5F] border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white">
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Billing Settings */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Billing Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-renewal</h4>
                            <p className="text-sm text-gray-500">Automatically renew subscription</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${billingSettings.autoRenewal ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingSettings.autoRenewal ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Email Invoices</h4>
                            <p className="text-sm text-gray-500">Receive invoices via email</p>
                          </div>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${true ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${true ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
