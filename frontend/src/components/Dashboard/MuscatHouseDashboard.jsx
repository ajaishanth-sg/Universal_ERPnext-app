import React, { useState } from 'react';
import {
  Home,
  Wrench,
  ShoppingCart,
  Users,
  ChefHat,
  Car,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  ClipboardList,
  Settings,
  BarChart3,
  ShoppingBag,
  UserCheck,
  Bell,
  AlertTriangle,
  ChevronDown,
  X,
  Save
} from 'lucide-react';

const MuscatHouseDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewExpenditure, setShowNewExpenditure] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showStaffReview, setShowStaffReview] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  // Dashboard data states
  const [dailyTasks, setDailyTasks] = useState([
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
  ]);

  const [expenditures, setExpenditures] = useState([
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
  ]);

  const [staffSupervision, setStaffSupervision] = useState([
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
  ]);

  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    priority: 'Medium',
    dueTime: '',
    category: 'General'
  });

  const [newExpenditure, setNewExpenditure] = useState({
    category: '',
    amount: '',
    description: '',
    urgency: 'Normal',
    preAuthorized: false
  });

  const [staffReview, setStaffReview] = useState({
    staffId: '',
    performance: 'Good',
    notes: '',
    reviewDate: new Date().toISOString().split('T')[0]
  });

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Kitchen Supplies',
    quantity: '',
    unit: 'pieces',
    supplier: '',
    cost: ''
  });

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
        return 'bg-green-100 text-green-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler functions
  const handleNewTask = (e) => {
    e.preventDefault();
    const task = {
      id: dailyTasks.length + 1,
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: 'Pending',
      dueTime: newTask.dueTime,
      category: newTask.category,
      completed: false
    };
    setDailyTasks(prev => [...prev, task]);
    console.log('New task added:', task);
    setShowNewTask(false);
    setNewTask({
      title: '',
      assignedTo: '',
      priority: 'Medium',
      dueTime: '',
      category: 'General'
    });
  };

  const handleNewExpenditure = (e) => {
    e.preventDefault();
    const expenditure = {
      id: expenditures.length + 1,
      category: newExpenditure.category,
      amount: newExpenditure.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Approval',
      description: newExpenditure.description,
      approvedBy: null,
      urgency: newExpenditure.urgency,
      preAuthorized: newExpenditure.preAuthorized,
      limit: newExpenditure.preAuthorized ? '$1,000' : '$0'
    };
    setExpenditures(prev => [...prev, expenditure]);
    console.log('New expenditure added:', expenditure);
    setShowNewExpenditure(false);
    setNewExpenditure({
      category: '',
      amount: '',
      description: '',
      urgency: 'Normal',
      preAuthorized: false
    });
  };

  const handleStaffReview = (e) => {
    e.preventDefault();
    const updatedStaff = staffSupervision.map(staff => {
      if (staff.id === parseInt(staffReview.staffId)) {
        return {
          ...staff,
          performance: staffReview.performance,
          lastReview: staffReview.reviewDate
        };
      }
      return staff;
    });
    setStaffSupervision(updatedStaff);
    console.log('Staff review submitted:', staffReview);
    setShowStaffReview(false);
    setStaffReview({
      staffId: '',
      performance: 'Good',
      notes: '',
      reviewDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    console.log('New item added:', newItem);
    setShowAddItem(false);
    setNewItem({
      name: '',
      category: 'Kitchen Supplies',
      quantity: '',
      unit: 'pieces',
      supplier: '',
      cost: ''
    });
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Daily Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Today's Tasks</p>
                  <p className="text-2xl font-bold text-slate-800">4</p>
                  <p className="text-sm text-green-600">2 completed</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Staff Present</p>
                  <p className="text-2xl font-bold text-slate-800">5/5</p>
                  <p className="text-sm text-green-600">All on duty</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Budget</p>
                  <p className="text-2xl font-bold text-slate-800">$3,620</p>
                  <p className="text-sm text-blue-600">$1,380 remaining</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-800">1</p>
                  <p className="text-sm text-orange-600">HVAC Repair</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowNewTask(true)}
                className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center"
              >
                <ClipboardList className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">New Task</p>
              </button>
              <button
                onClick={() => setShowNewExpenditure(true)}
                className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center"
              >
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">New Expense</p>
              </button>
              <button
                onClick={() => setShowStaffReview(true)}
                className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center"
              >
                <UserCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">Staff Review</p>
              </button>
              <button className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">Notifications</p>
              </button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {dailyTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-600">Assigned to: {task.assignedTo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">{task.dueTime}</p>
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

      {/* Daily Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Daily Task Management</h2>
            <button
              onClick={() => setShowNewTask(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <button className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
                  }`}>
                    {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">{task.title}</h3>
                    <p className="text-xs text-slate-600">Assigned to: {task.assignedTo}</p>
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
                  <span className="text-sm text-slate-600">{task.dueTime}</span>
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
      )}

      {/* Expenditures Tab */}
      {activeTab === 'expenditures' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Expenditure Management</h2>
            <button
              onClick={() => setShowNewExpenditure(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Expenditure</span>
            </button>
          </div>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Limit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Pre-authorized</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Approved By</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((exp) => (
                  <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-800">{exp.category}</td>
                    <td className="py-3 px-4 text-sm text-slate-800 font-medium">{exp.amount}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{exp.limit}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        exp.preAuthorized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {exp.preAuthorized ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exp.status)}`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{exp.approvedBy || 'Pending'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-slate-600 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-600 hover:text-green-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        {exp.requiresApproval && (
                          <button className="p-1 text-slate-600 hover:text-orange-600">
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-slate-600 hover:text-red-600">
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
      )}

      {/* Staff Supervision Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Staff Supervision</h2>
            <button
              onClick={() => setShowStaffReview(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Performance Review</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffSupervision.map((staff) => (
              <div key={staff.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-800">{staff.name}</h3>
                    <p className="text-xs text-slate-500">{staff.role}</p>
                    <p className="text-xs text-slate-500">{staff.department}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Performance:</span>
                    <span className={`font-medium ${
                      staff.performance === 'Excellent' ? 'text-green-600' :
                      staff.performance === 'Very Good' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>{staff.performance}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Experience:</span>
                    <span className="text-slate-800 font-medium">{staff.experience}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Salary:</span>
                    <span className="text-slate-800 font-medium">{staff.salary}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Shift:</span>
                    <span className="text-slate-800 font-medium">{staff.shift}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Contact:</span>
                    <span className="text-slate-800 font-medium">{staff.contact}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-700 mb-2">Key Responsibilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {staff.tasks.map((task, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
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
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Inventory Management</h2>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">Kitchen Supplies</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Well Stocked</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Rice (25kg bags):</span>
                  <span className="font-medium">3 bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cooking Oil:</span>
                  <span className="font-medium">8 liters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Spices:</span>
                  <span className="font-medium">15 varieties</span>
                </div>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">Cleaning Supplies</h3>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Low Stock</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Detergent:</span>
                  <span className="font-medium text-red-600">1 bottle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Disinfectant:</span>
                  <span className="font-medium">4 bottles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Toilet Paper:</span>
                  <span className="font-medium">12 rolls</span>
                </div>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">Maintenance Items</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Reorder Soon</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Light Bulbs:</span>
                  <span className="font-medium">8 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Air Filters:</span>
                  <span className="font-medium">2 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paint:</span>
                  <span className="font-medium">3 gallons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Maintenance Requests</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">HVAC System Repair</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  High Priority
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
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
              <p className="text-xs text-slate-600 mt-2">Air conditioning unit in living room not cooling properly. Needs immediate attention.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">Garden Maintenance</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Medium Priority
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
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
              <p className="text-xs text-slate-600 mt-2">Regular garden maintenance including lawn mowing and plant trimming.</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">Pool Cleaning</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Low Priority
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
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
              <p className="text-xs text-slate-600 mt-2">Weekly pool cleaning and chemical balancing completed successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Operations Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-sm font-medium text-slate-800 mb-3">Monthly Expenditure Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Groceries:</span>
                  <span className="font-medium">$850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fuel:</span>
                  <span className="font-medium">$320</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Maintenance:</span>
                  <span className="font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Utilities:</span>
                  <span className="font-medium">$450</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>$4,120</span>
                </div>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-sm font-medium text-slate-800 mb-3">Staff Performance Overview</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Excellent:</span>
                  <span className="font-medium text-green-600">2 staff</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Very Good:</span>
                  <span className="font-medium text-blue-600">1 staff</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Good:</span>
                  <span className="font-medium text-yellow-600">2 staff</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Staff:</span>
                  <span>5</span>
                </div>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-sm font-medium text-slate-800 mb-3">Task Completion Rate</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">This Week:</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">This Month:</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending Tasks:</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-sm font-medium text-slate-800 mb-3">Maintenance Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium text-green-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">In Progress:</span>
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending:</span>
                  <span className="font-medium text-red-600">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add New Task</h3>
              <button
                onClick={() => setShowNewTask(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Staff Member</option>
                    <option value="Maria Rodriguez">Maria Rodriguez</option>
                    <option value="Ahmed Al-Mansouri">Ahmed Al-Mansouri</option>
                    <option value="Fatima Al-Zahra">Fatima Al-Zahra</option>
                    <option value="Omar Al-Rashid">Omar Al-Rashid</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="General">General</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Supplies">Supplies</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTask(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Expenditure Modal */}
      {showNewExpenditure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add New Expenditure</h3>
              <button
                onClick={() => setShowNewExpenditure(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewExpenditure}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExpenditure.category}
                    onChange={(e) => setNewExpenditure({...newExpenditure, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={newExpenditure.amount}
                    onChange={(e) => setNewExpenditure({...newExpenditure, amount: e.target.value})}
                    placeholder="$0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newExpenditure.description}
                    onChange={(e) => setNewExpenditure({...newExpenditure, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Urgency
                  </label>
                  <select
                    value={newExpenditure.urgency}
                    onChange={(e) => setNewExpenditure({...newExpenditure, urgency: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preAuthorized"
                    checked={newExpenditure.preAuthorized}
                    onChange={(e) => setNewExpenditure({...newExpenditure, preAuthorized: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="preAuthorized" className="text-sm text-slate-700">
                    Pre-authorized expenditure
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewExpenditure(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add Expenditure</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Review Modal */}
      {showStaffReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Staff Performance Review</h3>
              <button
                onClick={() => setShowStaffReview(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleStaffReview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Staff Member
                  </label>
                  <select
                    value={staffReview.staffId}
                    onChange={(e) => setStaffReview({...staffReview, staffId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Staff Member</option>
                    {staffSupervision.map((staff) => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Performance Rating
                  </label>
                  <select
                    value={staffReview.performance}
                    onChange={(e) => setStaffReview({...staffReview, performance: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={staffReview.reviewDate}
                    onChange={(e) => setStaffReview({...staffReview, reviewDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={staffReview.notes}
                    onChange={(e) => setStaffReview({...staffReview, notes: e.target.value})}
                    rows={4}
                    placeholder="Enter performance review notes..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStaffReview(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add New Item</h3>
              <button
                onClick={() => setShowAddItem(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Kitchen Supplies">Kitchen Supplies</option>
                    <option value="Cleaning Supplies">Cleaning Supplies</option>
                    <option value="Maintenance Items">Maintenance Items</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      placeholder="pieces"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                    placeholder="$0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MuscatHouseDashboard;
