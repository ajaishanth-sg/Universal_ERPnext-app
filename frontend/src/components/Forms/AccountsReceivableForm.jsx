import React, { useState } from 'react';
import { 
  Plus, Save, ArrowLeft, Search, Filter, MoreHorizontal, RefreshCw, 
  FileText, ChevronDown, X, Eye, Edit, Trash2, Calendar
} from 'lucide-react';

const AccountsReceivableForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    company: 'cube',
    date: '2025-09-22',
    financeBook: '',
    costCenter: '',
    partyType: 'Customer',
    party: '',
    receivableAccount: '',
    dueDate: '2025-09-22',
    reportDate: '2025-09-22',
    agingBasedOn: '30, 60, 90, 120',
    salesPartner: '',
    salesPerson: '',
    country: 'India',
    customerGroup: '',
    paymentTermsTemplate: '',
    
    // Checkboxes
    groupByCustomer: false,
    basedOnPaymentTerms: false,
    showFuturePayments: false,
    showLinkedDeliveryNotes: false,
    showSalesPerson: false,
    showRemarks: false,
    revaluationJournals: false,
    groupByVoucher: false,
    inPartyCurrency: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.party) newErrors.party = 'Party is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newReceivable = {
        ...formData,
        id: `AR-${Date.now()}`,
        status: 'Active',
        outstandingAmount: Math.floor(Math.random() * 100000) + 10000,
        lastPayment: formData.dueDate,
        age: Math.floor(Math.random() * 90) + 1,
        createdDate: new Date().toLocaleDateString(),
        createdBy: 'Current User'
      };
      onSave(newReceivable);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Receivables</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600 font-medium">Not Saved</span>
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-lg font-semibold text-gray-900">Accounts Receivable</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  Accounts Receivable Summary
                </button>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <span>Actions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Finance Book</label>
                <input
                  type="text"
                  value={formData.financeBook}
                  onChange={(e) => handleInputChange('financeBook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => handleInputChange('costCenter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party Type</label>
                <select
                  value={formData.partyType}
                  onChange={(e) => handleInputChange('partyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => handleInputChange('party', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.party ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.party && <p className="text-red-500 text-xs mt-1">{errors.party}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Group</label>
                <input
                  type="text"
                  value={formData.customerGroup}
                  onChange={(e) => handleInputChange('customerGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms Template</label>
                <input
                  type="text"
                  value={formData.paymentTermsTemplate}
                  onChange={(e) => handleInputChange('paymentTermsTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Receivable Account</label>
                <input
                  type="text"
                  value={formData.receivableAccount}
                  onChange={(e) => handleInputChange('receivableAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Date</label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aging Based On</label>
                <input
                  type="text"
                  value={formData.agingBasedOn}
                  onChange={(e) => handleInputChange('agingBasedOn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30, 60, 90, 120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Partner</label>
                <input
                  type="text"
                  value={formData.salesPartner}
                  onChange={(e) => handleInputChange('salesPartner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Person</label>
                <input
                  type="text"
                  value={formData.salesPerson}
                  onChange={(e) => handleInputChange('salesPerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Options Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Options</h3>
              
              {/* First Row of Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.groupByCustomer}
                    onChange={(e) => handleInputChange('groupByCustomer', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Group By Customer</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.basedOnPaymentTerms}
                    onChange={(e) => handleInputChange('basedOnPaymentTerms', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Based On Payment Terms</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showFuturePayments}
                    onChange={(e) => handleInputChange('showFuturePayments', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Future Payments</span>
                </label>
              </div>

              {/* Second Row of Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showLinkedDeliveryNotes}
                    onChange={(e) => handleInputChange('showLinkedDeliveryNotes', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Linked Delivery Notes</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showSalesPerson}
                    onChange={(e) => handleInputChange('showSalesPerson', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Sales Person</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showRemarks}
                    onChange={(e) => handleInputChange('showRemarks', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Remarks</span>
                </label>
              </div>

              {/* Third Row of Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.revaluationJournals}
                    onChange={(e) => handleInputChange('revaluationJournals', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Revaluation Journals</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.groupByVoucher}
                    onChange={(e) => handleInputChange('groupByVoucher', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Group by Voucher</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inPartyCurrency}
                    onChange={(e) => handleInputChange('inPartyCurrency', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Party Currency</span>
                </label>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="flex flex-col items-center justify-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Nothing to show</p>
                <p className="text-xs text-gray-400 mt-2">Configure the options above and click Save to generate the report</p>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="text-xs text-gray-500 text-center">
          For comparison, use &gt;5, &lt;10 or =324. For ranges, use 5:10 (for values between 5 & 10).
          <span className="float-right">Execution Time: 0.025844 sec</span>
        </div>
      </div>
    </div>
  );
};

const AccountsReceivableSystem = () => {
  // State management - starts with false so list view shows first
  const [showNewForm, setShowNewForm] = useState(false);
  const [receivables, setReceivables] = useState([]);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    customer: '',
    outstandingAmount: '',
    age: '',
    lastPayment: ''
  });

  // Filter handlers
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTableFilterChange = (field, value) => {
    setTableFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setTableFilters({
      id: '',
      customer: '',
      outstandingAmount: '',
      age: '',
      lastPayment: ''
    });
  };

  // CRUD operations
  const handleSaveReceivable = (receivableData) => {
    setReceivables(prev => [...prev, receivableData]);
    setShowNewForm(false); // Return to list view after saving
  };

  const handleDeleteReceivable = (receivableId) => {
    setReceivables(prev => prev.filter(receivable => receivable.id !== receivableId));
  };

  const handleEditReceivable = (receivableId) => {
    alert(`Edit functionality for receivable ${receivableId} will be implemented here`);
  };

  const handleViewReceivable = (receivableId) => {
    alert(`View functionality for receivable ${receivableId} will be implemented here`);
  };

  // Filter receivables based on table filters
  const filteredReceivables = receivables.filter(receivable => {
    return (
      (!tableFilters.id || receivable.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.customer || receivable.party.toLowerCase().includes(tableFilters.customer.toLowerCase())) &&
      (!tableFilters.outstandingAmount || receivable.outstandingAmount.toString().includes(tableFilters.outstandingAmount)) &&
      (!tableFilters.age || receivable.age.toString().includes(tableFilters.age)) &&
      (!tableFilters.lastPayment || receivable.lastPayment.includes(tableFilters.lastPayment))
    );
  });

  // Conditional rendering - show form or list view
  if (showNewForm) {
    return (
      <AccountsReceivableForm 
        onBack={() => setShowNewForm(false)} 
        onSave={handleSaveReceivable} 
      />
    );
  }

  // Main list view (default view)
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChevronDown className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Accounts Receivable</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search or type a command (Ctrl + G)"
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <span>List View</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {/* This button opens the form */}
                <button 
                  onClick={() => setShowNewForm(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Accounts Receivable</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Filter Sidebar */}
            <div className="w-64 p-6 border-r border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Filter By</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Assigned To</label>
                  <select 
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Created By</label>
                  <select 
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Edit Filters
                </button>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Tags</label>
                  <select 
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="urgent">Urgent</option>
                    <option value="review">Review</option>
                  </select>
                </div>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Show Tags
                </button>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Save Filter
                </button>

                <input
                  type="text"
                  placeholder="Filter Name"
                  value={filters.filterName}
                  onChange={(e) => handleFilterChange('filterName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Table Filters - only show when there are receivables */}
              {receivables.length > 0 && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="ID"
                      value={tableFilters.id}
                      onChange={(e) => handleTableFilterChange('id', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Customer"
                      value={tableFilters.customer}
                      onChange={(e) => handleTableFilterChange('customer', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Outstanding Amount"
                      value={tableFilters.outstandingAmount}
                      onChange={(e) => handleTableFilterChange('outstandingAmount', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={tableFilters.age}
                      onChange={(e) => handleTableFilterChange('age', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Age</option>
                      <option value="30">0-30 days</option>
                      <option value="60">31-60 days</option>
                      <option value="90">61-90 days</option>
                      <option value="120">90+ days</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Last Payment"
                      value={tableFilters.lastPayment}
                      onChange={(e) => handleTableFilterChange('lastPayment', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                    <button 
                      onClick={clearFilters}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Table Content */}
              <div className="p-6">
                {receivables.length === 0 ? (
                  // Empty state - shown when no receivables exist
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      You haven't created any Accounts Receivable entries yet
                    </h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first entry</p>
                    <button 
                      onClick={() => setShowNewForm(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create your first Accounts Receivable entry
                    </button>
                  </div>
                ) : (
                  // Table view - shown when receivables exist
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Outstanding Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age (Days)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Payment
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
                        {filteredReceivables.map((receivable, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                              {receivable.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {receivable.party}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{receivable.outstandingAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                receivable.age <= 30 ? 'bg-green-100 text-green-800' :
                                receivable.age <= 60 ? 'bg-yellow-100 text-yellow-800' :
                                receivable.age <= 90 ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {receivable.age} days
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {receivable.lastPayment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {receivable.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewReceivable(receivable.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditReceivable(receivable.id)}
                                  className="p-1 text-gray-600 hover:text-green-600"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteReceivable(receivable.id)}
                                  className="p-1 text-gray-600 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Table Summary */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Showing {filteredReceivables.length} of {receivables.length} entries
                      </span>
                      <span>
                        Total Outstanding: ₹{filteredReceivables.reduce((sum, receivable) => sum + receivable.outstandingAmount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivableSystem;