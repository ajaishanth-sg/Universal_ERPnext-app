import React, { useState } from 'react';
import { ArrowLeft, Filter, Settings, MoreHorizontal, FileText, Printer, Download } from 'lucide-react';

const CustomerLedgerSummaryForm = ({ onBack }) => {
  const [filters, setFilters] = useState({
    company: 'cube',
    fromDate: '2025-08-22',
    toDate: '2025-09-22',
    financeBook: 'Finance Book',
    customer: '',
    customerGroup: '',
    territory: '',
    salesPartner: '',
    salesPerson: '',
    paymentTermsTemplate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">
          Customer Ledger Summary
        </h1>
        <div className="flex space-x-2">
          <button className="p-2 border rounded-md hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <select
              name="company"
              value={filters.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="cube">cube</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Finance Book</label>
            <select
              name="financeBook"
              value={filters.financeBook}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Finance Book">Finance Book</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              name="customer"
              value={filters.customer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Customer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Group</label>
            <select
              name="customerGroup"
              value={filters.customerGroup}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Customer Group</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Territory</label>
            <select
              name="territory"
              value={filters.territory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Territory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sales Partner</label>
            <select
              name="salesPartner"
              value={filters.salesPartner}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Sales Partner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sales Person</label>
            <select
              name="salesPerson"
              value={filters.salesPerson}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Sales Person</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms Template</label>
            <select
              name="paymentTermsTemplate"
              value={filters.paymentTermsTemplate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Payment Terms Template</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-4 text-gray-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">Nothing to show</p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          For comparison, use {'>'}5, {'<'}10 or =324. For ranges, use 5:10 (for values between 5 & 10).
        </div>
        <div>
          Execution Time: 0.002483 sec
        </div>
      </div>
    </div>
  );
};

export default CustomerLedgerSummaryForm;
