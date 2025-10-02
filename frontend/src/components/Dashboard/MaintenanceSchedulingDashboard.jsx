import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wrench, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, Calendar,
  Clock, AlertTriangle, CheckCircle, DollarSign, Car, Settings, FileText,
  Download, Upload, MoreVertical, Gauge, TrendingUp, Activity, Timer, MapPin
} from 'lucide-react';

const MaintenanceSchedulingDashboard = ({ onBack }) => {
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showScheduleCM, setShowScheduleCM] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);
  const [newCM, setNewCM] = useState({
    vehicle: '',
    plate: '',
    description: '',
    priority: 'Medium',
    scheduledDate: '',
    estimatedDuration: '',
    estimatedCost: '',
    assignedTechnician: '',
    location: '',
    partsRequired: '',
    notes: ''
  });

  // Fetch maintenance records from backend
  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/maintenanceschedulingcar/');
      setMaintenanceSchedule(response.data || []);
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
      setError('Failed to load maintenance records. Please check your connection.');
      setMaintenanceSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new maintenance record
  const addMaintenance = async (maintenance) => {
    try {
      await axios.post('http://localhost:5000/api/maintenanceschedulingcar/', maintenance);
      await fetchMaintenance(); // Refresh data
    } catch (err) {
      console.error('Error adding maintenance record:', err);
    }
  };

  // Update maintenance record
  const updateMaintenance = async (id, updatedMaintenance) => {
    try {
      await axios.put(`http://localhost:5000/api/maintenanceschedulingcar/${id}`, updatedMaintenance);
      await fetchMaintenance(); // Refresh data
    } catch (err) {
      console.error('Error updating maintenance record:', err);
    }
  };

  // Delete maintenance record
  const deleteMaintenance = async (id) => {
    if (!id || id === 'undefined') {
      alert('Invalid maintenance ID. Please refresh the page and try again.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/maintenanceschedulingcar/${id}`);
      await fetchMaintenance(); // Refresh data
    } catch (err) {
      console.error('Error deleting maintenance record:', err);
      alert('Failed to delete maintenance record. Please try again.');
    }
  };

  // Handle schedule corrective maintenance
  const handleScheduleCM = () => {
    if (!newCM.vehicle || !newCM.plate || !newCM.description || !newCM.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    const cm = {
      ...newCM,
      category: 'CM',
      status: 'Scheduled',
      partsRequired: newCM.partsRequired.split(',').map(part => part.trim()),
      estimatedCost: parseFloat(newCM.estimatedCost) || 0
    };

    addMaintenance(cm);
    setNewCM({
      vehicle: '',
      plate: '',
      description: '',
      priority: 'Medium',
      scheduledDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      assignedTechnician: '',
      location: '',
      partsRequired: '',
      notes: ''
    });
    setShowScheduleCM(false);
  };

  // Handle edit maintenance
  const handleEditMaintenance = (maintenance) => {
    const maintenanceId = maintenance.id || maintenance._id;
    if (!maintenanceId || maintenanceId === 'undefined') {
      alert('Invalid maintenance ID. Please refresh the page and try again.');
      return;
    }

    setSelectedMaintenance(maintenance);
    setEditingMaintenanceId(maintenanceId);
    setNewCM({
      vehicle: maintenance.vehicle,
      plate: maintenance.plate,
      description: maintenance.description,
      priority: maintenance.priority,
      scheduledDate: maintenance.scheduledDate,
      estimatedDuration: maintenance.estimatedDuration,
      estimatedCost: maintenance.estimatedCost.toString(),
      assignedTechnician: maintenance.assignedTechnician,
      location: maintenance.location,
      partsRequired: maintenance.partsRequired.join(', '),
      notes: maintenance.notes
    });
    setShowEditModal(true);
  };

  // Handle update maintenance
  const handleUpdateMaintenance = () => {
    if (!editingMaintenanceId || editingMaintenanceId === 'undefined') {
      alert('Invalid maintenance ID. Please try editing again.');
      return;
    }

    if (!newCM.vehicle || !newCM.plate || !newCM.description || !newCM.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedMaintenance = {
      vehicle: newCM.vehicle,
      plate: newCM.plate,
      description: newCM.description,
      priority: newCM.priority,
      scheduledDate: newCM.scheduledDate,
      estimatedDuration: newCM.estimatedDuration,
      estimatedCost: parseFloat(newCM.estimatedCost) || 0,
      assignedTechnician: newCM.assignedTechnician,
      location: newCM.location,
      partsRequired: newCM.partsRequired.split(',').map(part => part.trim()),
      notes: newCM.notes
    };

    updateMaintenance(editingMaintenanceId, updatedMaintenance);
    setShowEditModal(false);
    setSelectedMaintenance(null);
    setEditingMaintenanceId(null);
    setNewCM({
      vehicle: '',
      plate: '',
      description: '',
      priority: 'Medium',
      scheduledDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      assignedTechnician: '',
      location: '',
      partsRequired: '',
      notes: ''
    });
  };

  // Handle view maintenance
  const handleViewMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowViewModal(true);
  };

  // Handle start maintenance (change status to In Progress)
  const handleStartMaintenance = async (id) => {
    if (!id || id === 'undefined') {
      alert('Invalid maintenance ID. Please refresh the page and try again.');
      return;
    }
    try {
      const updatedMaintenance = {
        status: 'In Progress'
      };
      await updateMaintenance(id, updatedMaintenance);
    } catch (err) {
      console.error('Error starting maintenance:', err);
      alert('Failed to start maintenance. Please try again.');
    }
  };

  // Handle mark as completed
  const handleMarkCompleted = async (id) => {
    if (!id || id === 'undefined') {
      alert('Invalid maintenance ID. Please refresh the page and try again.');
      return;
    }
    try {
      const updatedMaintenance = {
        status: 'Completed'
      };
      await updateMaintenance(id, updatedMaintenance);
    } catch (err) {
      console.error('Error completing maintenance:', err);
      alert('Failed to mark as completed. Please try again.');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Approval':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get maintenance stats
  const getMaintenanceStats = () => {
    const total = maintenanceSchedule.length;
    const scheduled = maintenanceSchedule.filter(m => m.status === 'Scheduled').length;
    const inProgress = maintenanceSchedule.filter(m => m.status === 'In Progress').length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const totalCost = maintenanceSchedule
      .filter(m => {
        const scheduledDate = new Date(m.scheduledDate);
        return scheduledDate.getMonth() === currentMonth && scheduledDate.getFullYear() === currentYear;
      })
      .reduce((sum, m) => sum + m.estimatedCost, 0);
    return { total, scheduled, inProgress, totalCost };
  };

  // Filter maintenance records
  const filteredMaintenance = maintenanceSchedule.filter(maintenance => {
    const matchesSearch =
      maintenance.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || maintenance.status === filterStatus;
    const matchesType = filterType === 'all' || maintenance.category === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const maintenanceStats = [
    {
      title: "Total Maintenance",
      value: getMaintenanceStats().total,
      icon: Wrench,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Scheduled",
      value: getMaintenanceStats().scheduled,
      icon: Settings,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "In Progress",
      value: getMaintenanceStats().inProgress,
      icon: Activity,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Total Cost This Month",
      value: `$${getMaintenanceStats().totalCost}`,
      icon: DollarSign,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const upcomingMaintenance = maintenanceSchedule.filter(m =>
    m.status === 'Scheduled' && new Date(m.scheduledDate) > new Date()
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowScheduleCM(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {maintenanceStats.map((stat, index) => {
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
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search maintenance by vehicle, plate, or description..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="all">All Types</option>
                <option value="CM">Corrective</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Upcoming Maintenance</h3>
        {upcomingMaintenance.length > 0 ? (
          <div className="space-y-3">
            {upcomingMaintenance.map((maintenance) => (
              <div key={maintenance._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-black">{maintenance.vehicle} ({maintenance.plate})</p>
                  <p className="text-sm text-gray-600">{maintenance.description}</p>
                  <p className="text-sm text-gray-500">{new Date(maintenance.scheduledDate).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                  {maintenance.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming maintenance scheduled.</p>
        )}
      </div>

      {/* Maintenance List */}
      <div className="space-y-4">
        {filteredMaintenance.map((maintenance) => (
          <div key={maintenance._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-black">
                    {maintenance.vehicle} ({maintenance.plate})
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                    {maintenance.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                    {maintenance.priority} Priority
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {maintenance.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {maintenance.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="text-black">{new Date(maintenance.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-black">{maintenance.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Cost:</span>
                    <span className="text-black">${maintenance.estimatedCost}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewMaintenance(maintenance)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditMaintenance(maintenance)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Maintenance"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {maintenance.status === 'Scheduled' && (
                  <button
                    onClick={() => handleStartMaintenance(maintenance.id || maintenance._id)}
                    className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                    title="Start Maintenance"
                  >
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </button>
                )}
                {maintenance.status !== 'Completed' && (
                  <button
                    onClick={() => handleMarkCompleted(maintenance.id || maintenance._id)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    title="Mark as Completed"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </button>
                )}
                <button
                  onClick={() => deleteMaintenance(maintenance.id || maintenance._id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Delete Maintenance"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Corrective Maintenance Modal */}
      {showScheduleCM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Schedule Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle *
                </label>
                <input
                  type="text"
                  value={newCM.vehicle}
                  onChange={(e) => setNewCM({...newCM, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., BMW 7 Series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  value={newCM.plate}
                  onChange={(e) => setNewCM({...newCM, plate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="LON-002"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newCM.description}
                  onChange={(e) => setNewCM({...newCM, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={3}
                  placeholder="Describe the issue and required repairs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newCM.priority}
                  onChange={(e) => setNewCM({...newCM, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={newCM.scheduledDate}
                  onChange={(e) => setNewCM({...newCM, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={newCM.estimatedDuration}
                  onChange={(e) => setNewCM({...newCM, estimatedDuration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., 6 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={newCM.estimatedCost}
                  onChange={(e) => setNewCM({...newCM, estimatedCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Technician
                </label>
                <input
                  type="text"
                  value={newCM.assignedTechnician}
                  onChange={(e) => setNewCM({...newCM, assignedTechnician: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Technician name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newCM.location}
                  onChange={(e) => setNewCM({...newCM, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Workshop location"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parts Required
                </label>
                <textarea
                  value={newCM.partsRequired}
                  onChange={(e) => setNewCM({...newCM, partsRequired: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="List parts separated by commas"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCM.notes}
                  onChange={(e) => setNewCM({...newCM, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes or special instructions"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowScheduleCM(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleCM}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Maintenance Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle *
                </label>
                <input
                  type="text"
                  value={newCM.vehicle}
                  onChange={(e) => setNewCM({...newCM, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., BMW 7 Series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  value={newCM.plate}
                  onChange={(e) => setNewCM({...newCM, plate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="LON-002"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newCM.description}
                  onChange={(e) => setNewCM({...newCM, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={3}
                  placeholder="Describe the issue and required repairs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newCM.priority}
                  onChange={(e) => setNewCM({...newCM, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={newCM.scheduledDate}
                  onChange={(e) => setNewCM({...newCM, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={newCM.estimatedDuration}
                  onChange={(e) => setNewCM({...newCM, estimatedDuration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., 6 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={newCM.estimatedCost}
                  onChange={(e) => setNewCM({...newCM, estimatedCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Technician
                </label>
                <input
                  type="text"
                  value={newCM.assignedTechnician}
                  onChange={(e) => setNewCM({...newCM, assignedTechnician: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Technician name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newCM.location}
                  onChange={(e) => setNewCM({...newCM, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Workshop location"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parts Required
                </label>
                <textarea
                  value={newCM.partsRequired}
                  onChange={(e) => setNewCM({...newCM, partsRequired: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="List parts separated by commas"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCM.notes}
                  onChange={(e) => setNewCM({...newCM, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes or special instructions"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMaintenance}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Maintenance Modal */}
      {showViewModal && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Maintenance Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <p className="text-black">{selectedMaintenance.vehicle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <p className="text-black">{selectedMaintenance.plate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMaintenance.status)}`}>
                    {selectedMaintenance.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedMaintenance.priority)}`}>
                    {selectedMaintenance.priority} Priority
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <p className="text-black">{new Date(selectedMaintenance.scheduledDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration
                  </label>
                  <p className="text-black">{selectedMaintenance.estimatedDuration}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost
                  </label>
                  <p className="text-black">${selectedMaintenance.estimatedCost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Technician
                  </label>
                  <p className="text-black">{selectedMaintenance.assignedTechnician || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-black">{selectedMaintenance.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedMaintenance.category}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-black">{selectedMaintenance.description}</p>
              </div>
              {selectedMaintenance.partsRequired && selectedMaintenance.partsRequired.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parts Required
                  </label>
                  <ul className="list-disc list-inside text-black">
                    {selectedMaintenance.partsRequired.map((part, index) => (
                      <li key={index}>{part}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedMaintenance.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <p className="text-black">{selectedMaintenance.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
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

export default MaintenanceSchedulingDashboard;
