import React from 'react';

const ChartOfAccounts = () => {
  const chartOfAccounts = [
    { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: '$450,000' },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: '$180,000' },
    { code: '1200', name: 'Inventory', type: 'Asset', balance: '$95,000' },
    { code: '1300', name: 'Prepaid Expenses', type: 'Asset', balance: '$25,000' },
    { code: '1400', name: 'Fixed Assets', type: 'Asset', balance: '$800,000' },
    { code: '1500', name: 'Accumulated Depreciation', type: 'Asset', balance: '-$150,000' },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: '$120,000' },
    { code: '2100', name: 'Accrued Expenses', type: 'Liability', balance: '$45,000' },
    { code: '2200', name: 'Short-term Loans', type: 'Liability', balance: '$200,000' },
    { code: '3000', name: 'Common Stock', type: 'Equity', balance: '$500,000' },
    { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: '$635,000' },
    { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: '$850,000' },
    { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: '$125,000' },
    { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: '$350,000' },
    { code: '5100', name: 'Salaries and Wages', type: 'Expense', balance: '$280,000' },
    { code: '5200', name: 'Rent Expense', type: 'Expense', balance: '$60,000' },
    { code: '5300', name: 'Utilities Expense', type: 'Expense', balance: '$25,000' },
    { code: '5400', name: 'Marketing Expense', type: 'Expense', balance: '$45,000' },
    { code: '5500', name: 'Insurance Expense', type: 'Expense', balance: '$30,000' },
    { code: '5600', name: 'Depreciation Expense', type: 'Expense', balance: '$50,000' }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Asset':
        return 'bg-green-100 text-green-800';
      case 'Liability':
        return 'bg-red-100 text-red-800';
      case 'Equity':
        return 'bg-blue-100 text-blue-800';
      case 'Revenue':
        return 'bg-purple-100 text-purple-800';
      case 'Expense':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const assets = chartOfAccounts.filter(account => account.type === 'Asset');
  const liabilities = chartOfAccounts.filter(account => account.type === 'Liability');
  const equity = chartOfAccounts.filter(account => account.type === 'Equity');
  const revenue = chartOfAccounts.filter(account => account.type === 'Revenue');
  const expenses = chartOfAccounts.filter(account => account.type === 'Expense');

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
        <p className="text-gray-600">Complete listing of all accounts in the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-green-600">Assets</h2>
            <p className="text-sm text-gray-500">Resources owned by the company</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {assets.map((account) => (
                <div key={account.code} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-500">{account.code}</span>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{account.balance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-red-600">Liabilities</h2>
            <p className="text-sm text-gray-500">Debts and obligations</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {liabilities.map((account) => (
                <div key={account.code} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-500">{account.code}</span>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{account.balance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-blue-600">Equity</h2>
            <p className="text-sm text-gray-500">Owner's claims on assets</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {equity.map((account) => (
                <div key={account.code} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-500">{account.code}</span>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{account.balance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue & Expenses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-purple-600">Income Statement Accounts</h2>
            <p className="text-sm text-gray-500">Revenue and expense accounts</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Revenue */}
              <div>
                <h3 className="font-medium text-green-600 mb-2">Revenue</h3>
                <div className="space-y-2">
                  {revenue.map((account) => (
                    <div key={account.code} className="flex justify-between items-center py-2 pl-4 border-l-2 border-green-200">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm text-gray-500">{account.code}</span>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{account.balance}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expenses */}
              <div>
                <h3 className="font-medium text-red-600 mb-2">Expenses</h3>
                <div className="space-y-2">
                  {expenses.map((account) => (
                    <div key={account.code} className="flex justify-between items-center py-2 pl-4 border-l-2 border-red-200">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm text-gray-500">{account.code}</span>
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{account.balance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Assets</h3>
          <p className="text-xl font-bold text-green-600">
            ${assets.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Liabilities</h3>
          <p className="text-xl font-bold text-red-600">
            ${liabilities.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Equity</h3>
          <p className="text-xl font-bold text-blue-600">
            ${equity.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Net Income</h3>
          <p className="text-xl font-bold text-purple-600">
            ${(revenue.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0) -
               expenses.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;