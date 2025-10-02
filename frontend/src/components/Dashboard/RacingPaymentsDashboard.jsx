import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CreditCard, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, Calendar,
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, FileText,
  Download, Upload, MoreVertical, CheckCircle, Clock, AlertTriangle, Receipt,
  PiggyBank, Target, Award
} from 'lucide-react';

const RacingPaymentsDashboard = ({ onBack }) => {
  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showViewTransaction, setShowViewTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('payments');
  const [newExpense, setNewExpense] = useState({
    type: 'Expense',
    category: 'Maintenance',
    title: '',
    amount: '',
    status: 'Pending',
    date: '',
    dueDate: '',
    description: '',
    reference: '',
    paymentMethod: 'Bank Transfer',
    fromAccount: '',
    toAccount: '',
    notes: ''
  });

  // Fetch transactions and maintenance data from backend
  useEffect(() => {
    fetchTransactions();
    fetchMaintenanceData();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/racing-payments');
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchMaintenanceData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/maintenance-requests');
      // Filter for racing-related maintenance only
      const racingMaintenance = response.data.filter(item =>
        item.location && item.location.toLowerCase().includes('racing')
      );
      setMaintenanceRequests(racingMaintenance);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    }
  };

  // Add new transaction
  const addExpense = async (transaction) => {
    try {
      const response = await axios.post('http://localhost:5000/api/racing-payments', transaction);
      setTransactions([...transactions, response.data]);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  // Update transaction
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/racing-payments/${id}`, updatedTransaction);
      setTransactions(transactions.map(t => (t.id === id ? response.data : t)));
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/racing-payments/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  // Handle add transaction
  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.category || !newExpense.amount || !newExpense.date) {
      alert('Please fill in all required fields!');
      return;
    }

    const amount = newExpense.type === 'Income'
      ? Math.abs(parseFloat(newExpense.amount))
      : -Math.abs(parseFloat(newExpense.amount));

    const transaction = {
      ...newExpense,
      amount,
      createdBy: 'Finance Manager',
      createdDate: new Date().toISOString().split('T')[0]
    };

    addExpense(transaction);
    setNewExpense({
      type: 'Expense',
      category: 'Maintenance',
      title: '',
      amount: '',
      status: 'Pending',
      date: '',
      dueDate: '',
      description: '',
      reference: '',
      paymentMethod: 'Bank Transfer',
      fromAccount: '',
      toAccount: '',
      notes: ''
    });
    setShowAddExpense(false);
  };

  // Handle view transaction
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowViewTransaction(true);
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (transaction) => {
    const id = transaction.id || transaction._id;
    if (!id || id === "null") {
      alert('Transaction ID not found');
      return;
    }
    const updatedTransaction = { ...transaction, status: 'Paid' };
    await updateTransaction(id, updatedTransaction);
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setNewExpense({
      type: transaction.type,
      category: transaction.category,
      title: transaction.title,
      amount: Math.abs(transaction.amount),
      status: transaction.status,
      date: transaction.date,
      dueDate: transaction.dueDate,
      description: transaction.description,
      reference: transaction.reference,
      paymentMethod: transaction.paymentMethod,
      fromAccount: transaction.fromAccount,
      toAccount: transaction.toAccount,
      notes: transaction.notes
    });
    setShowEditTransaction(true);
    setShowMenu(null);
  };

  // Handle update transaction
  const handleUpdateTransaction = () => {
    if (!newExpense.title || !newExpense.category || !newExpense.amount || !newExpense.date) {
      alert('Please fill in all required fields!');
      return;
    }

    const updatedTransaction = {
      ...newExpense,
      amount: newExpense.type === 'Expense' ? -Math.abs(parseFloat(newExpense.amount)) : Math.abs(parseFloat(newExpense.amount))
    };

    const id = selectedTransaction.id || selectedTransaction._id;
    if (!id || id === "null") {
      alert('Transaction ID not found');
      return;
    }

    updateTransaction(id, updatedTransaction);
    setShowEditTransaction(false);
    setSelectedTransaction(null);
    setNewExpense({
      type: 'Expense',
      category: 'Maintenance',
      title: '',
      amount: '',
      status: 'Pending',
      date: '',
      dueDate: '',
      description: '',
      reference: '',
      paymentMethod: 'Bank Transfer',
      fromAccount: '',
      toAccount: '',
      notes: ''
    });
  };

  // Toggle menu
  const toggleMenu = (transaction) => {
    const key = transaction._id || transaction.id || transaction.title + transaction.date;
    setShowMenu(showMenu === key ? null : key);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received':
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    return type === 'Income' ? ArrowUpRight : ArrowDownLeft;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sponsorship':
        return Award;
      case 'Prize Money':
        return Target;
      case 'Maintenance':
        return FileText;
      case 'Travel':
        return CreditCard;
      case 'Parts':
        return Receipt;
      case 'Salaries':
        return PiggyBank;
      default:
        return DollarSign;
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = totalIncome - totalExpenses;

  // Calculate month-over-month changes
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthIncome = transactions
    .filter(t => t.type === 'Income' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const previousMonthIncome = transactions
    .filter(t => t.type === 'Income' && new Date(t.date).getMonth() === previousMonth && new Date(t.date).getFullYear() === previousYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const incomeChange = previousMonthIncome > 0 ? (((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100).toFixed(1) : (currentMonthIncome > 0 ? '+100.0' : '0.0');

  const currentMonthExpenses = transactions
    .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const previousMonthExpenses = transactions
    .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === previousMonth && new Date(t.date).getFullYear() === previousYear)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const expenseChange = previousMonthExpenses > 0 ? (((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100).toFixed(1) : (currentMonthExpenses > 0 ? '+100.0' : '0.0');

  const currentMonthNet = currentMonthIncome - currentMonthExpenses;
  const previousMonthNet = previousMonthIncome - previousMonthExpenses;
  const netChange = previousMonthNet !== 0 ? (((currentMonthNet - previousMonthNet) / Math.abs(previousMonthNet)) * 100).toFixed(1) : (currentMonthNet > 0 ? '+100.0' : '0.0');

  const pendingCount = transactions.filter(t => t.status === 'Pending' || t.status === 'Overdue').length;
  const pendingChange = pendingCount > 0 ? `${pendingCount} pending` : '0 pending';

  const paymentStats = [
    {
      title: "Total Income",
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      change: `${incomeChange.startsWith('-') ? incomeChange : '+' + incomeChange}%`
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "from-red-500 to-pink-600",
      change: `${expenseChange.startsWith('-') ? expenseChange : '+' + expenseChange}%`
    },
    {
      title: "Net Income",
      value: `$${netIncome.toLocaleString()}`,
      icon: netIncome >= 0 ? TrendingUp : TrendingDown,
      color: netIncome >= 0 ? "from-blue-500 to-cyan-600" : "from-orange-500 to-red-600",
      change: `${netChange.startsWith('-') ? netChange : '+' + netChange}%`
    },
    {
      title: "Pending Payments",
      value: pendingCount,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      change: pendingChange
    }
  ];

  const tabs = [
    { id: 'payments', label: 'Payments' },
    { id: 'maintenance', label: 'Maintenance' }
  ];

  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
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

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <>
          {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paymentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-blue-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNewExpense({...newExpense, type: 'Income'});
              setShowAddExpense(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => {
              setNewExpense({...newExpense, type: 'Expense'});
              setShowAddExpense(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions by title, category, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="all">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="all">All Status</option>
                <option value="Received">Received</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const TypeIcon = getTypeIcon(transaction.type);
          const CategoryIcon = getCategoryIcon(transaction.category);
          return (
            <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    transaction.type === 'Income'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    <TypeIcon className={`w-6 h-6 ${
                      transaction.type === 'Income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      {transaction.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {transaction.category} • {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.amount >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(transaction)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showMenu === (transaction._id || transaction.id || transaction.title + transaction.date) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handleViewTransaction(transaction);
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleEditTransaction(transaction);
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Transaction
                            </button>
                            {(transaction.status === 'Pending' || transaction.status === 'Overdue') && (
                              <button
                                onClick={() => {
                                  handleMarkAsPaid(transaction);
                                  setShowMenu(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const id = transaction.id || transaction._id;
                                if (id && id !== "null") {
                                  handleDeleteTransaction(id);
                                } else {
                                  alert('Transaction ID not found');
                                }
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Transaction
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Method:</span>
                  <span className="text-black">{transaction.paymentMethod}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Due:</span>
                  <span className="text-black">{transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Attachments:</span>
                  <span className="text-black">{transaction.attachments || 0}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span>{transaction.fromAccount} → {transaction.toAccount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    {(transaction.status === 'Pending' || transaction.status === 'Overdue') && (
                      <button
                        onClick={() => handleMarkAsPaid(transaction)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Mark Paid</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const id = transaction.id || transaction._id;
                        if (id && id !== "null") {
                          handleDeleteTransaction(id);
                        } else {
                          alert('Transaction ID not found');
                        }
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Transaction Modal */}
      {showEditTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Engine Rebuild - Monaco GP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Prize Money">Prize Money</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Travel">Travel</option>
                  <option value="Parts">Parts</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newExpense.status}
                  onChange={(e) => setNewExpense({...newExpense, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Received">Received</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newExpense.dueDate}
                  onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Account
                </label>
                <input
                  type="text"
                  value={newExpense.fromAccount}
                  onChange={(e) => setNewExpense({...newExpense, fromAccount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Main Operating Account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Account
                </label>
                <input
                  type="text"
                  value={newExpense.toAccount}
                  onChange={(e) => setNewExpense({...newExpense, toAccount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Service Provider"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Description of the transaction"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditTransaction(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTransaction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Add Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Engine Rebuild - Monaco GP or Sponsorship Revenue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  {newExpense.type === 'Income' ? (
                    <>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="Prize Money">Prize Money</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Travel">Travel</option>
                      <option value="Parts">Parts</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newExpense.dueDate}
                  onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Account
                </label>
                <input
                  type="text"
                  value={newExpense.fromAccount}
                  onChange={(e) => setNewExpense({...newExpense, fromAccount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Main Operating Account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Account
                </label>
                <input
                  type="text"
                  value={newExpense.toAccount}
                  onChange={(e) => setNewExpense({...newExpense, toAccount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Service Provider"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Description of the expense"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddExpense(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Racing Maintenance</h2>
              <p className="text-gray-600">Manage maintenance requests for racing equipment and facilities</p>
            </div>
            <button
              onClick={() => {
                // Add maintenance request functionality could be added here
                alert('Add maintenance request functionality would be implemented here');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Request</span>
            </button>
          </div>

          {/* Maintenance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Requests</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status !== 'Completed').length}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status === 'Pending Approval').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status === 'Completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Maintenance Requests List */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Maintenance Requests</h3>
            <div className="space-y-4">
              {maintenanceRequests.length > 0 ? (
                maintenanceRequests.map((request) => (
                  <div key={request.id || request._id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-black">{request.title}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {request.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{request.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{request.estimatedCost}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No maintenance requests found for racing facilities.</p>
                  <p className="text-sm text-gray-400 mt-1">Add a new maintenance request to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {showViewTransaction && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Transaction Details</h2>
              <button
                onClick={() => setShowViewTransaction(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTransaction.type === 'Income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTransaction.type}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-black">{selectedTransaction.category}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-black font-medium">{selectedTransaction.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <p className={`text-xl font-bold ${
                    selectedTransaction.amount >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {selectedTransaction.amount >= 0 ? '+' : ''}${Math.abs(selectedTransaction.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-black">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <p className="text-black">{selectedTransaction.dueDate ? new Date(selectedTransaction.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference
                  </label>
                  <p className="text-black">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <p className="text-black">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Account
                  </label>
                  <p className="text-black">{selectedTransaction.fromAccount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Account
                  </label>
                  <p className="text-black">{selectedTransaction.toAccount}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-black">{selectedTransaction.description}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <p className="text-black">{selectedTransaction.notes}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created By
                  </label>
                  <p className="text-black">{selectedTransaction.createdBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-black">{new Date(selectedTransaction.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachments
                  </label>
                  <p className="text-black">{selectedTransaction.attachments || 0} files</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewTransaction(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RacingPaymentsDashboard;
