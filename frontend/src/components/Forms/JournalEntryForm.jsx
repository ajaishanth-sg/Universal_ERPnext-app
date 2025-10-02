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
  AlertCircle
} from 'lucide-react';

const NewJournalEntryForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    entryType: 'Journal Entry',
    series: 'ACC-JV-.YYYY.-',
    fromTemplate: '',
    company: 'cube',
    companyGSTIN: '',
    postingDate: '2025-09-21',
    referenceNumber: '',
    referenceDate: '',
    userRemark: '',
    multiCurrency: false
  });

  const [accountingEntries, setAccountingEntries] = useState([
    { id: 1, account: '', partyType: '', party: '', debit: 0, credit: 0 }
  ]);

  const [expandedSections, setExpandedSections] = useState({
    reference: false,
    printingSettings: false,
    moreInformation: false
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

  const handleEntryChange = (index, field, value) => {
    setAccountingEntries(prev => prev.map((entry, i) => {
      if (i === index) {
        const updatedEntry = { ...entry, [field]: value };
        // Ensure only one of debit or credit has a value
        if (field === 'debit' && value > 0) {
          updatedEntry.credit = 0;
        } else if (field === 'credit' && value > 0) {
          updatedEntry.debit = 0;
        }
        return updatedEntry;
      }
      return entry;
    }));
  };

  const addEntry = () => {
    setAccountingEntries(prev => [...prev, {
      id: prev.length + 1,
      account: '',
      partyType: '',
      party: '',
      debit: 0,
      credit: 0
    }]);
  };

  const removeEntry = (index) => {
    if (accountingEntries.length > 1) {
      setAccountingEntries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate totals
  const totalDebit = accountingEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
  const totalCredit = accountingEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01; // Allow for small rounding differences

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.entryType) newErrors.entryType = 'Entry Type is required';
    if (!formData.series) newErrors.series = 'Series is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.postingDate) newErrors.postingDate = 'Posting Date is required';
    
    // Validate accounting entries
    const hasValidEntries = accountingEntries.some(entry => 
      entry.account && (entry.debit > 0 || entry.credit > 0)
    );
    
    if (!hasValidEntries) {
      newErrors.accountingEntries = 'At least one accounting entry with account and amount is required';
    }
    
    if (!isBalanced) {
      newErrors.balance = 'Total Debit and Credit amounts must be equal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status = 'Draft') => {
    if (validateForm()) {
      const newJournalEntry = {
        ...formData,
        id: `JV-${Date.now()}`,
        status,
        lastUpdated: new Date().toLocaleDateString(),
        createdBy: 'Current User',
        accountingEntries,
        totalDebit,
        totalCredit,
        difference: totalDebit - totalCredit
      };
      onSave(newJournalEntry);
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
                <span className="text-gray-500">Journal Entry</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">New Journal Entry</span>
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600 font-medium">Not Saved</span>
                <button 
                  onClick={() => handleSubmit('Draft')}
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
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">New Journal Entry</h1>
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <span>Not Saved</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Quick Entry
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-8">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Type <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.entryType}
                  onChange={(e) => handleInputChange('entryType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.entryType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Journal Entry">Journal Entry</option>
                  <option value="Opening Entry">Opening Entry</option>
                  <option value="Closing Entry">Closing Entry</option>
                </select>
                {errors.entryType && <p className="text-red-500 text-xs mt-1">{errors.entryType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Template
                </label>
                <input
                  type="text"
                  value={formData.fromTemplate}
                  onChange={(e) => handleInputChange('fromTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select template"
                />
              </div>

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
                  <option value="ACC-JV-.YYYY.-">ACC-JV-.YYYY.-</option>
                  <option value="ACC-JV-.MM.-">ACC-JV-.MM.-</option>
                </select>
                {errors.series && <p className="text-red-500 text-xs mt-1">{errors.series}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Company name"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              <div></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company GSTIN
                </label>
                <input
                  type="text"
                  value={formData.companyGSTIN}
                  onChange={(e) => handleInputChange('companyGSTIN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GSTIN number"
                />
              </div>

              <div></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.postingDate}
                  onChange={(e) => handleInputChange('postingDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.postingDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postingDate && <p className="text-red-500 text-xs mt-1">{errors.postingDate}</p>}
              </div>
            </div>

            {/* Accounting Entries */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accounting Entries</h3>
              
              {errors.accountingEntries && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{errors.accountingEntries}</p>
                </div>
              )}

              {errors.balance && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 text-sm">{errors.balance}</p>
                </div>
              )}

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Account <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountingEntries.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.id}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry.account}
                            onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Select account"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.partyType}
                            onChange={(e) => handleEntryChange(index, 'partyType', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="Customer">Customer</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry.party}
                            onChange={(e) => handleEntryChange(index, 'party', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Select party"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={entry.debit}
                            onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="₹ 0.00"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={entry.credit}
                            onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="₹ 0.00"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeEntry(index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={accountingEntries.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="5" className="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹ {totalDebit.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹ {totalCredit.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {!isBalanced && (
                          <span className="text-red-500 text-xs">Not Balanced</span>
                        )}
                        {isBalanced && totalDebit > 0 && (
                          <span className="text-green-500 text-xs">Balanced</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={addEntry}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Add Row
                </button>
                <button className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  Add Multiple
                </button>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reference number"
                />
              </div>

              <div className="flex items-center space-x-4 pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.multiCurrency}
                    onChange={(e) => handleInputChange('multiCurrency', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Multi Currency</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Date
                </label>
                <input
                  type="date"
                  value={formData.referenceDate}
                  onChange={(e) => handleInputChange('referenceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div></div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Remark
                </label>
                <textarea
                  value={formData.userRemark}
                  onChange={(e) => handleInputChange('userRemark', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any remarks or notes"
                />
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('reference')}
                  className="flex items-center justify-between w-full text-left py-2"
                >
                  <h3 className="text-lg font-medium text-gray-900">Reference</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedSections.reference ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedSections.reference && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Reference information will be configured here.</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('printingSettings')}
                  className="flex items-center justify-between w-full text-left py-2"
                >
                  <h3 className="text-lg font-medium text-gray-900">Printing Settings</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedSections.printingSettings ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedSections.printingSettings && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Printing settings will be configured here.</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('moreInformation')}
                  className="flex items-center justify-between w-full text-left py-2"
                >
                  <h3 className="text-lg font-medium text-gray-900">More Information</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedSections.moreInformation ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedSections.moreInformation && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Additional information will be configured here.</p>
                  </div>
                )}
              </div>
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
                  onClick={() => handleSubmit('Draft')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleSubmit('Submitted')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!isBalanced}
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

const JournalEntryForm = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    entryType: '',
    company: '',
    status: ''
  });

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
      entryType: '',
      company: '',
      status: ''
    });
  };

  const handleSaveJournalEntry = (entryData) => {
    setJournalEntries(prev => [...prev, entryData]);
    setShowNewForm(false);
  };

  const handleDeleteEntry = (entryId) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleEditEntry = (entryId) => {
    alert(`Edit functionality for entry ${entryId} will be implemented here`);
  };

  const handleViewEntry = (entryId) => {
    alert(`View functionality for entry ${entryId} will be implemented here`);
  };

  // Filter entries based on table filters
  const filteredEntries = journalEntries.filter(entry => {
    return (
      (!tableFilters.id || entry.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.entryType || entry.entryType.toLowerCase().includes(tableFilters.entryType.toLowerCase())) &&
      (!tableFilters.company || entry.company.toLowerCase().includes(tableFilters.company.toLowerCase())) &&
      (!tableFilters.status || entry.status.toLowerCase().includes(tableFilters.status.toLowerCase()))
    );
  });

  if (showNewForm) {
    return <NewJournalEntryForm onBack={() => setShowNewForm(false)} onSave={handleSaveJournalEntry} />;
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
            <h1 className="text-lg font-semibold text-gray-900">Journal Entry</h1>
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
                  <button className="text-xs text-blue-600 hover:text-blue-700">
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
                <span>Add Journal Entry</span>
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
              <input
                type="text"
                placeholder="Entry Type"
                value={tableFilters.entryType}
                onChange={(e) => handleTableFilterChange('entryType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={tableFilters.company}
                onChange={(e) => handleTableFilterChange('company', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tableFilters.status}
                onChange={(e) => handleTableFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
              </select>
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
                {journalEntries.length === 0 
                  ? "You haven't created a Journal Entry yet"
                  : "No entries match your filters"
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {journalEntries.length === 0 
                  ? "Get started by creating your first Journal Entry"
                  : "Try adjusting your search criteria"
                }
              </p>
              <button 
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {journalEntries.length === 0 
                  ? "Create your first Journal Entry"
                  : "Create new Journal Entry"
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
                        Entry Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posting Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Debit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Credit
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
                    {filteredEntries.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.entryType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.postingDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{entry.totalDebit.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{entry.totalCredit.toFixed(2)}
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
                  Showing {filteredEntries.length} of {journalEntries.length} entries
                </span>
                <span>
                  Total Debit: ₹{filteredEntries.reduce((sum, entry) => sum + entry.totalDebit, 0).toFixed(2)}
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

export default JournalEntryForm;