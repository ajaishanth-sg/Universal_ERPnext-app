import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, TrendingUp, Calendar, DollarSign, Wrench, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PredictiveMaintenanceDashboard = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [generatingPredictions, setGeneratingPredictions] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const [alertsResponse, summaryResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/predictive-maintenance/alerts'),
        axios.get('http://localhost:5000/api/predictive-maintenance/dashboard-summary')
      ]);

      setAlerts(alertsResponse.data);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    try {
      setGeneratingPredictions(true);
      await axios.post('http://localhost:5000/api/predictive-maintenance/alerts/generate-predictions');
      await fetchMaintenanceData(); // Refresh data
    } catch (error) {
      console.error('Error generating predictions:', error);
      alert('Error generating predictions. Please try again.');
    } finally {
      setGeneratingPredictions(false);
    }
  };

  const handleScheduleMaintenance = (alert) => {
    setSelectedAlert(alert);
    setShowScheduleModal(true);
  };

  const scheduleMaintenance = async (scheduleData) => {
    try {
      setScheduling(true);
      await axios.post('http://localhost:5000/api/predictive-maintenance/alerts/schedule', {
        alertId: selectedAlert.id,
        ...scheduleData
      });

      setShowScheduleModal(false);
      setSelectedAlert(null);
      await fetchMaintenanceData(); // Refresh data
      alert('Maintenance scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      alert('Error scheduling maintenance. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  const filteredAlerts = selectedPriority === 'all'
    ? alerts
    : alerts.filter(alert => alert.priority.toLowerCase() === selectedPriority.toLowerCase());

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'predicted': return <AlertTriangle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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
          <p className="text-gray-600">AI-powered maintenance predictions and alerts</p>
        </div>
        <button
          onClick={generatePredictions}
          disabled={generatingPredictions}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            generatingPredictions
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${generatingPredictions ? 'animate-spin' : ''}`} />
          <span>{generatingPredictions ? 'Generating...' : 'Generate Predictions'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalAlerts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{summary.criticalAlerts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{summary.scheduledAlerts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{summary.completedAlerts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Alerts</h2>
            <div className="flex space-x-2">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No maintenance alerts found
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(alert.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.assetName}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {alert.assetType}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {alert.failureDescription}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Predicted Date:</span>
                          <br />
                          {new Date(alert.predictedFailureDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span>
                          <br />
                          {alert.confidenceLevel}%
                        </div>
                        <div>
                          <span className="font-medium">Component:</span>
                          <br />
                          {alert.failureComponent}
                        </div>
                        <div>
                          <span className="font-medium">Est. Cost:</span>
                          <br />
                          ${alert.estimatedCost || 'N/A'}
                        </div>
                      </div>

                      {alert.licensePlate && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">License Plate:</span> {alert.licensePlate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleScheduleMaintenance(alert)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {showScheduleModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schedule Maintenance</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Asset:</strong> {selectedAlert.assetName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Component:</strong> {selectedAlert.failureComponent}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Priority:</strong>
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getPriorityColor(selectedAlert.priority)}`}>
                  {selectedAlert.priority}
                </span>
              </p>
            </div>

            <ScheduleForm
              onSubmit={scheduleMaintenance}
              onCancel={() => setShowScheduleModal(false)}
              loading={scheduling}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Schedule Form Component
const ScheduleForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    technician: '',
    notes: '',
    estimatedHours: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.scheduledDate && formData.technician) {
      onSubmit(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scheduled Date *
        </label>
        <input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => handleChange('scheduledDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Technician/Team *
        </label>
        <select
          value={formData.technician}
          onChange={(e) => handleChange('technician', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Technician</option>
          <option value="John Smith">John Smith</option>
          <option value="Mike Johnson">Mike Johnson</option>
          <option value="Sarah Wilson">Sarah Wilson</option>
          <option value="David Brown">David Brown</option>
          <option value="External Contractor">External Contractor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Hours
        </label>
        <input
          type="number"
          value={formData.estimatedHours}
          onChange={(e) => handleChange('estimatedHours', e.target.value)}
          placeholder="e.g., 2.5"
          min="0"
          step="0.5"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes or special instructions..."
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Scheduling...' : 'Schedule Maintenance'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PredictiveMaintenanceDashboard;