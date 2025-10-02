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
  Users,
  DollarSign,
  Building2,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase
} from 'lucide-react';

const AbroadHouseManagerForm = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('hr');
  const [showNewEmployee, setShowNewEmployee] = useState(false);

  const abroadStaff = [
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
  ];

  const spvExpenditures = [
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
  ];

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
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending SPV Approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Paid via SPV':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
            <h1 className="text-lg font-semibold text-gray-900">Abroad House Manager</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewEmployee(true)}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Employee</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Request Funds</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>SPV Report</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Managed Locations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">London:</span>
                  <span className="font-medium">2 staff</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monaco:</span>
                  <span className="font-medium">2 staff</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Abroad:</span>
                  <span className="font-medium">4 staff</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">SPV Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active SPVs:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Budget:</span>
                  <span className="font-medium">$28,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Approvals:</span>
                  <span className="font-medium text-orange-600">1</span>
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
          {activeTab === 'hr' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">HR Management</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Employee</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract End</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {abroadStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                              <div className="text-sm text-gray-500">{staff.spv}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {staff.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {staff.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {staff.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {staff.salary}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getPerformanceColor(staff.performance)}`}>
                              {staff.performance}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {staff.contractEnd}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
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

          {activeTab === 'spv' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">SPV Companies</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New SPV</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {spvCompanies.map((spv) => (
                    <div key={spv.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">{spv.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(spv.status)}`}>
                          {spv.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{spv.type}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{spv.location}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Assets:</span>
                          <span className="font-medium">{spv.totalAssets}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Properties:</span>
                          <span className="font-medium">{spv.managedProperties.length}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Last Transaction:</span>
                          <span className="font-medium">{spv.lastTransaction}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Managed Properties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {spv.managedProperties.map((property, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
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

          {activeTab === 'expenditures' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">SPV Expenditures</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Request Funds</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPV</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {spvExpenditures.map((exp) => (
                        <tr key={exp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {exp.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exp.property}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {exp.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.spv}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.frequency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exp.status)}`}>
                              {exp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {exp.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
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
        </div>
      </div>
    </div>
  );
};

export default AbroadHouseManagerForm;