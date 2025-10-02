import React, { useState } from 'react';
import {
  Users,
  Building2,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  ChevronDown,
  FileText,
  TrendingUp,
  Globe,
  UserCheck,
  X
} from 'lucide-react';

const AbroadHouseDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('hr');
  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [showRequestFunds, setShowRequestFunds] = useState(false);
  const [showSPVReport, setShowSPVReport] = useState(false);

  // Dashboard data states
  const [abroadStaff, setAbroadStaff] = useState([
    {
      id: 1,
      name: "James Wilson",
      role: "House Manager",
      location: "London",
      department: "Operations",
      salary: "$8,500",
      status: "Active",
      contractEnd: "2024-12-31",
      performance: "Excellent",
      lastReview: "2024-01-10",
      spv: "Matrix Holdings Ltd"
    },
    {
      id: 2,
      name: "Sophie Dubois",
      role: "Housekeeper",
      location: "Monaco",
      department: "Housekeeping",
      salary: "$4,200",
      status: "Active",
      contractEnd: "2024-06-30",
      performance: "Good",
      lastReview: "2024-01-08",
      spv: "Racing Ventures LLC"
    },
    {
      id: 3,
      name: "Marco Rossi",
      role: "Chef",
      location: "Monaco",
      department: "Culinary",
      salary: "$6,800",
      status: "Active",
      contractEnd: "2024-08-15",
      performance: "Excellent",
      lastReview: "2024-01-05",
      spv: "Racing Ventures LLC"
    },
    {
      id: 4,
      name: "Emma Thompson",
      role: "Property Coordinator",
      location: "London",
      department: "Administration",
      salary: "$5,500",
      status: "Active",
      contractEnd: "2024-10-20",
      performance: "Good",
      lastReview: "2024-01-03",
      spv: "Matrix Holdings Ltd"
    }
  ]);

  const [spvExpenditures, setSpvExpenditures] = useState([
    {
      id: 1,
      category: "Property Tax",
      amount: "$12,000",
      date: "2024-01-15",
      status: "Paid via SPV",
      description: "Annual property tax London apartment",
      spv: "Matrix Holdings Ltd",
      property: "London Apartment",
      frequency: "Annual"
    },
    {
      id: 2,
      category: "Utilities",
      amount: "$3,200",
      date: "2024-01-14",
      status: "Paid via SPV",
      description: "Monthly utilities Monaco penthouse",
      spv: "Racing Ventures LLC",
      property: "Monaco Penthouse",
      frequency: "Monthly"
    },
    {
      id: 3,
      category: "Maintenance",
      amount: "$8,500",
      date: "2024-01-13",
      status: "Pending SPV Approval",
      description: "Kitchen renovation London",
      spv: "Matrix Holdings Ltd",
      property: "London Apartment",
      frequency: "One-time"
    },
    {
      id: 4,
      category: "Insurance",
      amount: "$4,200",
      date: "2024-01-12",
      status: "Paid via SPV",
      description: "Property insurance Monaco",
      spv: "Racing Ventures LLC",
      property: "Monaco Penthouse",
      frequency: "Annual"
    }
  ]);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    location: '',
    department: '',
    salary: '',
    contractEnd: '',
    spv: ''
  });

  const [fundRequest, setFundRequest] = useState({
    category: '',
    amount: '',
    property: '',
    spv: '',
    description: '',
    frequency: 'One-time'
  });

  const [spvReport, setSpvReport] = useState({
    spv: '',
    period: 'Monthly',
    reportType: 'Financial'
  });

  // Handler functions
  const handleNewEmployee = (e) => {
    e.preventDefault();
    const employee = {
      id: abroadStaff.length + 1,
      name: newEmployee.name,
      role: newEmployee.role,
      location: newEmployee.location,
      department: newEmployee.department,
      salary: newEmployee.salary,
      status: 'Active',
      contractEnd: newEmployee.contractEnd,
      performance: 'Good',
      lastReview: new Date().toISOString().split('T')[0],
      spv: newEmployee.spv
    };
    setAbroadStaff(prev => [...prev, employee]);
    console.log('New employee data:', employee);
    alert('Employee added successfully!');
    setShowNewEmployee(false);
    setNewEmployee({
      name: '',
      role: '',
      location: '',
      department: '',
      salary: '',
      contractEnd: '',
      spv: ''
    });
  };

  const handleFundRequest = (e) => {
    e.preventDefault();
    const fundReq = {
      id: spvExpenditures.length + 1,
      category: fundRequest.category,
      amount: fundRequest.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending SPV Approval',
      description: fundRequest.description,
      spv: fundRequest.spv,
      property: fundRequest.property,
      frequency: fundRequest.frequency
    };
    setSpvExpenditures(prev => [...prev, fundReq]);
    console.log('Fund request data:', fundReq);
    alert('Fund request submitted successfully!');
    setShowRequestFunds(false);
    setFundRequest({
      category: '',
      amount: '',
      property: '',
      spv: '',
      description: '',
      frequency: 'One-time'
    });
  };

  const handleSPVReport = (e) => {
    e.preventDefault();
    console.log('SPV report data:', spvReport);
    alert('SPV report generated successfully!');
    setShowSPVReport(false);
    setSpvReport({
      spv: '',
      period: 'Monthly',
      reportType: 'Financial'
    });
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'employee') {
      setNewEmployee(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'fund') {
      setFundRequest(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'report') {
      setSpvReport(prev => ({ ...prev, [name]: value }));
    }
  };

  const spvCompanies = [
    {
      id: 1,
      name: "Matrix Holdings Ltd",
      type: "Investment",
      location: "Cayman Islands",
      status: "Active",
      totalAssets: "$1.2M",
      managedProperties: ["London Apartment"],
      lastTransaction: "2024-01-15"
    },
    {
      id: 2,
      name: "Racing Ventures LLC",
      type: "Sports",
      location: "Monaco",
      status: "Active",
      totalAssets: "$850K",
      managedProperties: ["Monaco Penthouse"],
      lastTransaction: "2024-01-14"
    }
  ];

  const tabs = [
    { id: 'hr', label: 'HR Management', icon: Users },
    { id: 'spv', label: 'SPV Financial', icon: Building2 },
    { id: 'expenditures', label: 'Expenditures', icon: DollarSign }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending SPV Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Paid via SPV':
        return 'bg-blue-100 text-blue-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      case 'Needs Review':
        return 'text-yellow-600';
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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

      {/* HR Management Tab */}
      {activeTab === 'hr' && (
        <div className="space-y-6">
          {/* HR Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Staff</p>
                  <p className="text-2xl font-bold text-slate-800">4</p>
                  <p className="text-sm text-green-600">All active</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Payroll</p>
                  <p className="text-2xl font-bold text-slate-800">$24,900</p>
                  <p className="text-sm text-blue-600">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Contract Renewals</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                  <p className="text-sm text-orange-600">Due this quarter</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Performance Reviews</p>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                  <p className="text-sm text-purple-600">Excellent ratings</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Staff Management */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Staff Management</h2>
              <button
                onClick={() => setShowNewEmployee(true)}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Performance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Contract End</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {abroadStaff.map((staff) => (
                    <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm font-medium text-slate-800">{staff.name}</div>
                          <div className="text-sm text-slate-500">{staff.spv}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-800">{staff.role}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{staff.location}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{staff.department}</td>
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">{staff.salary}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${getPerformanceColor(staff.performance)}`}>
                          {staff.performance}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{staff.contractEnd}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-slate-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
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
        </div>
      )}

      {/* SPV Financial Tab */}
      {activeTab === 'spv' && (
        <div className="space-y-6">
          {/* SPV Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active SPVs</p>
                  <p className="text-2xl font-bold text-slate-800">2</p>
                  <p className="text-sm text-green-600">All operational</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Assets</p>
                  <p className="text-2xl font-bold text-slate-800">$2.05M</p>
                  <p className="text-sm text-blue-600">Managed value</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Budget</p>
                  <p className="text-2xl font-bold text-slate-800">$28,000</p>
                  <p className="text-sm text-purple-600">Allocated</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-800">1</p>
                  <p className="text-sm text-orange-600">Awaiting review</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* SPV Companies */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">SPV Companies</h2>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New SPV</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spvCompanies.map((spv) => (
                <div key={spv.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-800">{spv.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(spv.status)}`}>
                      {spv.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium">{spv.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Location:</span>
                      <span className="font-medium">{spv.location}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Total Assets:</span>
                      <span className="font-medium">{spv.totalAssets}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Properties:</span>
                      <span className="font-medium">{spv.managedProperties.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Last Transaction:</span>
                      <span className="font-medium">{spv.lastTransaction}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 mb-2">Managed Properties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {spv.managedProperties.map((property, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {property}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenditures Tab */}
      {activeTab === 'expenditures' && (
        <div className="space-y-6">
          {/* Expenditure Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Total</p>
                  <p className="text-2xl font-bold text-slate-800">$28,000</p>
                  <p className="text-sm text-blue-600">This month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-800">$8,500</p>
                  <p className="text-sm text-orange-600">Kitchen renovation</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Annual Expenses</p>
                  <p className="text-2xl font-bold text-slate-800">$336,000</p>
                  <p className="text-sm text-green-600">Projected</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* SPV Expenditures */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">SPV Expenditures</h2>
              <button
                onClick={() => setShowRequestFunds(true)}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Request Funds</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Property</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">SPV</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Frequency</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spvExpenditures.map((exp) => (
                    <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">{exp.category}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{exp.property}</td>
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">{exp.amount}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{exp.spv}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{exp.frequency}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exp.status)}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{exp.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-slate-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-600 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
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
        </div>
      )}

      {/* New Employee Modal */}
      {showNewEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Add New Employee</h2>
              <button
                onClick={() => setShowNewEmployee(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={(e) => handleInputChange(e, 'employee')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newEmployee.role}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="House Manager">House Manager</option>
                    <option value="Housekeeper">Housekeeper</option>
                    <option value="Chef">Chef</option>
                    <option value="Property Coordinator">Property Coordinator</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={newEmployee.department}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Culinary">Culinary</option>
                    <option value="Administration">Administration</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={newEmployee.location}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="London">London</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Paris">Paris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SPV Company
                  </label>
                  <select
                    name="spv"
                    value={newEmployee.spv}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select SPV</option>
                    <option value="Matrix Holdings Ltd">Matrix Holdings Ltd</option>
                    <option value="Racing Ventures LLC">Racing Ventures LLC</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={newEmployee.salary}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    placeholder="$5,000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contract End Date
                  </label>
                  <input
                    type="date"
                    name="contractEnd"
                    value={newEmployee.contractEnd}
                    onChange={(e) => handleInputChange(e, 'employee')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewEmployee(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Funds Modal */}
      {showRequestFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Request Funds</h2>
              <button
                onClick={() => setShowRequestFunds(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFundRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={fundRequest.category}
                  onChange={(e) => handleInputChange(e, 'fund')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Property Tax">Property Tax</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Supplies">Supplies</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Property
                  </label>
                  <select
                    name="property"
                    value={fundRequest.property}
                    onChange={(e) => handleInputChange(e, 'fund')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select Property</option>
                    <option value="London Apartment">London Apartment</option>
                    <option value="Monaco Penthouse">Monaco Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SPV Company
                  </label>
                  <select
                    name="spv"
                    value={fundRequest.spv}
                    onChange={(e) => handleInputChange(e, 'fund')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  >
                    <option value="">Select SPV</option>
                    <option value="Matrix Holdings Ltd">Matrix Holdings Ltd</option>
                    <option value="Racing Ventures LLC">Racing Ventures LLC</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={fundRequest.amount}
                    onChange={(e) => handleInputChange(e, 'fund')}
                    placeholder="$5,000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={fundRequest.frequency}
                    onChange={(e) => handleInputChange(e, 'fund')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="One-time">One-time</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={fundRequest.description}
                  onChange={(e) => handleInputChange(e, 'fund')}
                  rows={3}
                  placeholder="Describe the purpose of this fund request..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestFunds(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPV Report Modal */}
      {showSPVReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Generate SPV Report</h2>
              <button
                onClick={() => setShowSPVReport(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSPVReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SPV Company
                </label>
                <select
                  name="spv"
                  value={spvReport.spv}
                  onChange={(e) => handleInputChange(e, 'report')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  required
                >
                  <option value="">Select SPV</option>
                  <option value="Matrix Holdings Ltd">Matrix Holdings Ltd</option>
                  <option value="Racing Ventures LLC">Racing Ventures LLC</option>
                  <option value="All SPVs">All SPVs</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Report Type
                  </label>
                  <select
                    name="reportType"
                    value={spvReport.reportType}
                    onChange={(e) => handleInputChange(e, 'report')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="Financial">Financial</option>
                    <option value="Operational">Operational</option>
                    <option value="Performance">Performance</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period
                  </label>
                  <select
                    name="period"
                    value={spvReport.period}
                    onChange={(e) => handleInputChange(e, 'report')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSPVReport(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbroadHouseDashboard;
