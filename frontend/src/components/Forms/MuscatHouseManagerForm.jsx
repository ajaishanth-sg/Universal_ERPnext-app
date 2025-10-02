import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Filter,
  X,
  Search,
  ChevronDown,
  FileText,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  ClipboardList,
  Settings,
  BarChart3,
  Home,
  ChefHat,
  Car,
  Wrench,
  ShoppingBag,
  UserCheck,
  Bell,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

const MuscatHouseManagerForm = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewExpenditure, setShowNewExpenditure] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showStaffReview, setShowStaffReview] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Daily Tasks
  const dailyTasks = [
    {
      id: 1,
      title: "Kitchen Deep Cleaning",
      assignedTo: "Maria Rodriguez",
      priority: "High",
      status: "In Progress",
      dueTime: "10:00 AM",
      category: "Cleaning",
      completed: false
    },
    {
      id: 2,
      title: "Grocery Shopping",
      assignedTo: "Ahmed Al-Mansouri",
      priority: "Medium",
      status: "Pending",
      dueTime: "11:00 AM",
      category: "Supplies",
      completed: false
    },
    {
      id: 3,
      title: "Vehicle Maintenance Check",
      assignedTo: "Driver Team",
      priority: "Low",
      status: "Scheduled",
      dueTime: "2:00 PM",
      category: "Maintenance",
      completed: false
    },
    {
      id: 4,
      title: "Staff Performance Review",
      assignedTo: "House Manager",
      priority: "High",
      status: "Due Today",
      dueTime: "4:00 PM",
      category: "HR",
      completed: false
    }
  ];

  const expenditures = [
    {
      id: 1,
      category: "Groceries",
      amount: "$850",
      date: "2024-01-15",
      status: "Approved",
      description: "Monthly grocery shopping",
      approvedBy: "HOO",
      urgency: "Normal",
      preAuthorized: true,
      limit: "$1,000"
    },
    {
      id: 2,
      category: "Fuel",
      amount: "$320",
      date: "2024-01-14",
      status: "Approved",
      description: "Vehicle fuel for the month",
      approvedBy: "HOO",
      urgency: "Normal",
      preAuthorized: true,
      limit: "$500"
    },
    {
      id: 3,
      category: "Maintenance",
      amount: "$2,500",
      date: "2024-01-13",
      status: "Pending Approval",
      description: "HVAC system repair",
      approvedBy: null,
      urgency: "High",
      preAuthorized: false,
      limit: "$2,000",
      requiresApproval: true
    },
    {
      id: 4,
      category: "Utilities",
      amount: "$450",
      date: "2024-01-12",
      status: "Approved",
      description: "Monthly electricity bill",
      approvedBy: "HOO",
      urgency: "Normal",
      preAuthorized: true,
      limit: "$600"
    }
  ];

  const staffSupervision = [
    {
      id: 1,
      name: "Maria Rodriguez",
      role: "Chef",
      department: "Kitchen",
      location: "Muscat",
      performance: "Excellent",
      lastReview: "2024-01-10",
      status: "Active",
      tasks: ["Menu Planning", "Staff Training", "Quality Control", "Inventory Management"],
      salary: "$4,500",
      experience: "8 years",
      contact: "+968-123-4567",
      shift: "6:00 AM - 2:00 PM"
    },
    {
      id: 2,
      name: "Ahmed Al-Mansouri",
      role: "House Manager",
      department: "Management",
      location: "Muscat",
      performance: "Good",
      lastReview: "2024-01-08",
      status: "Active",
      tasks: ["Staff Coordination", "Budget Management", "Property Maintenance", "Security"],
      salary: "$6,000",
      experience: "5 years",
      contact: "+968-123-4568",
      shift: "8:00 AM - 6:00 PM"
    },
    {
      id: 3,
      name: "Fatima Al-Zahra",
      role: "Housekeeper",
      department: "Housekeeping",
      location: "Muscat",
      performance: "Very Good",
      lastReview: "2024-01-09",
      status: "Active",
      tasks: ["Room Cleaning", "Laundry", "Organization", "Guest Services"],
      salary: "$2,800",
      experience: "3 years",
      contact: "+968-123-4569",
      shift: "7:00 AM - 3:00 PM"
    },
    {
      id: 4,
      name: "Omar Al-Rashid",
      role: "Driver",
      department: "Transportation",
      location: "Muscat",
      performance: "Excellent",
      lastReview: "2024-01-11",
      status: "Active",
      tasks: ["Vehicle Maintenance", "Transportation", "Security", "Errands"],
      salary: "$3,200",
      experience: "6 years",
      contact: "+968-123-4570",
      shift: "24/7 On Call"
    },
    {
      id: 5,
      name: "Sarah Johnson",
      role: "Gardener",
      department: "Maintenance",
      location: "Muscat",
      performance: "Good",
      lastReview: "2024-01-07",
      status: "Active",
      tasks: ["Garden Maintenance", "Landscaping", "Pool Care", "Outdoor Cleaning"],
      salary: "$2,500",
      experience: "4 years",
      contact: "+968-123-4571",
      shift: "6:00 AM - 2:00 PM"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'tasks', label: 'Daily Tasks', icon: ClipboardList },
    { id: 'expenditures', label: 'Expenditures', icon: DollarSign },
    { id: 'staff', label: 'Staff Supervision', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Muscat House Manager</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewExpenditure(true)}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Expenditure</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Staff Review</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pre-authorized Limits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Groceries:</span>
                  <span className="font-medium text-green-600">$1,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel:</span>
                  <span className="font-medium text-green-600">$500/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance:</span>
                  <span className="font-medium text-yellow-600">$2,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilities:</span>
                  <span className="font-medium text-green-600">$600/month</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Used this month:</span>
                    <span className="font-medium text-blue-600">$3,620</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Remaining:</span>
                    <span className="font-medium text-green-600">$1,380</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Daily Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">4</p>
                      <p className="text-sm text-green-600">2 completed</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Staff Present</p>
                      <p className="text-2xl font-bold text-gray-900">5/5</p>
                      <p className="text-sm text-green-600">All on duty</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
                      <p className="text-2xl font-bold text-gray-900">$3,620</p>
                      <p className="text-sm text-blue-600">$1,380 remaining</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                      <p className="text-sm text-orange-600">HVAC Repair</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setShowNewTask(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2"
                  >
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">New Task</span>
                  </button>
                  <button
                    onClick={() => setShowNewExpenditure(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2"
                  >
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium">New Expense</span>
                  </button>
                  <button
                    onClick={() => setShowStaffReview(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2"
                  >
                    <UserCheck className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Staff Review</span>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2">
                    <Bell className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-medium">Notifications</span>
                  </button>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  {dailyTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-600">Assigned to: {task.assignedTo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{task.dueTime}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Daily Task Management</h2>
                    <button
                      onClick={() => setShowNewTask(true)}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {dailyTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <button className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`}>
                            {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </button>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                            <p className="text-xs text-gray-600">Assigned to: {task.assignedTo}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-sm text-gray-600">{task.dueTime}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenditures' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Expenditure Management</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                      <button
                        onClick={() => setShowNewExpenditure(true)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Expenditure</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Pre-authorized Limits Summary */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-900 mb-3">Pre-authorized Expenditure Limits</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Groceries:</span>
                        <span className="font-medium text-blue-900">$1,000/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Fuel:</span>
                        <span className="font-medium text-blue-900">$500/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Maintenance:</span>
                        <span className="font-medium text-blue-900">$2,000/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Utilities:</span>
                        <span className="font-medium text-blue-900">$600/month</span>
                      </div>
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pre-authorized</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenditures.map((exp) => (
                        <tr key={exp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {exp.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exp.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.limit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              exp.preAuthorized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {exp.preAuthorized ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exp.status)}`}>
                              {exp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.approvedBy || 'Pending'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              {exp.requiresApproval && (
                                <button className="p-1 text-gray-600 hover:text-orange-600">
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-1 text-gray-600 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Staff Supervision</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowStaffReview(true)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Performance Review</span>
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add Staff</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffSupervision.map((staff) => (
                      <div key={staff.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{staff.name}</h3>
                            <p className="text-xs text-gray-600">{staff.role}</p>
                            <p className="text-xs text-gray-500">{staff.department}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                            {staff.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Performance:</span>
                            <span className={`font-medium ${
                              staff.performance === 'Excellent' ? 'text-green-600' :
                              staff.performance === 'Very Good' ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>{staff.performance}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{staff.experience}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Salary:</span>
                            <span className="font-medium">{staff.salary}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Shift:</span>
                            <span className="font-medium">{staff.shift}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-medium">{staff.contact}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Key Responsibilities:</h4>
                          <div className="flex flex-wrap gap-1">
                            {staff.tasks.map((task, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                {task}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <button className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            <button className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center justify-center space-x-1">
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button className="flex-1 px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded hover:bg-purple-100 flex items-center justify-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Schedule</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Kitchen Supplies</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Well Stocked</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rice (25kg bags):</span>
                          <span className="font-medium">3 bags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cooking Oil:</span>
                          <span className="font-medium">8 liters</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Spices:</span>
                          <span className="font-medium">15 varieties</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Cleaning Supplies</h3>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Low Stock</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Detergent:</span>
                          <span className="font-medium text-red-600">1 bottle</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Disinfectant:</span>
                          <span className="font-medium">4 bottles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toilet Paper:</span>
                          <span className="font-medium">12 rolls</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Maintenance Items</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Reorder Soon</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Light Bulbs:</span>
                          <span className="font-medium">8 units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Air Filters:</span>
                          <span className="font-medium">2 units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paint:</span>
                          <span className="font-medium">3 gallons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New Request</span>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">HVAC System Repair</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High Priority
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Location:</span> Main Villa - Ground Floor
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> Ahmed Al-Mansouri
                        </div>
                        <div>
                          <span className="font-medium">Cost Estimate:</span> $2,500
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> Pending HOO Approval
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Air conditioning unit in living room not cooling properly. Needs immediate attention.</p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Garden Maintenance</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Medium Priority
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Location:</span> Back Garden
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> Sarah Johnson
                        </div>
                        <div>
                          <span className="font-medium">Cost Estimate:</span> $150
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> Approved - Scheduled
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Regular garden maintenance including lawn mowing and plant trimming.</p>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Pool Cleaning</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Low Priority
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Location:</span> Swimming Pool Area
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> Fatima Al-Zahra
                        </div>
                        <div>
                          <span className="font-medium">Cost Estimate:</span> $75
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> Completed
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Weekly pool cleaning and chemical balancing completed successfully.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Operations Reports</h2>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Monthly Expenditure Summary</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Groceries:</span>
                          <span className="font-medium">$850</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel:</span>
                          <span className="font-medium">$320</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maintenance:</span>
                          <span className="font-medium">$2,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilities:</span>
                          <span className="font-medium">$450</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total:</span>
                          <span>$4,120</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Staff Performance Overview</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Excellent:</span>
                          <span className="font-medium text-green-600">2 staff</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Very Good:</span>
                          <span className="font-medium text-blue-600">1 staff</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Good:</span>
                          <span className="font-medium text-yellow-600">2 staff</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total Staff:</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Task Completion Rate</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">This Week:</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">This Month:</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending Tasks:</span>
                          <span className="font-medium text-orange-600">3</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Maintenance Status</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium text-green-600">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">In Progress:</span>
                          <span className="font-medium text-blue-600">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-medium text-red-600">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuscatHouseManagerForm;