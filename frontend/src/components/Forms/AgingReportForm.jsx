import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AgingReportForm = ({ onBack }) => {
  const [filters, setFilters] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    company: 'cube',
    ageInterval: '30, 60, 90, 120',
    customerGroup: '',
    customer: '',
    basedOn: 'Due Date'
  });

  const [agingData, setAgingData] = useState([]);
  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    current: 0,
    overdue1_30: 0,
    overdue31_60: 0,
    overdue61_90: 0,
    overdue91_120: 0,
    overdue120_plus: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [filters]);

  const generateReport = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockData = [
        {
          customer: 'ABC Corp',
          invoice: 'INV-2024-001',
          dueDate: '2024-09-15',
          amount: 150000,
          outstanding: 100000,
          age: 18,
          status: 'current'
        },
        {
          customer: 'XYZ Ltd',
          invoice: 'INV-2024-002',
          dueDate: '2024-08-30',
          amount: 200000,
          outstanding: 200000,
          age: 35,
          status: 'overdue'
        },
        {
          customer: 'Tech Solutions',
          invoice: 'INV-2024-003',
          dueDate: '2024-07-15',
          amount: 75000,
          outstanding: 75000,
          age: 80,
          status: 'overdue'
        },
        {
          customer: 'Global Traders',
          invoice: 'INV-2024-004',
          dueDate: '2024-06-01',
          amount: 125000,
          outstanding: 125000,
          age: 125,
          status: 'overdue'
        }
      ];

      setAgingData(mockData);

      // Calculate summary
      const newSummary = mockData.reduce((acc, item) => {
        acc.totalOutstanding += item.outstanding;
        if (item.age <= 0) acc.current += item.outstanding;
        else if (item.age <= 30) acc.overdue1_30 += item.outstanding;
        else if (item.age <= 60) acc.overdue31_60 += item.outstanding;
        else if (item.age <= 90) acc.overdue61_90 += item.outstanding;
        else if (item.age <= 120) acc.overdue91_120 += item.outstanding;
        else acc.overdue120_plus += item.outstanding;
        return acc;
      }, {
        totalOutstanding: 0,
        current: 0,
        overdue1_30: 0,
        overdue31_60: 0,
        overdue61_90: 0,
        overdue91_120: 0,
        overdue120_plus: 0
      });

      setSummary(newSummary);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAgeBucket = (age) => {
    if (age <= 0) return 'Current';
    if (age <= 30) return '1-30 days';
    if (age <= 60) return '31-60 days';
    if (age <= 90) return '61-90 days';
    if (age <= 120) return '91-120 days';
    return '120+ days';
  };

  const getStatusColor = (age) => {
    if (age <= 0) return 'text-green-600 bg-green-100';
    if (age <= 30) return 'text-yellow-600 bg-yellow-100';
    if (age <= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const exportReport = () => {
    // Mock export functionality
    alert('Report exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Receivables</span>
                <span className="text-gray-400"></span>
                <span className="text-gray-900">Aging Report</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={exportReport}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">Accounts Receivable Aging Report</h1>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Date
                </label>
                <input
                  type="date"
                  value={filters.reportDate}
                  onChange={(e) => handleFilterChange('reportDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Interval (days)
                </label>
                <input
                  type="text"
                  value={filters.ageInterval}
                  onChange={(e) => handleFilterChange('ageInterval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30, 60, 90, 120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Based On
                </label>
                <select
                  value={filters.basedOn}
                  onChange={(e) => handleFilterChange('basedOn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Due Date">Due Date</option>
                  <option value="Posting Date">Posting Date</option>
                  <option value="Invoice Date">Invoice Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Outstanding</p>
                    <p className="text-lg font-bold text-gray-900">₹{summary.totalOutstanding.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Current</p>
                    <p className="text-lg font-bold text-green-900">₹{summary.current.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">1-30 days</p>
                    <p className="text-lg font-bold text-yellow-900">₹{summary.overdue1_30.toLocaleString()}</p>
                  </div>
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">31-60 days</p>
                    <p className="text-lg font-bold text-orange-900">₹{summary.overdue31_60.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">61-90 days</p>
                    <p className="text-lg font-bold text-red-900">₹{summary.overdue61_90.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>

              <div className="bg-red-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">91-120 days</p>
                    <p className="text-lg font-bold text-red-900">₹{summary.overdue91_120.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
              </div>

              <div className="bg-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-800">120+ days</p>
                    <p className="text-lg font-bold text-red-900">₹{summary.overdue120_plus.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Aging Table */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Aging Report</h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Generating aging report...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outstanding
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age (Days)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aging Bucket
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agingData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                          {item.invoice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ₹{item.outstanding.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.age <= 0 ? 'bg-green-100 text-green-800' :
                            item.age <= 30 ? 'bg-yellow-100 text-yellow-800' :
                            item.age <= 60 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.age}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.age)}`}>
                            {getAgeBucket(item.age)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                        ₹{summary.totalOutstanding.toLocaleString()}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgingReportForm;