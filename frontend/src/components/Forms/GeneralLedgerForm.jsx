import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, Settings, MoreHorizontal, FileText, Printer, Download, X, Check, Calendar, Clock, AlertCircle } from 'lucide-react';

const GeneralLedgerForm = ({ onBack }) => {
  const [filters, setFilters] = useState({
    company: 'cube',
    fromDate: '2025-08-22',
    toDate: '2025-09-22',
    voucherNo: '',
    partyType: '',
    party: '',
    financeBook: 'Finance Book',
    categorizeByVoucher: false,
    currency: 'INR',
    costCenter: '',
    project: '',
    includeDimensions: true,
    showOpeningEntries: false,
    includeDefaultEntries: true,
    showCancelledEntries: false,
    showNetValues: false,
    ignoreExchangeRate: false,
    ignoreSystemNotes: false,
  });

  const ledgerData = [
    {
      postingDate: '2025-08-22',
      account: 'Opening',
      debit: '₹ 0.00',
      credit: '₹ 0.00',
      balance: '₹ 0.00',
      voucherType: '',
      voucherSubtype: '',
      voucherNo: '',
      againstVoucher: '',
    },
    {
      postingDate: '2025-08-22',
      account: 'Total',
      debit: '₹ 0.00',
      credit: '₹ 0.00',
      balance: '₹ 0.00',
      voucherType: '',
      voucherSubtype: '',
      voucherNo: '',
      againstVoucher: '',
    },
    {
      postingDate: '2025-09-22',
      account: 'Closing (Opening + Total)',
      debit: '₹ 0.00',
      credit: '₹ 0.00',
      balance: '₹ 0.00',
      voucherType: '',
      voucherSubtype: '',
      voucherNo: '',
      againstVoucher: '',
    },
  ];

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

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
          General Ledger
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Against Voucher No</label>
            <input
              type="text"
              name="voucherNo"
              value={filters.voucherNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Voucher No"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Party Type</label>
            <select
              name="partyType"
              value={filters.partyType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Party Type</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Party</label>
            <select
              name="party"
              value={filters.party}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Party</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.categorizeByVoucher}
              onChange={() => toggleFilter('categorizeByVoucher')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="categorizeByVoucher"
            />
            <label htmlFor="categorizeByVoucher" className="block text-sm font-medium text-gray-700">
              Categorize by Voucher
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              value={filters.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
            <select
              name="costCenter"
              value={filters.costCenter}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Cost Center</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              name="project"
              value={filters.project}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Project</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includeDimensions}
              onChange={() => toggleFilter('includeDimensions')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="includeDimensions"
            />
            <label htmlFor="includeDimensions" className="block text-sm font-medium text-gray-700">
              Consider Accounting Dimensions
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showOpeningEntries}
              onChange={() => toggleFilter('showOpeningEntries')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="showOpeningEntries"
            />
            <label htmlFor="showOpeningEntries" className="block text-sm font-medium text-gray-700">
              Show Opening Entries
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includeDefaultEntries}
              onChange={() => toggleFilter('includeDefaultEntries')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="includeDefaultEntries"
            />
            <label htmlFor="includeDefaultEntries" className="block text-sm font-medium text-gray-700">
              Include Default FB Entries
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showCancelledEntries}
              onChange={() => toggleFilter('showCancelledEntries')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="showCancelledEntries"
            />
            <label htmlFor="showCancelledEntries" className="block text-sm font-medium text-gray-700">
              Show Cancelled Entries
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showNetValues}
              onChange={() => toggleFilter('showNetValues')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="showNetValues"
            />
            <label htmlFor="showNetValues" className="block text-sm font-medium text-gray-700">
              Show Net Values in Party Account
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.ignoreExchangeRate}
              onChange={() => toggleFilter('ignoreExchangeRate')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="ignoreExchangeRate"
            />
            <label htmlFor="ignoreExchangeRate" className="block text-sm font-medium text-gray-700">
              Ignore Exchange Rate Revaluation and Gain / Loss Journals
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.ignoreSystemNotes}
              onChange={() => toggleFilter('ignoreSystemNotes')}
              className="h-4 w-4 text-blue-600 rounded mr-2"
              id="ignoreSystemNotes"
            />
            <label htmlFor="ignoreSystemNotes" className="block text-sm font-medium text-gray-700">
              Ignore System Generated Credit / Debit Notes
            </label>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posting Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit (INR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit (INR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance (INR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher Subtype</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Against Voucher</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ledgerData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.postingDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.debit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.credit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.balance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.voucherType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.voucherSubtype}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.voucherNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.againstVoucher}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</td>
                <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">₹ 0.00</td>
                <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">₹ 0.00</td>
                <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">₹ 0.00</td>
                <td colSpan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="p-4 text-sm text-gray-500 flex justify-between items-center border-t border-gray-200">
          <div>
            For comparison, use {'>'}5, {'<'}10 or =324. For ranges, use 5:10 (for values between 5 & 10).
          </div>
          <div>
            Execution Time: 0.03205 sec
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralLedgerForm;
