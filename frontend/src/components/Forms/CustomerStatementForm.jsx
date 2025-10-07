import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Printer
} from 'lucide-react';

const CustomerStatementForm = ({ onBack }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-12-31'
  });
  const [statementData, setStatementData] = useState(null);
  const [loading, setLoading] = useState(false);

  const customers = [
    'ABC Corp',
    'XYZ Ltd',
    'Tech Solutions',
    'Global Traders',
    'Prime Industries'
  ];

  useEffect(() => {
    if (selectedCustomer) {
      generateStatement();
    }
  }, [selectedCustomer, dateRange]);

  const generateStatement = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockStatement = {
        customer: selectedCustomer,
        address: '123 Business Street, City, State 12345',
        statementPeriod: `${dateRange.from} to ${dateRange.to}`,
        generatedDate: new Date().toLocaleDateString(),
        transactions: [
          {
            date: '2024-01-15',
            type: 'Invoice',
            reference: 'INV-2024-001',
            description: 'Sale of goods and services',
            debit: 150000,
            credit: 0,
            balance: 150000
          },
          {
            date: '2024-02-01',
            type: 'Payment',
            reference: 'PAY-2024-001',
            description: 'Payment received via bank transfer',
            debit: 0,
            credit: 50000,
            balance: 100000
          },
          {
            date: '2024-02-15',
            type: 'Invoice',
            reference: 'INV-2024-002',
            description: 'Additional services rendered',
            debit: 75000,
            credit: 0,
            balance: 175000
          },
          {
            date: '2024-03-01',
            type: 'Payment',
            reference: 'PAY-2024-002',
            description: 'Partial payment received',
            debit: 0,
            credit: 100000,
            balance: 75000
          }
        ],
        summary: {
          openingBalance: 0,
          totalDebit: 225000,
          totalCredit: 150000,
          closingBalance: 75000,
          aging: {
            current: 0,
            '1-30': 0,
            '31-60': 75000,
            '61-90': 0,
            '90+': 0
          }
        }
      };

      setStatementData(mockStatement);
      setLoading(false);
    }, 1500);
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

  const exportStatement = (format) => {
    // Mock export functionality
    alert(`Statement exported as ${format.toUpperCase()}`);
  };

  const emailStatement = () => {
    // Mock email functionality
    alert('Statement sent via email');
  };

  const printStatement = () => {
    // Mock print functionality
    window.print();
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
                <span className="text-gray-400"></span>
                <span className="text-gray-900">Customer Statement</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {statementData && (
                <>
                  <button
                    onClick={printStatement}
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={emailStatement}
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                  <div className="relative">
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                </>
              )}
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
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">Customer Statement</h1>
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

          {/* Statement Content */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Statement</h3>
              <p className="text-gray-600">Please wait while we prepare the customer statement...</p>
            </div>
          ) : selectedCustomer ? (
            statementData ? (
              <div className="p-6">
                {/* Statement Header */}
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Statement</h2>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Customer:</strong> {statementData.customer}</p>
                        <p><strong>Address:</strong> {statementData.address}</p>
                        <p><strong>Statement Period:</strong> {statementData.statementPeriod}</p>
                        <p><strong>Generated:</strong> {statementData.generatedDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ₹{statementData.summary.closingBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Outstanding Balance
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">Opening Balance</p>
                        <p className="text-xl font-bold text-blue-900">
                          ₹{statementData.summary.openingBalance.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600">Total Invoiced</p>
                        <p className="text-xl font-bold text-red-900">
                          ₹{statementData.summary.totalDebit.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-red-400" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Total Payments</p>
                        <p className="text-xl font-bold text-green-900">
                          ₹{statementData.summary.totalCredit.toLocaleString()}
                        </p>
                      </div>
                      <TrendingDown className="w-6 h-6 text-green-400" />
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 ${statementData.summary.closingBalance > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${statementData.summary.closingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          Closing Balance
                        </p>
                        <p className={`text-xl font-bold ${statementData.summary.closingBalance > 0 ? 'text-orange-900' : 'text-green-900'}`}>
                          ₹{statementData.summary.closingBalance.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className={`w-6 h-6 ${statementData.summary.closingBalance > 0 ? 'text-orange-400' : 'text-green-400'}`} />
                    </div>
                  </div>
                </div>

                {/* Aging Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Aging Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(statementData.summary.aging).map(([period, amount]) => (
                      <div key={period} className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">{period === 'current' ? 'Current' : `${period} days`}</p>
                        <p className="text-lg font-bold text-gray-900">₹{amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
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
                        {statementData.transactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'Invoice' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                              {transaction.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {transaction.debit > 0 ? `₹${transaction.debit.toLocaleString()}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                              {transaction.credit > 0 ? `₹${transaction.credit.toLocaleString()}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              ₹{transaction.balance.toLocaleString()}
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
                            ₹{statementData.summary.totalDebit.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                            ₹{statementData.summary.totalCredit.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                            ₹{statementData.summary.closingBalance.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    This statement is generated automatically. Please contact us if you have any questions about the transactions listed above.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No statement data available</h3>
                <p className="text-gray-500">Unable to generate statement for the selected customer and date range.</p>
              </div>
            )
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a customer to generate statement</h3>
              <p className="text-gray-500">Choose a customer from the dropdown above to generate their account statement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerStatementForm;