import React, { useState } from 'react';

const AccountingDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const accountingData = {
    totalAssets: '$2,450,000',
    totalLiabilities: '$890,000',
    totalEquity: '$1,560,000',
    monthlyRevenue: '$125,000',
    monthlyExpenses: '$78,000',
    netIncome: '$47,000'
  };

  const recentTransactions = [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Sales Invoice #INV-2024-001',
      type: 'income',
      amount: '$15,000',
      status: 'posted'
    },
    {
      id: 2,
      date: '2024-01-14',
      description: 'Office Rent Payment',
      type: 'expense',
      amount: '$8,500',
      status: 'posted'
    },
    {
      id: 3,
      date: '2024-01-13',
      description: 'Equipment Purchase',
      type: 'expense',
      amount: '$12,000',
      status: 'pending'
    },
    {
      id: 4,
      date: '2024-01-12',
      description: 'Service Revenue',
      type: 'income',
      amount: '$25,000',
      status: 'posted'
    }
  ];

  const chartOfAccounts = [
    { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: '$450,000' },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: '$180,000' },
    { code: '1200', name: 'Inventory', type: 'Asset', balance: '$95,000' },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: '$120,000' },
    { code: '3000', name: 'Revenue', type: 'Equity', balance: '$850,000' },
    { code: '4000', name: 'Expenses', type: 'Equity', balance: '$245,000' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Assets</h3>
                <p className="text-2xl font-bold text-green-600">{accountingData.totalAssets}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Liabilities</h3>
                <p className="text-2xl font-bold text-red-600">{accountingData.totalLiabilities}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Total Equity</h3>
                <p className="text-2xl font-bold text-blue-600">{accountingData.totalEquity}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">Net Income</h3>
                <p className="text-2xl font-bold text-purple-600">{accountingData.netIncome}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${transaction.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-green-600">{accountingData.monthlyRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses</span>
                    <span className="font-semibold text-red-600">{accountingData.monthlyExpenses}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="font-semibold">Net Income</span>
                    <span className="font-bold text-purple-600">{accountingData.netIncome}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'chart-of-accounts':
        return (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Chart of Accounts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {chartOfAccounts.map((account) => (
                  <div key={account.code} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-medium">{account.code} - {account.name}</p>
                      <p className="text-sm text-gray-500">{account.type}</p>
                    </div>
                    <p className="font-semibold">{account.balance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'journal-entries':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Journal Entries</h3>
            <p className="text-gray-500">Journal entries functionality coming soon...</p>
          </div>
        );
      
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Reports</h3>
            <p className="text-gray-500">Financial reporting functionality coming soon...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'chart-of-accounts', label: 'Chart of Accounts' },
          { id: 'journal-entries', label: 'Journal Entries' },
          { id: 'reports', label: 'Reports' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default AccountingDashboard;