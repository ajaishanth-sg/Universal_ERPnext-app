import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const CustomerLedgerForm = ({ onBack }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-12-31'
  });
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const customers = [
    'ABC Corp',
    'XYZ Ltd',
    'Tech Solutions',
    'Global Traders',
    'Prime Industries'
  ];

  // Mock ledger data
  const mockLedgerData = [
    {
      date: '2024-01-15',
      type: 'Invoice',
      reference: 'INV-2024-001',
      description: 'Sale of goods',
      debit: 150000,
      credit: 0,
      balance: 150000
    },
    {
      date: '2024-02-01',
      type: 'Payment',
      reference: 'PAY-2024-001',
      description: 'Payment received',
      debit: 0,
      credit: 50000,
      balance: 100000
    },
    {
      date: '2024-02-15',
      type: 'Invoice',
      reference: 'INV-2024-002',
      description: 'Additional services',
      debit: 75000,
      credit: 0,
      balance: 175000
    },
    {
      date: '2024-03-01',
      type: 'Payment',
      reference: 'PAY-2024-002',
      description: 'Partial payment',
      debit: 0,
      credit: 100000,
      balance: 75000
    }
  ];

  useEffect(() => {
    if (selectedCustomer) {
      fetchLedgerData();
    }
  }, [selectedCustomer, dateRange]);

  const fetchLedgerData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLedgerData(mockLedgerData);
      setLoading(false);
    }, 1000);
  };

  const handleCustomerChange = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotals = () => {
    const totalDebit = ledgerData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = ledgerData.reduce((sum, item) => sum + item.credit, 0);
    const balance = totalDebit - totalCredit;
    return { totalDebit, totalCredit, balance };
  };

  const { totalDebit, totalCredit, balance } = calculateTotals();

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
                <span className="text-gray-400"></span>
                <span className="text-gray-900">Customer Ledger</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
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
                <h1 className="text-lg font-semibold text-gray-900">Customer Ledger</h1>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer}>{customer}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {selectedCustomer && (
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Debit</p>
                      <p className="text-2xl font-bold text-blue-900">₹{totalDebit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingDown className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Total Credit</p>
                      <p className="text-2xl font-bold text-green-900">₹{totalCredit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${balance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="flex items-center">
                    <TrendingUp className={`w-8 h-8 ${balance >= 0 ? 'text-red-600' : 'text-green-600'}`} />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${balance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Outstanding Balance
                      </p>
                      <p className={`text-2xl font-bold ${balance >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                        ₹{Math.abs(balance).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ledger Table */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading ledger data...</span>
              </div>
            ) : selectedCustomer ? (
              ledgerData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Debit
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credit
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ledgerData.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.type === 'Invoice' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                            {entry.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            ₹{entry.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900">
                          Totals
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                          ₹{totalDebit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                          ₹{totalCredit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                          ₹{Math.abs(balance).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ledger entries found</h3>
                  <p className="text-gray-500">No transactions found for the selected customer and date range.</p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a customer to view ledger</h3>
                <p className="text-gray-500">Choose a customer from the dropdown above to view their transaction history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLedgerForm;