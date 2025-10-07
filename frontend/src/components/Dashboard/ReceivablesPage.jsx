import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  Info,
  Zap,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  FileText,
  ChevronDown,
  X,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import PaymentEntryForm from '../Forms/PaymentEntryForm';
import SalesInvoiceForm from '../Forms/SalesInvoiceForm';
import POSInvoiceForm from '../Forms/POSInvoiceForm';
import JournalEntryForm from '../Forms/JournalEntryForm';
import AccountsReceivableForm from '../Forms/AccountsReceivableForm';
import CostCenterForm from '../Forms/CostCenterForm';
import CustomerLedgerForm from '../Forms/CustomerLedgerForm';
import PaymentReceiptForm from '../Forms/PaymentReceiptForm';
import AgingReportForm from '../Forms/AgingReportForm';
import CustomerStatementForm from '../Forms/CustomerStatementForm';

const ReceivablesPage = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, list, form
  const [currentForm, setCurrentForm] = useState(null);
  const [receivables, setReceivables] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for dashboard
  const dashboardStats = {
    totalReceivables: 2450000,
    overdueAmount: 450000,
    paidThisMonth: 890000,
    pendingPayments: 1560000,
    topCustomers: [
      { name: 'ABC Corp', amount: 450000 },
      { name: 'XYZ Ltd', amount: 320000 },
      { name: 'Tech Solutions', amount: 280000 }
    ]
  };

  const shortcuts = [
    { name: 'Sales Invoice', count: 0, form: 'sales-invoice', icon: FileText },
    { name: 'Payment Receipt', count: 0, form: 'payment-receipt', icon: DollarSign },
    { name: 'Customer Ledger', count: 0, form: 'customer-ledger', icon: Users },
    { name: 'Aging Report', count: 0, form: 'aging-report', icon: Clock },
    { name: 'Customer Statement', count: 0, form: 'customer-statement', icon: TrendingUp },
    { name: 'Journal Entry', count: 0, form: 'journal-entry', icon: FileText }
  ];

  useEffect(() => {
    if (currentView === 'list') {
      fetchReceivables();
    }
  }, [currentView]);

  const fetchReceivables = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual API calls
      setReceivables([
        {
          id: 'AR-001',
          customer: 'ABC Corp',
          invoiceNumber: 'INV-2024-001',
          amount: 150000,
          outstandingAmount: 50000,
          dueDate: '2024-10-15',
          status: 'Partially Paid',
          age: 15
        },
        {
          id: 'AR-002',
          customer: 'XYZ Ltd',
          invoiceNumber: 'INV-2024-002',
          amount: 200000,
          outstandingAmount: 200000,
          dueDate: '2024-09-30',
          status: 'Overdue',
          age: 35
        }
      ]);
    } catch (error) {
      console.error('Error fetching receivables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormNavigation = (formType) => {
    setCurrentForm(formType);
    setCurrentView('form');
  };

  const handleBackToReceivables = () => {
    setCurrentForm(null);
    setCurrentView('dashboard');
  };

  const handleViewList = () => {
    setCurrentView('list');
  };

  // Render forms based on currentForm state
  if (currentView === 'form') {
    if (currentForm === 'sales-invoice') {
      return <SalesInvoiceForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'payment-receipt') {
      return <PaymentReceiptForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'customer-ledger') {
      return <CustomerLedgerForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'aging-report') {
      return <AgingReportForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'customer-statement') {
      return <CustomerStatementForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'journal-entry') {
      return <JournalEntryForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'accounts-receivable') {
      return <AccountsReceivableForm onBack={handleBackToReceivables} />;
    }
    if (currentForm === 'cost-center') {
      return <CostCenterForm onBack={handleBackToReceivables} />;
    }
  }

  // Main dashboard view
  if (currentView === 'dashboard') {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Accounts Receivable</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleViewList}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Receivables
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Receivables</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.totalReceivables.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.overdueAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.paidThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.pendingPayments.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                onClick={() => handleFormNavigation(shortcut.form)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <shortcut.icon className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 text-center">{shortcut.name}</span>
                {shortcut.count > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mt-2">
                    {shortcut.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers by Outstanding Amount</h2>
          <div className="space-y-4">
            {dashboardStats.topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{customer.name}</span>
                </div>
                <span className="font-bold text-gray-900">₹{customer.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // List view
  if (currentView === 'list') {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Receivables</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search receivables..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Receivable</span>
            </button>
          </div>
        </div>

        {/* Receivables Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Receivables List</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading receivables...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
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
                  {receivables.map((receivable, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                        {receivable.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{receivable.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{receivable.outstandingAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          receivable.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          receivable.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {receivable.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-600 hover:text-blue-600" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-green-600" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-red-600" title="Delete">
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
    );
  }

  return null;
};

export default ReceivablesPage;