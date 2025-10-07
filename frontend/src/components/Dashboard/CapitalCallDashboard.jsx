import React, { useState, useEffect } from 'react';
import {
  DollarSign, Users, Calendar, AlertTriangle, CheckCircle,
  Plus, Eye, Edit, Trash2, Send, TrendingUp, Clock,
  FileText, Download, Filter, Search, MoreHorizontal,
  RefreshCw, ArrowLeft, X, Save, Building, Target
} from 'lucide-react';

// Capital Call Form Component
const CapitalCallForm = ({ call = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(call || {
    fund_name: '',
    investment_type: 'private_equity',
    call_number: '',
    total_commitment_amount: '',
    called_amount: '',
    notice_date: '',
    due_date: '',
    purpose: '',
    description: '',
    approval_required: false,
    notify_investors: true,
    notification_emails: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const investmentTypes = [
    { value: 'private_equity', label: 'Private Equity' },
    { value: 'venture_capital', label: 'Venture Capital' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'hedge_fund', label: 'Hedge Fund' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fund_name.trim()) {
      newErrors.fund_name = 'Fund name is required';
    }

    if (!formData.called_amount || parseFloat(formData.called_amount) <= 0) {
      newErrors.called_amount = 'Valid called amount is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const callData = {
        ...formData,
        total_commitment_amount: parseFloat(formData.total_commitment_amount) || 0,
        called_amount: parseFloat(formData.called_amount),
        remaining_amount: (parseFloat(formData.total_commitment_amount) || 0) - parseFloat(formData.called_amount),
        status: formData.approval_required ? 'pending_approval' : 'approved',
        investor_commitments: []
      };

      await onSave(callData);
    } catch (error) {
      console.error('Error submitting capital call:', error);
      setErrors({ submit: 'Failed to submit capital call. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {call ? 'Edit Capital Call' : 'New Capital Call'}
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fund Name *
              </label>
              <input
                type="text"
                value={formData.fund_name}
                onChange={(e) => setFormData({...formData, fund_name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fund_name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter fund name"
                required
              />
              {errors.fund_name && <p className="mt-1 text-sm text-red-600">{errors.fund_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Type
              </label>
              <select
                value={formData.investment_type}
                onChange={(e) => setFormData({...formData, investment_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {investmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Number
              </label>
              <input
                type="text"
                value={formData.call_number}
                onChange={(e) => setFormData({...formData, call_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Commitment Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total_commitment_amount}
                onChange={(e) => setFormData({...formData, total_commitment_amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Called Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.called_amount}
                onChange={(e) => setFormData({...formData, called_amount: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.called_amount ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0.00"
                required
              />
              {errors.called_amount && <p className="mt-1 text-sm text-red-600">{errors.called_amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Date
              </label>
              <input
                type="date"
                value={formData.notice_date}
                onChange={(e) => setFormData({...formData, notice_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.due_date ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.purpose ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Purpose of this capital call"
                required
              />
              {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the capital call"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.approval_required}
                    onChange={(e) => setFormData({...formData, approval_required: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires Approval</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notify_investors}
                    onChange={(e) => setFormData({...formData, notify_investors: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notify Investors</span>
                </label>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Creating...' : 'Create Capital Call'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Capital Call Dashboard Component
const CapitalCallDashboard = ({ initialTab = 'capital-calls' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [capitalCalls, setCapitalCalls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load capital calls from API
  useEffect(() => {
    loadCapitalCalls();
  }, []);

  const loadCapitalCalls = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/capital-calls/');
      if (response.ok) {
        const data = await response.json();
        setCapitalCalls(data);
      } else {
        console.error('Failed to load capital calls');
        // Set sample data for demo
        setCapitalCalls([
          {
            id: 1,
            fund_name: "Universer Growth Fund I",
            investment_type: "private_equity",
            call_number: "CC-2024-001",
            total_commitment_amount: 10000000,
            called_amount: 2500000,
            remaining_amount: 7500000,
            notice_date: "2024-01-15",
            due_date: "2024-02-15",
            purpose: "Acquisition of Tech Company",
            status: "approved",
            alert_sent: true,
            alert_sent_at: "2024-01-16T10:00:00Z"
          },
          {
            id: 2,
            fund_name: "Real Estate Opportunity Fund",
            investment_type: "real_estate",
            call_number: "CC-2024-002",
            total_commitment_amount: 5000000,
            called_amount: 1500000,
            remaining_amount: 3500000,
            notice_date: "2024-01-20",
            due_date: "2024-02-20",
            purpose: "Property Development Project",
            status: "sent",
            alert_sent: true,
            alert_sent_at: "2024-01-21T14:30:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading capital calls:', error);
      // Set sample data for demo
      setCapitalCalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCall = async (callData) => {
    try {
      const response = await fetch('http://localhost:8000/api/capital-calls/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      });

      if (response.ok) {
        const savedCall = await response.json();
        setCapitalCalls([...capitalCalls, savedCall]);
        setShowForm(false);
      } else {
        console.error('Failed to save capital call');
        // For demo, add to local state
        const newCall = {
          ...callData,
          id: Date.now(),
          status: callData.approval_required ? 'pending_approval' : 'approved'
        };
        setCapitalCalls([...capitalCalls, newCall]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving capital call:', error);
      // For demo, add to local state
      const newCall = {
        ...callData,
        id: Date.now(),
        status: callData.approval_required ? 'pending_approval' : 'approved'
      };
      setCapitalCalls([...capitalCalls, newCall]);
      setShowForm(false);
    }
  };

  const handleSendAlerts = async (callId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/capital-calls/${callId}/send-alerts`, {
        method: 'POST',
      });

      if (response.ok) {
        // Update local state
        setCapitalCalls(capitalCalls.map(call =>
          call.id === callId
            ? { ...call, status: 'sent', alert_sent: true, alert_sent_at: new Date().toISOString() }
            : call
        ));
      }
    } catch (error) {
      console.error('Error sending alerts:', error);
    }
  };

  const filteredCalls = capitalCalls.filter(call => {
    return (
      call.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === '' || call.status === filterStatus)
    );
  });

  const stats = {
    total_calls: capitalCalls.length,
    total_called: capitalCalls.reduce((sum, call) => sum + call.called_amount, 0),
    pending_approvals: capitalCalls.filter(call => call.status === 'pending_approval').length,
    alerts_sent: capitalCalls.filter(call => call.alert_sent).length
  };

  const renderTabContent = () => {
    console.log('Rendering tab content for:', activeTab);
    console.log('Current activeTab state:', activeTab);

    switch (activeTab) {
      case 'funds':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Funds Management</h1>
                <p className="text-gray-600">Comprehensive overview of investment funds and performance</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New Fund</span>
              </button>
            </div>

            {/* Fund Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Funds</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Funds</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total AUM</p>
                    <p className="text-2xl font-bold text-gray-900">$2.4B</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">+12.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Funds Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Fund Portfolio</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Universer Growth Fund I</div>
                        <div className="text-sm text-gray-500">Private Equity</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$500M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$650M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">+15.2%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Real Estate Opportunity Fund</div>
                        <div className="text-sm text-gray-500">Real Estate</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$300M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$380M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">+8.7%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'investors':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
                <p className="text-gray-600">Comprehensive investor relationship and portfolio management</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add New Investor</span>
              </button>
            </div>

            {/* Investor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Investors</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Investors</p>
                    <p className="text-2xl font-bold text-gray-900">142</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                    <p className="text-2xl font-bold text-gray-900">$1.8B</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Investment</p>
                    <p className="text-2xl font-bold text-gray-900">$12.7M</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investors Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Investor Portfolio</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investor Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commitment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Called Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Blackstone Group</div>
                        <div className="text-sm text-gray-500">Institutional Investor</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Private Equity</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$150M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$120M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Carlyle Group</div>
                        <div className="text-sm text-gray-500">Institutional Investor</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Real Estate</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$200M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$180M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'commitment':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investment Commitments</h1>
                <p className="text-gray-600">Track and manage investment commitments and capital calls</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Commitment</span>
              </button>
            </div>

            {/* Commitment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                    <p className="text-2xl font-bold text-gray-900">$1.8B</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Called Amount</p>
                    <p className="text-2xl font-bold text-gray-900">$1.2B</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Uncalled Amount</p>
                    <p className="text-2xl font-bold text-gray-900">$600M</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Call Rate</p>
                    <p className="text-2xl font-bold text-gray-900">66.7%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commitments Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Commitment Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commitment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Called
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Universer Growth Fund I
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Blackstone Group</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$150M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$120M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$30M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Real Estate Fund II
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlyle Group</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$200M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$180M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$20M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'capital-calls':
        return (
          <div className="space-y-6">
            {/* Header - Only for capital calls */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Capital Call Management</h1>
                <p className="text-gray-600">Manage investment fund commitments and investor alerts</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Capital Call</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_calls}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Called</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.total_called.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending_approvals}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Send className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Alerts Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.alerts_sent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search funds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="sent">Sent</option>
                  <option value="fully_funded">Fully Funded</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>

            {/* Capital Calls List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Capital Calls</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Call Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Called
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {call.fund_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {call.investment_type.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {call.call_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${call.called_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(call.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            call.status === 'approved' ? 'bg-green-100 text-green-800' :
                            call.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            call.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {call.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-green-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            {call.status === 'approved' && !call.alert_sent && (
                              <button
                                onClick={() => handleSendAlerts(call.id)}
                                className="p-1 text-gray-600 hover:text-purple-600"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showForm && (
              <CapitalCallForm
                call={editingCall}
                onSave={handleSaveCall}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCall(null);
                }}
              />
            )}
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investment Alerts</h1>
                <p className="text-gray-600">Monitor and manage investment alerts and notifications</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Alert</span>
              </button>
            </div>

            {/* Alert Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">7</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alert Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund/Investor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Capital Call Due</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Universer Growth Fund I capital call payment due in 3 days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Universer Growth Fund I</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-12</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Payment Delay</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Investor payment delayed by 5 days for Real Estate Fund
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlyle Group</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-10</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Medium
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Resolved
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 text-black min-h-screen">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'funds', label: 'Funds' },
            { id: 'investors', label: 'Investors' },
            { id: 'commitment', label: 'Commitment' },
            { id: 'capital-calls', label: 'Capital Calls' },
            { id: 'alerts', label: 'Alerts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Switching to tab:', tab.id);
                setActiveTab(tab.id);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </h2>
            <div className="text-sm text-gray-500">
              Active Tab: <span className="font-medium text-blue-600">{activeTab}</span>
            </div>
          </div>
        </div>
        <div key={`tab-content-${activeTab}`}>
          {renderTabContent()}
        </div>
      </div>

      {/* Show form for capital calls tab only */}
      {activeTab === 'capital-calls' && showForm && (
        <CapitalCallForm
          call={editingCall}
          onSave={handleSaveCall}
          onCancel={() => {
            setShowForm(false);
            setEditingCall(null);
          }}
        />
      )}
    </div>
  );
};

export default CapitalCallDashboard;