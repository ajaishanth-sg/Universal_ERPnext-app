import React, { useState, useEffect } from 'react';
import { 
  Plus,
  RefreshCw,
  MoreHorizontal,
  Filter,
  X,
  Search,
  ChevronDown,
  FileText,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Save,
  ArrowLeft,
  Calendar,
  Settings,
  Check,
  Menu,
  User
} from 'lucide-react';

const NewAccountsPayableForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    company: '',
    reportDate: '',
    financeBook: '',
    costCenter: '',
    payableAccount: '',
    dueDate: '',
    paymentTermsTemplate: '',
    partyType: '',
    party: '',
    supplier: '',
    invoiceNumber: '',
    invoiceDate: '',
    outstandingAmount: '',
    totalAmount: '',
    paymentTerms: '',
    reference: '',
    description: '',
    // Report options
    basedOnPaymentTerms: false,
    showRemarks: false,
    showFuturePayments: false,
    revaluationJournals: false,
    groupByVoucher: false,
    groupBySupplier: false,
    inPartyCurrency: false,
    handleEmployeeAdvances: false
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
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.invoiceNumber) newErrors.invoiceNumber = 'Invoice Number is required';
    if (!formData.outstandingAmount) newErrors.outstandingAmount = 'Outstanding Amount is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (dueDate) => {
    if (!dueDate) return 'Current';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Current';
    if (diffDays <= 30) return '0-30 days';
    if (diffDays <= 60) return '31-60 days';
    if (diffDays <= 90) return '61-90 days';
    return '90+ days';
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const age = calculateAge(formData.dueDate);
      const newPayable = {
        ...formData,
        id: `AP-${Date.now()}`,
        lastUpdated: new Date().toLocaleDateString(),
        createdBy: 'Chairman',
        age,
        overdue: formData.dueDate ? new Date(formData.dueDate) < new Date() : false,
        lastPayment: 'N/A'
      };
      onSave(newPayable);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Payables</span>
            </nav>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Report Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Accounts Payable</h1>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Accounts Payable Summary
                </button>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
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

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Report Settings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Date</label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Finance Book</label>
                <input
                  type="text"
                  value={formData.financeBook}
                  onChange={(e) => handleInputChange('financeBook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select finance book"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => handleInputChange('costCenter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select cost center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">30, 60, 90, 120</label>
                <input
                  type="text"
                  value="30, 60, 90, 120"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms Template</label>
                <input
                  type="text"
                  value={formData.paymentTermsTemplate}
                  onChange={(e) => handleInputChange('paymentTermsTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payable Account</label>
                <input
                  type="text"
                  value={formData.payableAccount}
                  onChange={(e) => handleInputChange('payableAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party Type</label>
                <select
                  value={formData.partyType}
                  onChange={(e) => handleInputChange('partyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => handleInputChange('party', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select party"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  checked={formData.showRemarks}
                  onChange={(e) => handleInputChange('showRemarks', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Remarks</span>
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
                  checked={formData.groupBySupplier}
                  onChange={(e) => handleInputChange('groupBySupplier', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Group By Supplier</span>
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.handleEmployeeAdvances}
                  onChange={(e) => handleInputChange('handleEmployeeAdvances', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Handle Employee Advances</span>
              </label>
            </div>

            {/* Entry Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Entry Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.supplier ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter supplier name"
                  />
                  {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter invoice number"
                  />
                  {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outstanding Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.outstandingAmount}
                    onChange={(e) => handleInputChange('outstandingAmount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.outstandingAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                  />
                  {errors.outstandingAmount && <p className="text-red-500 text-xs mt-1">{errors.outstandingAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Accounts Payable Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountsPayableForm = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [accountsPayable, setAccountsPayable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    supplier: '',
    outstandingAmount: '',
    age: '',
    lastPayment: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/accounts-payable');
        if (response.ok) {
          const data = await response.json();
          setAccountsPayable(data);
        }
      } catch (error) {
        console.error('Error loading accounts payable:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      supplier: '',
      outstandingAmount: '',
      age: '',
      lastPayment: ''
    });
  };

  const handleSaveAccountsPayable = async (payableData) => {
    try {
      const response = await fetch('http://localhost:5000/api/accounts-payable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payableData),
      });

      if (response.ok) {
        const newPayable = await response.json();
        setAccountsPayable(prev => [...prev, newPayable]);
        setShowNewForm(false);
      } else {
        console.error('Failed to save accounts payable');
      }
    } catch (error) {
      console.error('Error saving accounts payable:', error);
    }
  };

  const handleDeletePayable = (payableId) => {
    setAccountsPayable(prev => prev.filter(payable => payable.id !== payableId));
  };

  // Filter payables based on table filters
  const filteredPayables = accountsPayable.filter(payable => {
    return (
      (!tableFilters.id || payable.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.supplier || payable.supplier.toLowerCase().includes(tableFilters.supplier.toLowerCase())) &&
      (!tableFilters.outstandingAmount || payable.outstandingAmount.toString().includes(tableFilters.outstandingAmount)) &&
      (!tableFilters.age || payable.age.includes(tableFilters.age)) &&
      (!tableFilters.lastPayment || payable.lastPayment.toLowerCase().includes(tableFilters.lastPayment.toLowerCase()))
    );
  });

  if (showNewForm) {
    return <NewAccountsPayableForm onBack={() => setShowNewForm(false)} onSave={handleSaveAccountsPayable} />;
  }

  return (
    <div className="flex h-screen bg-white">
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        
        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Accounts Payable Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Accounts Payable</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search or type a command (Ctrl + G)"
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <span>List View</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowNewForm(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Accounts Payable</span>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="chairman">Chairman</option>
                      <option value="finance">Finance Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Created By</label>
                    <select 
                      value={filters.createdBy}
                      onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="chairman">Chairman</option>
                      <option value="finance">Finance Team</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="urgent">Urgent</option>
                      <option value="overdue">Overdue</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Table Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="ID"
                      value={tableFilters.id}
                      onChange={(e) => handleTableFilterChange('id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Supplier"
                      value={tableFilters.supplier}
                      onChange={(e) => handleTableFilterChange('supplier', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Outstanding Amount"
                      value={tableFilters.outstandingAmount}
                      onChange={(e) => handleTableFilterChange('outstandingAmount', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={tableFilters.age}
                      onChange={(e) => handleTableFilterChange('age', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Age</option>
                      <option value="Current">Current</option>
                      <option value="0-30">0-30 days</option>
                      <option value="31-60">31-60 days</option>
                      <option value="61-90">61-90 days</option>
                      <option value="90+">90+ days</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Last Payment"
                      value={tableFilters.lastPayment}
                      onChange={(e) => handleTableFilterChange('lastPayment', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Table Content */}
                <div className="p-6">
                  {filteredPayables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        You haven't created any Accounts Payable entries yet
                      </h3>
                      <p className="text-gray-500 mb-4">Get started by creating your first entry</p>
                      <button 
                        onClick={() => setShowNewForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Create your first Accounts Payable entry
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Supplier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Outstanding Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Age
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPayables.map((payable, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payable.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payable.supplier}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{parseFloat(payable.outstandingAmount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  payable.overdue 
                                    ? 'bg-red-100 text-red-800' 
                                    : payable.age === 'Current'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {payable.age}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payable.lastPayment}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <button className="p-1 text-gray-600 hover:text-blue-600" title="View">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-gray-600 hover:text-green-600" title="Edit">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePayable(payable.id)}
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPayableForm;