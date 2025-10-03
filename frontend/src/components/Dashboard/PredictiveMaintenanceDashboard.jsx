import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Wrench,
  Car,
  Settings,
  Activity,
  Plus,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';

const PredictiveMaintenanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);
  const [healthScores, setHealthScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const [alertsResponse, healthResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/maintenance-alerts/alerts'),
        axios.get('http://localhost:5000/api/maintenance-alerts/health-scores')
      ]);

      setAlerts(alertsResponse.data || []);
      setHealthScores(healthResponse.data || []);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeVehicles = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/maintenance-alerts/analyze-vehicles');
      // Refresh data after analysis
      await fetchMaintenanceData();
    } catch (err) {
      console.error('Error analyzing vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const maintenanceStats = [
    {
      title: "Critical Alerts",
      value: alerts.filter(alert => alert.severity === 'critical').length.toString(),
      change: "+2",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Health Score",
      value: healthScores.length > 0 ? (healthScores.reduce((sum, score) => sum + score.overallScore, 0) / healthScores.length).toFixed(0) : "85",
      change: "+5%",
      icon: Activity,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Assets Monitored",
      value: healthScores.length.toString(),
      change: "+3",
      icon: Car,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Alerts This Month",
      value: alerts.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        const now = new Date();
        return alertDate.getMonth() === now.getMonth();
      }).length.toString(),
      change: "+12",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-600"
    }
  ];

  // Transform health scores data for display
  const assetHealthData = healthScores.map((score, index) => ({
    id: score.id || index + 1,
    assetName: `Asset ${score.assetId}`,
    assetType: score.assetType,
    healthScore: Math.round(score.overallScore),
    trend: score.trend,
    lastMaintenance: score.lastCalculated ? new Date(score.lastCalculated).toLocaleDateString() : 'Unknown',
    nextMaintenance: 'TBD',
    alerts: alerts.filter(alert => alert.assetId === score.assetId).length
  }));

  const recentAlerts = alerts.slice(0, 5).map(alert => ({
    id: alert.id,
    assetName: alert.assetName,
    severity: alert.severity,
    title: alert.title,
    description: alert.description,
    predictedDate: alert.predictedFailureDate,
    status: alert.status
  }));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'health', label: 'Asset Health' },
    { id: 'predictions', label: 'Predictions' }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Predictive Maintenance</h1>
          <p className="text-gray-600 mt-1">AI-powered maintenance alerts and asset health monitoring</p>
        </div>
        <button
          onClick={analyzeVehicles}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Analyze Assets'}</span>
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
        {maintenanceStats.map((stat, index) => {
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
        {/* Asset Health Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Asset Health Overview
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {assetHealthData.map((asset) => (
              <div key={asset.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {asset.assetName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.healthScore >= 80 ? 'bg-green-100 text-green-800' :
                      asset.healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {asset.healthScore}% Health
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      asset.trend === 'improving' ? 'bg-green-100 text-green-800' :
                      asset.trend === 'declining' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.trend}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Settings className="w-3 h-3" />
                    <span>{asset.assetType}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Next: {asset.nextMaintenance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Last: {asset.lastMaintenance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{asset.alerts} Alerts</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        asset.healthScore >= 80 ? 'bg-green-500' :
                        asset.healthScore >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${asset.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Alerts
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-800">
                      {alert.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {alert.assetName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Due: {alert.predictedDate}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent alerts</p>
                <p className="text-sm text-gray-400 mt-1">All assets are operating normally</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Maintenance Alerts</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Alert</span>
            </button>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-xl font-bold text-gray-800">
                    {alerts.filter(alert => alert.severity === 'critical').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-xl font-bold text-gray-800">
                    {alerts.filter(alert => alert.severity === 'high').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Medium Priority</p>
                  <p className="text-xl font-bold text-gray-800">
                    {alerts.filter(alert => alert.severity === 'medium').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-xl font-bold text-gray-800">
                    {alerts.filter(alert => alert.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert List */}
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      {alert.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600"><strong>Asset:</strong> {alert.assetName}</p>
                      <p className="text-gray-600"><strong>Type:</strong> {alert.alertType.replace('_', ' ')}</p>
                      <p className="text-gray-600"><strong>Confidence:</strong> {alert.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><strong>Predicted Date:</strong> {alert.predictedFailureDate}</p>
                      <p className="text-gray-600"><strong>Action:</strong> {alert.recommendedAction}</p>
                      {alert.estimatedCost && (
                        <p className="text-gray-600"><strong>Est. Cost:</strong> ${alert.estimatedCost.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{alert.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                          Acknowledge
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">No maintenance alerts</p>
                <p className="text-sm text-gray-400 mt-1">Run analysis to check asset health</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Asset Health Tab */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Asset Health Scores</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Recalculate All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetHealthData.map((asset) => (
              <div key={asset.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    {asset.assetName}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    asset.trend === 'improving' ? 'bg-green-100 text-green-800' :
                    asset.trend === 'declining' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.trend}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <span className="text-sm font-medium text-gray-800">{asset.healthScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        asset.healthScore >= 80 ? 'bg-green-500' :
                        asset.healthScore >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${asset.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-3 h-3" />
                    <span>{asset.assetType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Next: {asset.nextMaintenance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Last: {asset.lastMaintenance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{asset.alerts} Active Alerts</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button className="w-full text-blue-600 hover:text-blue-700 text-xs font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Maintenance Predictions</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Generate Predictions</span>
            </button>
          </div>

          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-500">Advanced prediction models coming soon</p>
            <p className="text-sm text-gray-400 mt-1">Machine learning algorithms will predict maintenance needs</p>
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
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Run Analysis</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Create Alert</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Car className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Add Asset</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Configure Models</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PredictiveMaintenanceDashboard;