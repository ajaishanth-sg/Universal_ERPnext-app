import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Settings,
  Calculator,
  FileText,
  TrendingUp
} from 'lucide-react';

const PayrollManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [payrollPeriods, setPayrollPeriods] = useState([]);
  const [journalBatches, setJournalBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const [employeesResponse, periodsResponse, batchesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/payroll/employees'),
        axios.get('http://localhost:5000/api/payroll/periods'),
        axios.get('http://localhost:5000/api/payroll/journal-batches')
      ]);

      setEmployees(employeesResponse.data || []);
      setPayrollPeriods(periodsResponse.data || []);
      setJournalBatches(batchesResponse.data || []);
    } catch (err) {
      console.error('Error fetching payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processPayrollJournal = async (periodId) => {
    try {
      await axios.post(`http://localhost:5000/api/payroll/process-journal/${periodId}`, {}, {
        params: { processed_by: 'current_user' }
      });
      // Refresh data after processing
      await fetchPayrollData();
    } catch (err) {
      console.error('Error processing payroll journal:', err);
    }
  };

  const payrollStats = [
    {
      title: "Total Employees",
      value: employees.length.toString(),
      change: "+2",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Monthly Payroll",
      value: "$45,000",
      change: "+8.2%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Pending Approvals",
      value: "3",
      change: "-2",
      icon: Clock,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "This Month's Total",
      value: "$127,500",
      change: "+12.5%",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const recentEmployees = [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      position: "Fleet Manager",
      department: "Operations",
      salary: "$5,500",
      status: "Active",
      joinDate: "2023-06-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Accountant",
      department: "Finance",
      salary: "$4,200",
      status: "Active",
      joinDate: "2023-08-20"
    },
    {
      id: 3,
      name: "Mohammed Hassan",
      position: "Driver",
      department: "Operations",
      salary: "$3,800",
      status: "Active",
      joinDate: "2023-09-10"
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "HR Manager",
      department: "Human Resources",
      salary: "$5,000",
      status: "Active",
      joinDate: "2023-07-05"
    }
  ];

  const recentPayrollPeriods = [
    {
      id: 1,
      name: "January 2024",
      status: "Closed",
      payDate: "2024-01-31",
      totalEmployees: 12,
      totalGross: 48500,
      totalNet: 41250
    },
    {
      id: 2,
      name: "December 2023",
      status: "Posted",
      payDate: "2023-12-31",
      totalEmployees: 10,
      totalGross: 45200,
      totalNet: 38400
    },
    {
      id: 3,
      name: "November 2023",
      status: "Posted",
      payDate: "2023-11-30",
      totalEmployees: 10,
      totalGross: 44800,
      totalNet: 38100
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'employees', label: 'Employees' },
    { id: 'periods', label: 'Payroll Periods' },
    { id: 'journals', label: 'Journal Entries' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Automated payroll processing and journal posting</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Employees
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentEmployees.map((employee) => (
              <div key={employee.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {employee.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{employee.position}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{employee.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Settings className="w-3 h-3" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {employee.joinDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Periods */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Payroll Periods
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage
            </button>
          </div>
          <div className="space-y-4">
            {recentPayrollPeriods.map((period) => (
              <div key={period.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {period.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    period.status === 'Closed' ? 'bg-green-100 text-green-800' :
                    period.status === 'Posted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {period.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{period.totalEmployees} employees</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Pay Date: {period.payDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Gross: ${period.totalGross.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Net: ${period.totalNet.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      View Details
                    </button>
                    {period.status === 'Closed' && (
                      <button
                        onClick={() => processPayrollJournal(period.id)}
                        className="text-green-600 hover:text-green-700 text-xs font-medium"
                      >
                        Post to Journal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Batches */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Journal Batches
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {journalBatches.slice(0, 3).map((batch) => (
            <div key={batch.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-800">
                  {batch.batchNumber}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  batch.status === 'Posted' ? 'bg-green-100 text-green-800' :
                  batch.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {batch.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{batch.description}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">${batch.totalAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{batch.totalEntries} entries</span>
                </div>
                {batch.postedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Posted: {new Date(batch.postedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Employee Management</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEmployees.map((employee) => (
              <div key={employee.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    {employee.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>{employee.position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-3 h-3" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3 h-3" />
                    <span>Salary: {employee.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>Joined: {employee.joinDate}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Edit
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                      View Payroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Periods Tab */}
      {activeTab === 'periods' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Payroll Periods</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Period</span>
            </button>
          </div>

          <div className="space-y-4">
            {recentPayrollPeriods.map((period) => (
              <div key={period.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    {period.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      period.status === 'Closed' ? 'bg-green-100 text-green-800' :
                      period.status === 'Posted' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {period.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600"><strong>Pay Date:</strong> {period.payDate}</p>
                    <p className="text-gray-600"><strong>Employees:</strong> {period.totalEmployees}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Gross Pay:</strong> ${period.totalGross.toLocaleString()}</p>
                    <p className="text-gray-600"><strong>Net Pay:</strong> ${period.totalNet.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Total Deductions:</strong> ${(period.totalGross - period.totalNet).toLocaleString()}</p>
                    <p className="text-gray-600"><strong>Avg per Employee:</strong> ${Math.round(period.totalNet / period.totalEmployees).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                        Generate Report
                      </button>
                      {period.status === 'Closed' && (
                        <button
                          onClick={() => processPayrollJournal(period.id)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                        >
                          Post Journal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Entries Tab */}
      {activeTab === 'journals' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Journal Entries</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Create Entry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {journalBatches.map((batch) => (
              <div key={batch.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    {batch.batchNumber}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    batch.status === 'Posted' ? 'bg-green-100 text-green-800' :
                    batch.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{batch.description}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">${batch.totalAmount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{batch.totalEntries} entries</span>
                  </div>
                  {batch.postedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Posted: {new Date(batch.postedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="w-full text-blue-600 hover:text-blue-700 text-xs font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Payroll Reports</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
              <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-800 mb-2">Payroll Summary</h3>
              <p className="text-xs text-gray-500 mb-3">Monthly payroll overview</p>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                Generate Report
              </button>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-800 mb-2">Tax Reports</h3>
              <p className="text-xs text-gray-500 mb-3">Tax withholding summaries</p>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                Generate Report
              </button>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-800 mb-2">Department Analysis</h3>
              <p className="text-xs text-gray-500 mb-3">Payroll by department</p>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Add Employee</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Create Period</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Calculator className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Process Payroll</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Generate Reports</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PayrollManagementDashboard;