import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

const NewPaymentEntryForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    series: 'ACC-PAY-.YYYY.-',
    postingDate: '2025-09-21',
    paymentType: 'Receive',
    modeOfPayment: '',
    partyType: 'Customer',
    party: '',
    partyName: '',
    accountPaidTo: '',
    amount: ''
  });

  const [taxCharges, setTaxCharges] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    accounts: true,
    taxesCharges: false,
    gstDetails: false,
    accountingDimensions: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addTaxRow = () => {
    setTaxCharges(prev => [...prev, {
      id: prev.length + 1,
      type: '',
      accountHead: '',
      taxRate: '',
      amount: '',
      total: ''
    }]);
  };

  const removeTaxRow = (index) => {
    setTaxCharges(prev => prev.filter((_, i) => i !== index));
  };

  const handleTaxChange = (index, field, value) => {
    setTaxCharges(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.series) newErrors.series = 'Series is required';
    if (!formData.postingDate) newErrors.postingDate = 'Posting Date is required';
    if (!formData.paymentType) newErrors.paymentType = 'Payment Type is required';
    if (!formData.party) newErrors.party = 'Party is required';
    if (!formData.accountPaidTo) newErrors.accountPaidTo = 'Account Paid To is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newEntry = {
        ...formData,
        id: `PAY-${Date.now()}`,
        lastUpdated: new Date().toLocaleDateString(),
        status: 'Draft',
        createdBy: 'Current User',
        taxCharges: taxCharges
      };
      
      onSave(newEntry);
    }
  };

  const handleSaveAndSubmit = () => {
    if (validateForm()) {
      const newEntry = {
        ...formData,
        id: `PAY-${Date.now()}`,
        lastUpdated: new Date().toLocaleDateString(),
        status: 'Submitted',
        createdBy: 'Current User',
        taxCharges: taxCharges
      };
      
      onSave(newEntry);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Accounting</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Payment Entry</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">New Payment Entry</span>
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">New Payment Entry</h1>
                <div className="flex items-center space-x-2 text-sm text-orange-600">
                  <span>Not Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-8">
            {/* Type of Payment Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Type of Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Series <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.series}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.series ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="ACC-PAY-.YYYY.-">ACC-PAY-.YYYY.-</option>
                    <option value="ACC-PAY-.MM.-">ACC-PAY-.MM.-</option>
                  </select>
                  {errors.series && <p className="text-red-500 text-xs mt-1">{errors.series}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posting Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.postingDate}
                      onChange={(e) => handleInputChange('postingDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.postingDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.postingDate && <p className="text-red-500 text-xs mt-1">{errors.postingDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.paymentType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Receive">Receive</option>
                    <option value="Pay">Pay</option>
                  </select>
                  {errors.paymentType && <p className="text-red-500 text-xs mt-1">{errors.paymentType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode of Payment
                  </label>
                  <select 
                    value={formData.modeOfPayment}
                    onChange={(e) => handleInputChange('modeOfPayment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment From / To Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Payment From / To</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Type
                  </label>
                  <select 
                    value={formData.partyType}
                    onChange={(e) => handleInputChange('partyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>

                <div></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.party}
                    onChange={(e) => handleInputChange('party', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.party ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter party name"
                  />
                  {errors.party && <p className="text-red-500 text-xs mt-1">{errors.party}</p>}
                </div>

                <div></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Name
                  </label>
                  <input
                    type="text"
                    value={formData.partyName}
                    onChange={(e) => handleInputChange('partyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Party display name"
                  />
                </div>

                <div></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
              </div>
            </div>

            {/* Accounts Section */}
            <div>
              <button
                onClick={() => toggleSection('accounts')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-lg font-medium text-gray-900">Accounts</h2>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedSections.accounts ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedSections.accounts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Paid To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountPaidTo}
                      onChange={(e) => handleInputChange('accountPaidTo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.accountPaidTo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Select account"
                    />
                    {errors.accountPaidTo && <p className="text-red-500 text-xs mt-1">{errors.accountPaidTo}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Taxes and Charges Section */}
            <div>
              <button
                onClick={() => toggleSection('taxesCharges')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-lg font-medium text-gray-900">Taxes and Charges</h2>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedSections.taxesCharges ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedSections.taxesCharges && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Advance Taxes and Charges</h3>
                  
                  {taxCharges.length === 0 ? (
                    <div className="border border-gray-200 rounded-lg p-8 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">No Data</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              <input type="checkbox" className="rounded" />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Type <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Account Head <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {taxCharges.map((charge, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <input type="checkbox" className="rounded" />
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{charge.id}</td>
                              <td className="px-4 py-3">
                                <select 
                                  value={charge.type}
                                  onChange={(e) => handleTaxChange(index, 'type', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select</option>
                                  <option value="GST">GST</option>
                                  <option value="VAT">VAT</option>
                                  <option value="TDS">TDS</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={charge.accountHead}
                                  onChange={(e) => handleTaxChange(index, 'accountHead', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Account"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={charge.taxRate}
                                  onChange={(e) => handleTaxChange(index, 'taxRate', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={charge.amount}
                                  onChange={(e) => handleTaxChange(index, 'amount', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={charge.total}
                                  onChange={(e) => handleTaxChange(index, 'total', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => removeTaxRow(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  <button
                    onClick={addTaxRow}
                    className="mt-4 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Add Row
                  </button>
                </div>
              )}
            </div>

            {/* GST Details Section */}
            <div>
              <button
                onClick={() => toggleSection('gstDetails')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-lg font-medium text-gray-900">GST Details</h2>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedSections.gstDetails ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedSections.gstDetails && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">GST details will be populated automatically based on party and items.</p>
                </div>
              )}
            </div>

            {/* Accounting Dimensions Section */}
            <div>
              <button
                onClick={() => toggleSection('accountingDimensions')}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h2 className="text-lg font-medium text-gray-900">Accounting Dimensions</h2>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedSections.accountingDimensions ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedSections.accountingDimensions && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">Configure accounting dimensions for better financial reporting.</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={handleSaveAndSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save & Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentEntryForm = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [paymentEntries, setPaymentEntries] = useState([]);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    paymentType: '',
    partyType: '',
    party: ''
  });

  const [showTags, setShowTags] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
      paymentType: '',
      partyType: '',
      party: ''
    });
  };

  const handleSavePaymentEntry = (entryData) => {
    setPaymentEntries(prev => [...prev, entryData]);
    setShowNewForm(false);
  };

  const handleDeleteEntry = (entryId) => {
    setPaymentEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleEditEntry = (entryId) => {
    // For now, just show an alert. You can implement edit functionality later
    alert(`Edit functionality for entry ${entryId} will be implemented here`);
  };

  const handleViewEntry = (entryId) => {
    // For now, just show an alert. You can implement view functionality later
    alert(`View functionality for entry ${entryId} will be implemented here`);
  };

  // Filter entries based on table filters
  const filteredEntries = paymentEntries.filter(entry => {
    return (
      (!tableFilters.id || entry.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.paymentType || entry.paymentType.toLowerCase().includes(tableFilters.paymentType.toLowerCase())) &&
      (!tableFilters.partyType || entry.partyType.toLowerCase().includes(tableFilters.partyType.toLowerCase())) &&
      (!tableFilters.party || entry.party.toLowerCase().includes(tableFilters.party.toLowerCase()))
    );
  });

  if (showNewForm) {
    return <NewPaymentEntryForm onBack={() => setShowNewForm(false)} onSave={handleSavePaymentEntry} />;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Payment Entry</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter By</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assigned To</label>
                  <select 
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Created By</label>
                  <select 
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Edit Filters
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tags</label>
                  <select 
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="urgent">Urgent</option>
                    <option value="review">Review</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setShowTags(!showTags)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Show Tags
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Save Filter
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Filter Name"
                    value={filters.filterName}
                    onChange={(e) => handleFilterChange('filterName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
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
              </div>
              <button 
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Payment Entry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ID"
                value={tableFilters.id}
                onChange={(e) => handleTableFilterChange('id', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tableFilters.paymentType}
                onChange={(e) => handleTableFilterChange('paymentType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Payment Type</option>
                <option value="Receive">Receive</option>
                <option value="Pay">Pay</option>
              </select>
              <input
                type="text"
                placeholder="Party Type"
                value={tableFilters.partyType}
                onChange={(e) => handleTableFilterChange('partyType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Party"
                value={tableFilters.party}
                onChange={(e) => handleTableFilterChange('party', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
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
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {paymentEntries.length === 0 
                  ? "You haven't created a Payment Entry yet"
                  : "No entries match your filters"
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {paymentEntries.length === 0 
                  ? "Get started by creating your first Payment Entry"
                  : "Try adjusting your search criteria"
                }
              </p>
              <button 
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {paymentEntries.length === 0 
                  ? "Create your first Payment Entry"
                  : "Create new Payment Entry"
                }
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEntries.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.paymentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.partyType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.party}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${parseFloat(entry.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === 'Submitted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.status === 'Submitted' && <Check className="w-3 h-3 mr-1" />}
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewEntry(entry.id)}
                              className="p-1 text-gray-600 hover:text-blue-600"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditEntry(entry.id)}
                              className="p-1 text-gray-600 hover:text-green-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEntry(entry.id)}
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
              
              {/* Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {filteredEntries.length} of {paymentEntries.length} entries
                </span>
                <span>
                  Total Amount: ${filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              {[20, 100, 500, 2500].map((count) => (
                <button
                  key={count}
                  onClick={() => setItemsPerPage(count)}
                  className={`px-2 py-1 text-sm rounded ${
                    itemsPerPage === count
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {filteredEntries.length > 0 && `Page 1 of ${Math.ceil(filteredEntries.length / itemsPerPage)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentEntryForm;