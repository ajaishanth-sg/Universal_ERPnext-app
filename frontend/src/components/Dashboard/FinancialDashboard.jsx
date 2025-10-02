import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const FinancialDashboard = ({ onNavigate, bankAccounts, recentTransactions, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [showCashWithdrawalModal, setShowCashWithdrawalModal] = useState(false);
  const [showLiquidityForecastModal, setShowLiquidityForecastModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [showDepositFundsModal, setShowDepositFundsModal] = useState(false);
  const [showWithdrawFundsModal, setShowWithdrawFundsModal] = useState(false);
  const [showBankReconciliationModal, setShowBankReconciliationModal] = useState(false);
  const [showDebitCardAlertsModal, setShowDebitCardAlertsModal] = useState(false);
  const [showAddDebitCardModal, setShowAddDebitCardModal] = useState(false);
  const [debitCards, setDebitCards] = useState([]);
  const [debitCardAlerts, setDebitCardAlerts] = useState([]);
  const [debitCardSettings, setDebitCardSettings] = useState(null);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/financial');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching financial dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch debit cards data
  useEffect(() => {
    const fetchDebitCardsData = async () => {
      try {
        const [cardsResponse, alertsResponse, settingsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/debit-cards/'),
          fetch('http://localhost:5000/api/debit-cards/alerts/'),
          fetch('http://localhost:5000/api/debit-cards/settings/')
        ]);

        if (cardsResponse.ok) {
          const cards = await cardsResponse.json();
          setDebitCards(cards);
        }

        if (alertsResponse.ok) {
          const alerts = await alertsResponse.json();
          setDebitCardAlerts(alerts);
        }

        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          setDebitCardSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching debit cards data:', error);
      }
    };

    fetchDebitCardsData();
  }, []);

  // Refresh debit cards data when modal opens
  useEffect(() => {
    if (showAddDebitCardModal) {
      const refreshData = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/debit-cards/');
          if (response.ok) {
            const cards = await response.json();
            setDebitCards(cards);
          }
        } catch (error) {
          console.error('Error refreshing debit cards data:', error);
        }
      };

      refreshData();
    }
  }, [showAddDebitCardModal]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const financialStats = [
    {
      title: "Total Assets",
      value: `₹${dashboardData.stats.totalAssets.toLocaleString()}`,
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${dashboardData.stats.monthlyRevenue.toLocaleString()}`,
      change: "+12.3%",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Outstanding Payments",
      value: `₹${dashboardData.stats.outstandingPayments.toLocaleString()}`,
      change: "-8.1%",
      trend: "down",
      icon: CreditCard,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Bank Accounts",
      value: dashboardData.stats.bankAccounts.toString(),
      change: "+1",
      trend: "up",
      icon: Building2,
      color: "from-purple-500 to-violet-600"
    }
  ];


  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payments', label: 'Payments' },
    { id: 'treasury', label: 'Treasury' },
    { id: 'banking', label: 'Banking' }
  ];

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ================== TAB CONTENT ================== */}

      {/* Overview */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <p className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Transactions & Bank Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'payment' ? 'bg-red-100' :
                        transaction.type === 'transfer' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        {transaction.type === 'payment' ? (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        ) : transaction.type === 'transfer' ? (
                          <ArrowUpRight className="w-4 h-4 text-blue-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.account} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{`₹${parseFloat(transaction.amount).toLocaleString()}`}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Bank Accounts</h2>
                <button
                  onClick={() => onNavigate('banking')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View All</span>
                </button>
              </div>
              <div className="space-y-4">
                {bankAccounts.map((account, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.bank} • {account.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{`₹${parseFloat(account.balance || 0).toLocaleString()}`}</p>
                        <p className="text-xs text-gray-500">{account.currency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => onNavigate('payments')}
                className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
              >
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Process Payment</p>
              </button>
              <button
                onClick={() => onNavigate('treasury')}
                className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
              >
                <CreditCard className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Transfer Funds</p>
              </button>
              <button
                onClick={() => onNavigate('banking')}
                className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
              >
                <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Bank Statement</p>
              </button>
              <button
                onClick={() => onNavigate('financial-reports')}
                className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
              >
                <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Financial Report</p>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payments */}
{activeTab === 'payments' && (
  <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
    <h2 className="text-xl font-semibold">Payments</h2>
    <p className="text-gray-600">Manage outgoing and incoming payments, track status, and generate reports.</p>

    {/* Payment Form */}
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-medium text-gray-800">Process New Payment</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Payee / Vendor</label>
          <input type="text" placeholder="Enter payee name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input type="number" placeholder="Enter amount" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
          <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {bankAccounts.map((account, index) => (
              <option key={index} value={account.name}>{account.name} ({`₹${parseFloat(account.balance || 0).toLocaleString()}`})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea placeholder="Payment details" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Process Payment
          </button>
        </div>
      </form>
    </div>

    {/* Recent Payments Table */}
    <div className="border p-4 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">Recent Payments</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Payee</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Account</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.date}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.description}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.amount}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.account}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Quick Financial Summary */}
    <div className="border p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Payments Processed</p>
        <p className="text-xl font-bold text-gray-900">$190,700</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Pending Payments</p>
        <p className="text-xl font-bold text-gray-900">$12,500</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Failed / Canceled Payments</p>
        <p className="text-xl font-bold text-gray-900">$0</p>
      </div>
    </div>
  </div>
)}

     {/* Treasury */}
{activeTab === 'treasury' && (
  <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
    <h2 className="text-xl font-semibold">Treasury Management</h2>
    <p className="text-gray-600">Monitor liquidity, cash flow, and investments.</p>

    {/* Cash Flow Overview */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Cash Available</p>
        <p className="text-xl font-bold text-gray-900">$1,850,000</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Investments Value</p>
        <p className="text-xl font-bold text-gray-900">$650,000</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Cash Flow (Monthly)</p>
        <p className="text-xl font-bold text-gray-900">+$125,000</p>
      </div>
    </div>

    {/* Treasury Reports */}
    <div className="border p-4 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">Treasury Reports</h3>
      <div className="space-y-2">
        <button className="w-full p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          Daily Cash Position Report
        </button>
        <button className="w-full p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          Monthly Liquidity Report
        </button>
        <button className="w-full p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          Investment Allocation Report
        </button>
      </div>
    </div>

    {/* Automated Debit Card Refill Alerts */}
   <div className="border p-4 rounded-lg">
     <div className="flex items-center justify-between mb-4">
       <h3 className="font-medium text-gray-800">Debit Card Management</h3>
       <div className="flex space-x-2">
         <button
           onClick={() => setShowAddDebitCardModal(true)}
           className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
         >
           <Plus className="w-4 h-4" />
           <span>Add Debit Card</span>
         </button>
         <button
           onClick={() => setShowDebitCardAlertsModal(true)}
           className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
         >
           <Plus className="w-4 h-4" />
           <span>Configure Alerts</span>
         </button>
       </div>
     </div>

      {/* Debit Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cards</p>
              <p className="text-xl font-bold text-gray-800">{debitCards.filter(card => card.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Low Balance Alerts</p>
              <p className="text-xl font-bold text-gray-800">{debitCardAlerts.filter(alert => !alert.isRead && alert.alertType === 'low_balance').length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Auto-Refilled Today</p>
              <p className="text-xl font-bold text-gray-800">{debitCardAlerts.filter(alert => alert.alertType === 'auto_refill' && new Date(alert.createdAt).toDateString() === new Date().toDateString()).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debit Card List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Debit Cards</h4>
        <div className="space-y-2">
          {debitCards.length === 0 ? (
            <p className="text-sm text-gray-500">No debit cards configured</p>
          ) : (
            debitCards.map((card, index) => {
              const hasLowBalanceAlert = debitCardAlerts.some(alert =>
                alert.debitCardId === card.id && alert.alertType === 'low_balance' && !alert.isRead
              );
              return (
                <div key={card.id || index} className={`p-3 rounded-lg border hover:bg-gray-50 transition-colors ${
                  hasLowBalanceAlert ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        hasLowBalanceAlert ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {hasLowBalanceAlert ? (
                          <AlertCircle className={`w-4 h-4 ${hasLowBalanceAlert ? 'text-red-600' : 'text-blue-600'}`} />
                        ) : (
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{card.cardNumber}</p>
                        <p className="text-xs text-gray-500">{card.cardType} - {card.bankName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${hasLowBalanceAlert ? 'text-red-600' : 'text-gray-800'}`}>
                        ₹{parseFloat(card.currentBalance).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Balance</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      hasLowBalanceAlert ? 'bg-red-100 text-red-800' :
                      card.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {hasLowBalanceAlert ? 'Low Balance Alert' : card.status}
                    </span>
                    <span className="text-xs text-gray-500">Alert threshold: ₹{card.alertThreshold}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        onClick={() => setShowAddInvestmentModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Add Investment</p>
      </button>
      <button
        onClick={() => setShowCashWithdrawalModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Cash Withdrawal</p>
      </button>
      <button
        onClick={() => setShowLiquidityForecastModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Liquidity Forecast</p>
      </button>
      <button
        onClick={() => onNavigate('financial-reports')}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Treasury Report</p>
      </button>
    </div>
  </div>
)}

{/* Banking */}
{activeTab === 'banking' && (
  <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
    <h2 className="text-xl font-semibold">Banking Operations</h2>
    <p className="text-gray-600">Manage accounts, transactions, and liaise with banks.</p>

    {/* Bank Accounts Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {bankAccounts.map((account, index) => (
        <div key={index} className="border p-4 rounded-lg hover:bg-slate-50 transition-colors">
          <p className="text-sm font-medium text-gray-600">{account.name}</p>
          <p className="text-xs text-gray-500">{account.bank} • {account.type}</p>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-lg font-bold">{`₹${parseFloat(account.balance || 0).toLocaleString()}`}</p>
            <p className="text-xs text-gray-500">{account.currency}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Bank Transactions */}
    <div className="border p-4 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">Recent Bank Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Account</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Transaction</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.date}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.account}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.description}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{transaction.amount}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        onClick={() => setShowAddBankAccountModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Add Bank Account</p>
      </button>
      <button
        onClick={() => setShowDepositFundsModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <ArrowUpRight className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Deposit Funds</p>
      </button>
      <button
        onClick={() => setShowWithdrawFundsModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <ArrowDownRight className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Withdraw Funds</p>
      </button>
      <button
        onClick={() => setShowBankReconciliationModal(true)}
        className="p-4 rounded-lg border hover:bg-slate-50 transition-colors text-center"
      >
        <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Bank Reconciliation</p>
      </button>
    </div>
  </div>
)}


    </div>

    {/* Modals */}
    {showAddInvestmentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Add Investment</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Investment Type</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                <option>Stocks</option>
                <option>Bonds</option>
                <option>Real Estate</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddInvestmentModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Investment added successfully'); setShowAddInvestmentModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showCashWithdrawalModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Cash Withdrawal</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bank Account</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                {bankAccounts.map((account, index) => (
                  <option key={index} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input type="text" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowCashWithdrawalModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Cash withdrawal processed'); setShowCashWithdrawalModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Withdraw</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showLiquidityForecastModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Liquidity Forecast</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Current Liquidity Status:</p>
            <p className="text-lg font-bold text-green-600">$1,850,000 available</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Projected for next 30 days:</p>
            <p className="text-lg font-bold text-blue-600">$1,925,000</p>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowLiquidityForecastModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
          </div>
        </div>
      </div>
    )}
    {showFilterModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date From</label>
              <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date To</label>
              <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount Range</label>
              <div className="flex space-x-2">
                <input type="number" placeholder="Min" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                <input type="number" placeholder="Max" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowFilterModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Filters applied'); setShowFilterModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showAddBankAccountModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Add Bank Account</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input type="text" placeholder="Enter bank name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input type="text" placeholder="Enter account name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                <option>Checking</option>
                <option>Savings</option>
                <option>Business</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
              <input type="number" placeholder="0.00" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddBankAccountModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Bank account added successfully'); setShowAddBankAccountModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Account</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showDepositFundsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                {bankAccounts.map((account, index) => (
                  <option key={index} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" placeholder="Enter amount" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Deposit Date</label>
              <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" placeholder="Deposit details" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowDepositFundsModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Funds deposited successfully'); setShowDepositFundsModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Deposit</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showWithdrawFundsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                {bankAccounts.map((account, index) => (
                  <option key={index} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" placeholder="Enter amount" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Withdrawal Date</label>
              <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input type="text" placeholder="Withdrawal reason" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowWithdrawFundsModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Funds withdrawn successfully'); setShowWithdrawFundsModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Withdraw</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showBankReconciliationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Bank Reconciliation</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Bank Account</label>
              <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                {bankAccounts.map((account, index) => (
                  <option key={index} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Statement Balance</label>
              <input type="number" placeholder="Bank statement balance" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Book Balance</label>
              <input type="number" placeholder="Company book balance" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Adjustments</label>
              <textarea placeholder="List any adjustments needed" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowBankReconciliationModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={() => { alert('Reconciliation completed'); setShowBankReconciliationModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Reconcile</button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showDebitCardAlertsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Configure Debit Card Refill Alerts</h3>

          {/* Alert Settings */}
          <div className="space-y-6">
            <div className="border p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Global Alert Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Alert Threshold
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum balance before alert triggers</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-Refill Amount
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Amount to auto-refill when threshold reached</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Enable automatic refill</span>
                </label>
              </div>
            </div>

            {/* Individual Card Settings */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Individual Card Settings</h4>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">**** **** **** 1234 (HSBC)</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alert Threshold</label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Refill Amount</label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Enable alerts</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Auto-refill</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium">**** **** **** 5678 (Standard Chartered)</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Low Balance
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alert Threshold</label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Refill Amount</label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Enable alerts</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Auto-refill</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">**** **** **** 9012 (Emirates NBD)</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alert Threshold</label>
                      <input
                        type="number"
                        defaultValue="300"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Refill Amount</label>
                      <input
                        type="number"
                        defaultValue="800"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Enable alerts</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-xs text-gray-600">Auto-refill</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Notification Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Email notifications for low balance alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">SMS notifications for critical alerts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Dashboard notifications</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowDebitCardAlertsModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:5000/api/debit-cards/settings/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(debitCardSettings || {})
                  });
                  if (response.ok) {
                    alert('Debit card alert settings saved successfully!');
                    setShowDebitCardAlertsModal(false);
                  } else {
                    alert('Failed to save settings');
                  }
                } catch (error) {
                  console.error('Error saving settings:', error);
                  alert('Error saving settings');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    )}
    {showAddDebitCardModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add New Debit Card</h3>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newCard = {
              cardNumber: formData.get('cardNumber'),
              bankName: formData.get('bankName'),
              cardType: formData.get('cardType'),
              currentBalance: parseFloat(formData.get('currentBalance')),
              currency: formData.get('currency') || 'INR',
              alertThreshold: parseFloat(formData.get('alertThreshold')) || 500.0,
              autoRefillEnabled: formData.get('autoRefillEnabled') === 'on',
              autoRefillAmount: parseFloat(formData.get('autoRefillAmount')) || 1000.0,
              status: 'active'
            };

            try {
              const response = await fetch('http://localhost:5000/api/debit-cards/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard)
              });

              if (response.ok) {
                const savedCard = await response.json();

                // Add the new card to the existing cards state
                setDebitCards(prevCards => [...prevCards, savedCard]);

                alert('Debit card added successfully!');
                setShowAddDebitCardModal(false);

                // Reset form
                e.target.reset();
              } else {
                const errorData = await response.json();
                alert(`Failed to add debit card: ${errorData.detail || 'Unknown error'}`);
              }
            } catch (error) {
              console.error('Error adding debit card:', error);
              alert('Error adding debit card. Please check your connection and try again.');
            }
          }}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="**** **** **** 1234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Enter bank name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type *
                </label>
                <select
                  name="cardType"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select card type</option>
                  <option value="Primary Card">Primary Card</option>
                  <option value="Business Card">Business Card</option>
                  <option value="Travel Card">Travel Card</option>
                  <option value="Corporate Card">Corporate Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Balance *
                </label>
                <input
                  type="number"
                  name="currentBalance"
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="AED">AED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Threshold
                </label>
                <input
                  type="number"
                  name="alertThreshold"
                  placeholder="500"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum balance before alert triggers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-Refill Amount
                </label>
                <input
                  type="number"
                  name="autoRefillAmount"
                  placeholder="1000"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Amount to auto-refill when threshold reached</p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="autoRefillEnabled"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable automatic refill</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddDebitCardModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Debit Card
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

};

export default FinancialDashboard;