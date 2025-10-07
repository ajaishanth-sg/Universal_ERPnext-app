import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, Clock, AlertCircle, DollarSign, TrendingUp, Plus, Eye } from 'lucide-react';

const AutomatedPayrollJournalDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [summary, setSummary] = useState({});
  const [pendingPeriods, setPendingPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchPayrollJournalData();
  }, []);

  const fetchPayrollJournalData = async () => {
    try {
      setLoading(true);
      const [batchesResponse, summaryResponse, pendingResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/automated-payroll-journal/journal-batches'),
        axios.get('http://localhost:5000/api/automated-payroll-journal/dashboard-summary'),
        axios.get('http://localhost:5000/api/automated-payroll-journal/pending-payroll-periods')
      ]);

      setBatches(batchesResponse.data);
      setSummary(summaryResponse.data);
      setPendingPeriods(pendingResponse.data);
    } catch (error) {
      console.error('Error fetching payroll journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateJournalEntries = async (payrollPeriodId) => {
    try {
      await axios.post(`http://localhost:5000/api/automated-payroll-journal/generate-journal-entries/${payrollPeriodId}`);
      fetchPayrollJournalData(); // Refresh data
    } catch (error) {
      console.error('Error generating journal entries:', error);
    }
  };

  const postJournalBatch = async (batchId) => {
    try {
      await axios.post(`http://localhost:5000/api/automated-payroll-journal/post-journal-batch/${batchId}`);
      fetchPayrollJournalData(); // Refresh data
    } catch (error) {
      console.error('Error posting journal batch:', error);
    }
  };

  const filteredBatches = selectedStatus === 'all'
    ? batches
    : batches.filter(batch => batch.status.toLowerCase() === selectedStatus.toLowerCase());

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'posted': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'posted': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automated Payroll Journal Dashboard</h1>
          <p className="text-gray-600">Automated journal entry generation and posting</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalBatches || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Posted</p>
              <p className="text-2xl font-bold text-gray-900">{summary.postedBatches || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{summary.processingBatches || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${summary.totalAmount?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payroll Periods */}
      {pendingPeriods.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Pending Payroll Periods</h2>
            <p className="text-sm text-gray-600">Payroll periods that need journal entries generated</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pendingPeriods.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-900">Period ID: {period.payrollPeriodId}</p>
                    <p className="text-sm text-gray-600">
                      {period.totalEntries} entries • ${period.totalGrossPay.toLocaleString()} gross pay
                    </p>
                  </div>
                  <button
                    onClick={() => generateJournalEntries(period.payrollPeriodId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Journal</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Journal Batches */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Journal Entry Batches</h2>
            <div className="flex space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="processing">Processing</option>
                <option value="posted">Posted</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredBatches.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No journal batches found
            </div>
          ) : (
            filteredBatches.map((batch) => (
              <div key={batch.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(batch.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {batch.batchNumber}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {batch.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Entries:</span>
                          <br />
                          {batch.totalEntries}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>
                          <br />
                          ${batch.totalAmount?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <br />
                          {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Period:</span>
                          <br />
                          {batch.payrollPeriodId}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4 flex space-x-2">
                    {batch.status === 'Posted' && (
                      <button
                        onClick={() => postJournalBatch(batch.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    )}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomatedPayrollJournalDashboard;