import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Building2,
  Users,
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Info,
  X,
  Play,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  BookOpen,
  LayoutGrid,
  List
} from 'lucide-react';


const AccountingDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    chartOfAccounts: true,
    payables: false,
    receivables: false,
    financialReports: false
  });
  const [expandedAccounts, setExpandedAccounts] = useState({});
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPurchasesPeriodDropdown, setShowPurchasesPeriodDropdown] = useState(false);
  const [showSalesPeriodDropdown, setShowSalesPeriodDropdown] = useState(false);
  const [showReceivablesFilterModal, setShowReceivablesFilterModal] = useState(false);
  const [showPayablesFilterModal, setShowPayablesFilterModal] = useState(false);
  const [selectedPurchasesPeriod, setSelectedPurchasesPeriod] = useState('Monthly');
  const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('Monthly');

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/accounting');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching accounting dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to render bar charts
  const renderBarChart = (data, maxValue) => {
    return (
      <div className="flex items-end h-48 space-x-2 p-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-12">
            <div
              className="w-8 bg-red-500 rounded-t"
              style={{ height: `${(item.total / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-1">{item._id}</span>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render donut charts
  const renderDonutChart = (data) => {
    const total = data.reduce((sum, item) => sum + item.total, 0);
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    let cumulativePercentage = 0;

    const colors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'];

    return (
      <div className="relative w-48 h-48 mx-auto my-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = (item.total / total) * 100;
            const [startX, startY] = getCoordinates(cumulativePercentage, radius, centerX, centerY);
            cumulativePercentage += percentage;
            const [endX, endY] = getCoordinates(cumulativePercentage, radius, centerX, centerY);
            const largeArcFlag = percentage > 50 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                fill={colors[index % colors.length]}
              />
            );
          })}
        </svg>
        <div className="flex justify-center space-x-4 mt-4 flex-wrap">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-1 mx-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-xs text-gray-600">{item._id}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to calculate coordinates for donut chart
  const getCoordinates = (percentage, radius, centerX, centerY) => {
    const angle = (percentage / 100) * 360 - 90;
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
    return [x, y];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounting dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  // Use fetched data for stats
  const accountingStats = [
    {
      title: "Total Revenue",
      value: `₹${dashboardData.stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%", // Placeholder - would need previous period comparison
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Total Expenses",
      value: `₹${dashboardData.stats.totalExpenses.toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Net Profit",
      value: `₹${dashboardData.stats.netProfit.toLocaleString()}`,
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Outstanding Invoices",
      value: `₹${dashboardData.stats.outstandingInvoices.toLocaleString()}`,
      change: "-5.1%",
      trend: "down",
      icon: Receipt,
      color: "from-orange-500 to-yellow-600"
    }
  ];

  const chartOfAccounts = [
    {
      account: "Assets",
      type: "Asset",
      balance: "$2,100,000",
      children: [
        { name: "Current Assets", balance: "$850,000" },
        { name: "Fixed Assets", balance: "$1,250,000" }
      ]
    },
    {
      account: "Liabilities",
      type: "Liability",
      balance: "$800,000",
      children: [
        { name: "Current Liabilities", balance: "$300,000" },
        { name: "Long-term Liabilities", balance: "$500,000" }
      ]
    },
    {
      account: "Equity",
      type: "Equity",
      balance: "$1,300,000",
      children: [
        { name: "Owner's Equity", balance: "$1,000,000" },
        { name: "Retained Earnings", balance: "$300,000" }
      ]
    },
    {
      account: "Income",
      type: "Income",
      balance: "$2,450,000",
      children: [
        { name: "Operating Income", balance: "$2,200,000" },
        { name: "Other Income", balance: "$250,000" }
      ]
    },
    {
      account: "Expenses",
      type: "Expense",
      balance: "$1,850,000",
      children: [
        { name: "Operating Expenses", balance: "$1,500,000" },
        { name: "Administrative Expenses", balance: "$350,000" }
      ]
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleAccount = (accountIndex) => {
    setExpandedAccounts(prev => ({
      ...prev,
      [accountIndex]: !prev[accountIndex]
    }));
  };

  const handleAddAccount = () => {
    setShowAddAccountModal(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowEditAccountModal(true);
  };

  const navigateToPage = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {accountingStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Incoming Bills Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Incoming Bills (Purchases)</h2>
              <p className="text-gray-500 text-sm">Last synced just now</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button onClick={() => setShowPurchasesPeriodDropdown(!showPurchasesPeriodDropdown)} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <span className="text-sm text-gray-700">{selectedPurchasesPeriod}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showPurchasesPeriodDropdown && (
                  <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button onClick={() => { setSelectedPurchasesPeriod('Last Year'); setShowPurchasesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">Last Year</button>
                    <button onClick={() => { setSelectedPurchasesPeriod('This Year'); setShowPurchasesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">This Year</button>
                    <button onClick={() => { setSelectedPurchasesPeriod('Monthly'); setShowPurchasesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">Monthly</button>
                  </div>
                )}
              </div>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderBarChart(dashboardData.charts.monthlyPurchases, Math.max(...dashboardData.charts.monthlyPurchases.map(d => d.total), 0))}
        </div>

        {/* Outgoing Bills Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Outgoing Bills (Sales)</h2>
              <p className="text-gray-500 text-sm">Last synced just now</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button onClick={() => setShowSalesPeriodDropdown(!showSalesPeriodDropdown)} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <span className="text-sm text-gray-700">{selectedSalesPeriod}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showSalesPeriodDropdown && (
                  <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button onClick={() => { setSelectedSalesPeriod('Last Year'); setShowSalesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">Last Year</button>
                    <button onClick={() => { setSelectedSalesPeriod('This Year'); setShowSalesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">This Year</button>
                    <button onClick={() => { setSelectedSalesPeriod('Monthly'); setShowSalesPeriodDropdown(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-100">Monthly</button>
                  </div>
                )}
              </div>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderBarChart(dashboardData.charts.monthlySales, Math.max(...dashboardData.charts.monthlySales.map(d => d.total), 0))}
        </div>

        {/* Accounts Receivable Aging */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Accounts Receivable Aging</h2>
              <p className="text-gray-500 text-sm">Current status of receivables</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowReceivablesFilterModal(true)} className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderDonutChart(dashboardData.charts.receivableAging)}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
            {dashboardData.charts.receivableAging.map((item, index) => (
              <div key={index} className="p-2">
                <p className="text-sm text-gray-500">{item._id}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(item.total).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts Payable Aging */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Accounts Payable Aging</h2>
              <p className="text-gray-500 text-sm">Current status of payables</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowPayablesFilterModal(true)} className="p-1 text-gray-500 hover:text-gray-700">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderDonutChart(dashboardData.charts.payableAging)}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
            {dashboardData.charts.payableAging.map((item, index) => (
              <div key={index} className="p-2">
                <p className="text-sm text-gray-500">{item._id}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(item.total).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart of Accounts Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('chartOfAccounts')}
        >
          <div className="flex items-center space-x-3">
            {expandedSections.chartOfAccounts ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              Chart of Accounts
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleAddAccount} className="p-2 text-blue-600 hover:text-blue-700">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => setShowFilterModal(true)} className="p-2 text-gray-500 hover:text-gray-700">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        {expandedSections.chartOfAccounts && (
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-4">
              {chartOfAccounts.map((account, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {account.account}
                        </p>
                        <p className="text-xs text-gray-500">
                          {account.type} • Balance: {account.balance}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => toggleAccount(index)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      {expandedAccounts[index] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                  {expandedAccounts[index] && (
                    <div className="mt-3 ml-12 space-y-2">
                      {account.children.map((child, childIndex) => (
                        <div key={childIndex} className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors">
                          <div className="flex items-center space-x-3">
                            <File className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-700">
                              {child.name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-700">
                              {child.balance}
                            </p>
                            <button onClick={() => handleEditAccount(child)} className="p-1 text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input type="text" placeholder="Enter account name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                  <option>Asset</option>
                  <option>Liability</option>
                  <option>Equity</option>
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Parent Account</label>
                <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                  <option>None</option>
                  {chartOfAccounts.map((account, index) => (
                    <option key={index} value={account.account}>{account.account}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
                <input type="number" placeholder="0.00" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddAccountModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="button" onClick={() => { alert('Account added successfully'); setShowAddAccountModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditAccountModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Account</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input type="text" defaultValue={selectedAccount.name} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <input type="number" defaultValue={selectedAccount.balance.replace('$', '')} className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowEditAccountModal(false); setSelectedAccount(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="button" onClick={() => { alert('Account updated successfully'); setShowEditAccountModal(false); setSelectedAccount(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Filter Accounts</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm">
                  <option>All</option>
                  <option>Asset</option>
                  <option>Liability</option>
                  <option>Equity</option>
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Balance Range</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                  <input type="number" placeholder="Max" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowFilterModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="button" onClick={() => { alert('Filters applied'); setShowFilterModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showReceivablesFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Filter Receivables</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <input type="text" placeholder="Enter customer name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amount Range</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                  <input type="number" placeholder="Max" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Due Date Range</label>
                <div className="flex space-x-2">
                  <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                  <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowReceivablesFilterModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="button" onClick={() => { alert('Filters applied'); setShowReceivablesFilterModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPayablesFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Filter Payables</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vendor</label>
                <input type="text" placeholder="Enter vendor name" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amount Range</label>
                <div className="flex space-x-2">
                  <input type="number" placeholder="Min" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                  <input type="number" placeholder="Max" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Due Date Range</label>
                <div className="flex space-x-2">
                  <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                  <input type="date" className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowPayablesFilterModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                <button type="button" onClick={() => { alert('Filters applied'); setShowPayablesFilterModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;