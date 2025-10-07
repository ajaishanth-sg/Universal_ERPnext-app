import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wrench,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  DollarSign,
  Filter,
  Search,
  ChevronDown,
  Home,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckSquare,
  XCircle
} from 'lucide-react';

const MaintenanceDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showViewRequest, setShowViewRequest] = useState(false);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewSchedule, setShowViewSchedule] = useState(false);
  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [showUpdateScheduleStatus, setShowUpdateScheduleStatus] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  // Fetch data from backend
  useEffect(() => {
    fetchMaintenanceRequests();
    fetchMaintenanceSchedules();
  }, [refreshTrigger]);

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/maintenance-requests/');
      setMaintenanceRequests(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError('Failed to load maintenance requests. Please check your connection.');
      setMaintenanceRequests([]);
    }
  };

  const fetchMaintenanceSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/maintenance-schedules/');
      setMaintenanceSchedule(response.data || []);
    } catch (err) {
      console.error('Error fetching maintenance schedules:', err);
      setError('Failed to load maintenance schedules. Please check your connection.');
      setMaintenanceSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard data states
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [newRequest, setNewRequest] = useState({
    property: '',
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    urgency: 'Normal',
    estimatedCost: '',
    dueDate: ''
  });

  const [newSchedule, setNewSchedule] = useState({
    property: '',
    task: '',
    frequency: 'Monthly',
    assignedTo: '',
    cost: '',
    nextDue: '',
    description: ''
  });

  // Handler functions
  const handleNewRequest = async () => {
    if (!newRequest.property || !newRequest.title || !newRequest.category || !newRequest.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const request = {
      property: newRequest.property,
      location: newRequest.property === 'Muscat Villa' ? 'Muscat, Oman' :
                newRequest.property === 'London Apartment' ? 'London, UK' : 'Monaco',
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
      status: 'Pending Approval',
      assignedTo: 'Pending Assignment',
      estimatedCost: newRequest.estimatedCost || 'TBD',
      requestedDate: new Date().toISOString().split('T')[0],
      dueDate: newRequest.dueDate,
      category: newRequest.category,
      urgency: newRequest.urgency
    };

    try {
      await axios.post('http://localhost:5000/api/maintenance-requests/', request);
      alert('Maintenance request submitted successfully!');
      setShowNewRequest(false);
      setNewRequest({
        property: '',
        title: '',
        description: '',
        priority: 'Medium',
        category: '',
        urgency: 'Normal',
        estimatedCost: '',
        dueDate: ''
      });
      fetchMaintenanceRequests(); // Refresh data
    } catch (err) {
      console.error('Error creating maintenance request:', err);
      alert('Failed to submit maintenance request. Please try again.');
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.property || !newSchedule.task || !newSchedule.assignedTo || !newSchedule.nextDue) {
      alert('Please fill in all required fields');
      return;
    }

    const schedule = {
      property: newSchedule.property,
      task: newSchedule.task,
      frequency: newSchedule.frequency,
      lastCompleted: new Date().toISOString().split('T')[0],
      nextDue: newSchedule.nextDue,
      assignedTo: newSchedule.assignedTo,
      cost: newSchedule.cost || '$0',
      status: 'Scheduled',
      description: newSchedule.description || ''
    };

    try {
      await axios.post('http://localhost:5000/api/maintenance-schedules/', schedule);
      alert('Maintenance schedule added successfully!');
      setShowAddSchedule(false);
      setNewSchedule({
        property: '',
        task: '',
        frequency: 'Monthly',
        assignedTo: '',
        cost: '',
        nextDue: '',
        description: ''
      });
      fetchMaintenanceSchedules(); // Refresh data
    } catch (err) {
      console.error('Error creating maintenance schedule:', err);
      alert('Failed to add maintenance schedule. Please try again.');
    }
  };

  // Handler functions for request actions
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewRequest(true);
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setNewRequest({
      property: request.property,
      title: request.title,
      description: request.description,
      priority: request.priority,
      category: request.category,
      urgency: request.urgency,
      estimatedCost: request.estimatedCost.replace('$', ''),
      dueDate: request.dueDate
    });
    setShowEditRequest(true);
  };

  const handleUpdateRequest = async () => {
    if (!newRequest.property || !newRequest.title || !newRequest.category || !newRequest.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const updates = {
      property: newRequest.property,
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
      category: newRequest.category,
      urgency: newRequest.urgency,
      estimatedCost: newRequest.estimatedCost ? `$${newRequest.estimatedCost}` : 'TBD',
      dueDate: newRequest.dueDate,
      location: newRequest.property === 'Muscat Villa' ? 'Muscat, Oman' :
                newRequest.property === 'London Apartment' ? 'London, UK' : 'Monaco'
    };

    try {
      await axios.put(`http://localhost:5000/api/maintenance-requests/${selectedRequest.id}`, updates);
      alert('Maintenance request updated successfully!');
      setShowEditRequest(false);
      setSelectedRequest(null);
      setNewRequest({
        property: '',
        title: '',
        description: '',
        priority: 'Medium',
        category: '',
        urgency: 'Normal',
        estimatedCost: '',
        dueDate: ''
      });
      fetchMaintenanceRequests(); // Refresh data
    } catch (err) {
      console.error('Error updating maintenance request:', err);
      alert('Failed to update maintenance request. Please try again.');
    }
  };

  const handleUpdateStatus = (request) => {
    setSelectedRequest(request);
    setShowUpdateStatus(true);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/maintenance-requests/${selectedRequest.id}`, { status: newStatus });
      alert(`Status updated to ${newStatus}`);
      setShowUpdateStatus(false);
      setSelectedRequest(null);
      fetchMaintenanceRequests(); // Refresh data
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleCancelRequest = (request) => {
    if (window.confirm('Are you sure you want to cancel this maintenance request?')) {
      setMaintenanceRequests(prev => prev.map(req =>
        req.id === request.id ? { ...req, status: 'Cancelled' } : req
      ));
      alert('Maintenance request cancelled');
    }
  };

  // Handler functions for schedule actions
  const handleViewSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowViewSchedule(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setNewSchedule({
      property: schedule.property,
      task: schedule.task,
      frequency: schedule.frequency,
      assignedTo: schedule.assignedTo,
      cost: schedule.cost.replace('$', ''),
      nextDue: schedule.nextDue,
      description: schedule.description || ''
    });
    setShowEditSchedule(true);
  };

  const handleUpdateSchedule = async () => {
    if (!newSchedule.property || !newSchedule.task || !newSchedule.assignedTo || !newSchedule.nextDue) {
      alert('Please fill in all required fields');
      return;
    }

    const updates = {
      property: newSchedule.property,
      task: newSchedule.task,
      frequency: newSchedule.frequency,
      assignedTo: newSchedule.assignedTo,
      cost: newSchedule.cost ? `$${newSchedule.cost}` : '$0',
      nextDue: newSchedule.nextDue,
      description: newSchedule.description
    };

    try {
      await axios.put(`http://localhost:5000/api/maintenance-schedules/${selectedSchedule.id}`, updates);
      alert('Maintenance schedule updated successfully!');
      setShowEditSchedule(false);
      setSelectedSchedule(null);
      setNewSchedule({
        property: '',
        task: '',
        frequency: 'Monthly',
        assignedTo: '',
        cost: '',
        nextDue: '',
        description: ''
      });
      fetchMaintenanceSchedules(); // Refresh data
    } catch (err) {
      console.error('Error updating maintenance schedule:', err);
      alert('Failed to update maintenance schedule. Please try again.');
    }
  };

  const handleDeleteSchedule = async (schedule) => {
    if (window.confirm('Are you sure you want to delete this maintenance schedule?')) {
      try {
        await axios.delete(`http://localhost:5000/api/maintenance-schedules/${schedule.id}`);
        alert('Maintenance schedule deleted successfully!');
        fetchMaintenanceSchedules(); // Refresh data
      } catch (err) {
        console.error('Error deleting maintenance schedule:', err);
        alert('Failed to delete maintenance schedule. Please try again.');
      }
    }
  };

  const handleUpdateScheduleStatus = (schedule) => {
    setSelectedSchedule(schedule);
    setShowUpdateScheduleStatus(true);
  };

  const handleScheduleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/maintenance-schedules/${selectedSchedule.id}`, { status: newStatus });
      alert(`Schedule status updated to ${newStatus}`);
      setShowUpdateScheduleStatus(false);
      setSelectedSchedule(null);
      fetchMaintenanceSchedules(); // Refresh data
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error updating schedule status:', err);
      alert('Failed to update schedule status. Please try again.');
    }
  };

  // Calculate real statistics for overview
  const calculateOverviewStats = () => {
    const totalRequests = maintenanceRequests.length;
    const pendingApproval = maintenanceRequests.filter(r => r.status === 'Pending Approval').length;
    const inProgress = maintenanceRequests.filter(r => r.status === 'In Progress').length;
    const completed = maintenanceRequests.filter(r => r.status === 'Completed').length;

    // Calculate changes (this month vs last month - simplified)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthRequests = maintenanceRequests.filter(request => {
      const requestDate = new Date(request.requestedDate);
      return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
    }).length;

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthRequests = maintenanceRequests.filter(request => {
      const requestDate = new Date(request.requestedDate);
      return requestDate.getMonth() === lastMonth && requestDate.getFullYear() === lastMonthYear;
    }).length;

    const totalChange = thisMonthRequests - lastMonthRequests;

    return [
      {
        title: "Total Requests",
        value: totalRequests.toString(),
        change: totalChange >= 0 ? `+${totalChange}` : totalChange.toString(),
        icon: Wrench,
        color: "from-blue-500 to-cyan-600"
      },
      {
        title: "Pending Approval",
        value: pendingApproval.toString(),
        change: "+0", // Could be calculated more precisely if needed
        icon: Clock,
        color: "from-orange-500 to-red-600"
      },
      {
        title: "In Progress",
        value: inProgress.toString(),
        change: "+0", // Could be calculated more precisely if needed
        icon: Settings,
        color: "from-yellow-500 to-orange-600"
      },
      {
        title: "Completed",
        value: completed.toString(),
        change: "+0", // Could be calculated more precisely if needed
        icon: CheckCircle,
        color: "from-green-500 to-emerald-600"
      }
    ];
  };

  const maintenanceStats = calculateOverviewStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'requests', label: 'Maintenance Requests', icon: Wrench },
    { id: 'schedule', label: 'Maintenance Schedule', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Pending Quote':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Important':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'Routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const propertyMatch = selectedProperty === 'all' || request.property === selectedProperty;
    const statusMatch = filters.status === 'all' || request.status === filters.status;
    const priorityMatch = filters.priority === 'all' || request.priority === filters.priority;
    const categoryMatch = filters.category === 'all' || request.category === filters.category;
    return propertyMatch && statusMatch && priorityMatch && categoryMatch;
  });

  // Calculate real statistics for reports
  const calculateReportStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Requests this month
    const requestsThisMonth = maintenanceRequests.filter(request => {
      const requestDate = new Date(request.requestedDate);
      return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
    }).length;

    // Status counts
    const completed = maintenanceRequests.filter(r => r.status === 'Completed').length;
    const inProgress = maintenanceRequests.filter(r => r.status === 'In Progress').length;
    const pending = maintenanceRequests.filter(r => r.status === 'Pending Approval').length;

    // Total cost from all requests
    const totalCost = maintenanceRequests.reduce((sum, request) => {
      if (!request.estimatedCost) return sum;
      const cost = parseFloat(request.estimatedCost.replace('$', '').replace(',', '')) || 0;
      return sum + cost;
    }, 0);

    // Property breakdown
    const propertyStats = maintenanceRequests.reduce((acc, request) => {
      if (request.property) {
        acc[request.property] = (acc[request.property] || 0) + 1;
      }
      return acc;
    }, {});

    const muscatCount = propertyStats['Muscat Villa'] || 0;
    const londonCount = propertyStats['London Apartment'] || 0;
    const monacoCount = propertyStats['Monaco Penthouse'] || 0;

    // Priority distribution
    const highPriority = maintenanceRequests.filter(r => r.priority === 'High').length;
    const mediumPriority = maintenanceRequests.filter(r => r.priority === 'Medium').length;
    const lowPriority = maintenanceRequests.filter(r => r.priority === 'Low').length;

    // Schedule statistics
    const totalSchedules = maintenanceSchedule.length;
    const dueThisWeek = maintenanceSchedule.filter(schedule => {
      const dueDate = new Date(schedule.nextDue);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= weekFromNow;
    }).length;

    const dueThisMonth = maintenanceSchedule.filter(schedule => {
      const dueDate = new Date(schedule.nextDue);
      return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
    }).length;

    const overdue = maintenanceSchedule.filter(schedule => {
      const dueDate = new Date(schedule.nextDue);
      const today = new Date();
      return dueDate < today && schedule.status !== 'Completed';
    }).length;

    return {
      requestsThisMonth,
      completed,
      inProgress,
      pending,
      totalCost: totalCost.toFixed(2),
      muscatCount,
      londonCount,
      monacoCount,
      highPriority,
      mediumPriority,
      lowPriority,
      totalSchedules,
      dueThisWeek,
      dueThisMonth,
      overdue
    };
  };

  const reportStats = calculateReportStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading maintenance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold">Error Loading Data</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchMaintenanceRequests();
              fetchMaintenanceSchedules();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
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
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
                      <p className="text-2xl font-bold text-black mt-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
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

          {/* Recent Requests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">
                Recent Maintenance Requests
              </h2>
              <button
                onClick={() => setActiveTab('requests')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {maintenanceRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-black">
                      {request.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Home className="w-3 h-3" />
                      <span>{request.property}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{request.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{request.estimatedCost}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{request.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Schedule Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">
                Upcoming Maintenance Schedule
              </h2>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {maintenanceSchedule.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-black">{item.task}</p>
                      <p className="text-xs text-gray-600">{item.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">{item.nextDue}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Due Soon' ? 'bg-orange-100 text-orange-800' :
                      item.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Maintenance Requests</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button
                onClick={() => setShowNewRequest(true)}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-black">
                      {request.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority} Priority
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {request.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Home className="w-3 h-3" />
                    <span>{request.property}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{request.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{request.estimatedCost}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {request.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wrench className="w-3 h-3" />
                    <span>{request.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Requested: {request.requestedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Status: {request.status}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEditRequest(request)}
                      className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(request)}
                      className="px-3 py-1 text-xs bg-orange-50 text-orange-600 rounded hover:bg-orange-100 flex items-center space-x-1"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>Update Status</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Maintenance Schedule</h2>
            <button
              onClick={() => setShowAddSchedule(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Task</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Frequency</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Completed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Next Due</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceSchedule.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-black">{item.property}</td>
                    <td className="py-3 px-4 text-sm text-black">{item.task}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.frequency}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.lastCompleted}</td>
                    <td className="py-3 px-4 text-sm text-black font-medium">{item.nextDue}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.assignedTo}</td>
                    <td className="py-3 px-4 text-sm text-black font-medium">{item.cost}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Due Soon' ? 'bg-orange-100 text-orange-800' :
                        item.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSchedule(item)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                          title="View Schedule"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditSchedule(item)}
                          className="p-1 text-gray-600 hover:text-green-600"
                          title="Edit Schedule"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateScheduleStatus(item)}
                          className="p-1 text-gray-600 hover:text-orange-600"
                          title="Update Status"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="Delete Schedule"
                        >
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

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Maintenance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Requests This Month:</span>
                  <span className="font-medium">{reportStats.requestsThisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{reportStats.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-medium text-blue-600">{reportStats.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-orange-600">{reportStats.pending}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span>${reportStats.totalCost}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Property Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Muscat Villa:</span>
                  <span className="font-medium">{reportStats.muscatCount} requests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">London Apartment:</span>
                  <span className="font-medium">{reportStats.londonCount} requests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monaco Penthouse:</span>
                  <span className="font-medium">{reportStats.monacoCount} requests</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Average Cost per Property:</span>
                  <span>${reportStats.requestsThisMonth > 0 ? (parseFloat(reportStats.totalCost) / reportStats.requestsThisMonth).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Priority Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">High Priority:</span>
                  <span className="font-medium text-red-600">{reportStats.highPriority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medium Priority:</span>
                  <span className="font-medium text-yellow-600">{reportStats.mediumPriority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Priority:</span>
                  <span className="font-medium text-blue-600">{reportStats.lowPriority}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Average Response Time:</span>
                  <span>{reportStats.requestsThisMonth > 0 ? (reportStats.completed / reportStats.requestsThisMonth * 7).toFixed(1) : '0.0'} days</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Upcoming Schedule</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Due This Week:</span>
                  <span className="font-medium text-orange-600">{reportStats.dueThisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due This Month:</span>
                  <span className="font-medium text-blue-600">{reportStats.dueThisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overdue:</span>
                  <span className="font-medium text-red-600">{reportStats.overdue}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Scheduled Tasks:</span>
                  <span>{reportStats.totalSchedules}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">New Maintenance Request</h2>
              <button
                onClick={() => setShowNewRequest(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property *
                  </label>
                  <select
                    value={newRequest.property}
                    onChange={(e) => setNewRequest({...newRequest, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Property</option>
                    <option value="Muscat Villa">Muscat Villa</option>
                    <option value="London Apartment">London Apartment</option>
                    <option value="Monaco Penthouse">Monaco Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Category</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Security">Security</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  placeholder="Brief description of the maintenance issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  rows={3}
                  placeholder="Detailed description of the maintenance request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency
                  </label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost
                  </label>
                  <input
                    type="text"
                    value={newRequest.estimatedCost}
                    onChange={(e) => setNewRequest({...newRequest, estimatedCost: e.target.value})}
                    placeholder="$1,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newRequest.dueDate}
                  onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Add Maintenance Schedule</h2>
              <button
                onClick={() => setShowAddSchedule(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property *
                  </label>
                  <select
                    value={newSchedule.property}
                    onChange={(e) => setNewSchedule({...newSchedule, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Property</option>
                    <option value="Muscat Villa">Muscat Villa</option>
                    <option value="London Apartment">London Apartment</option>
                    <option value="Monaco Penthouse">Monaco Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task *
                </label>
                <input
                  type="text"
                  value={newSchedule.task}
                  onChange={(e) => setNewSchedule({...newSchedule, task: e.target.value})}
                  placeholder="e.g., HVAC Annual Service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                  rows={2}
                  placeholder="Brief description of the maintenance task..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To *
                  </label>
                  <input
                    type="text"
                    value={newSchedule.assignedTo}
                    onChange={(e) => setNewSchedule({...newSchedule, assignedTo: e.target.value})}
                    placeholder="Contractor or staff name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    value={newSchedule.cost}
                    onChange={(e) => setNewSchedule({...newSchedule, cost: e.target.value})}
                    placeholder="$500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Due Date *
                </label>
                <input
                  type="date"
                  value={newSchedule.nextDue}
                  onChange={(e) => setNewSchedule({...newSchedule, nextDue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddSchedule(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewRequest && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Maintenance Request Details</h2>
              <button
                onClick={() => setShowViewRequest(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <p className="text-black">{selectedRequest.property}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-black">{selectedRequest.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority} Priority
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-black">{selectedRequest.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                    {selectedRequest.urgency}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <p className="text-black">{selectedRequest.estimatedCost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <p className="text-black">{selectedRequest.dueDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Date</label>
                  <p className="text-black">{selectedRequest.requestedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <p className="text-black">{selectedRequest.assignedTo}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-black font-medium">{selectedRequest.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-black">{selectedRequest.description}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowViewRequest(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Edit Maintenance Request</h2>
              <button
                onClick={() => setShowEditRequest(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property *
                  </label>
                  <select
                    value={newRequest.property}
                    onChange={(e) => setNewRequest({...newRequest, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Property</option>
                    <option value="Muscat Villa">Muscat Villa</option>
                    <option value="London Apartment">London Apartment</option>
                    <option value="Monaco Penthouse">Monaco Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Category</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Security">Security</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  placeholder="Brief description of the maintenance issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  rows={3}
                  placeholder="Detailed description of the maintenance request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency
                  </label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost
                  </label>
                  <input
                    type="text"
                    value={newRequest.estimatedCost}
                    onChange={(e) => setNewRequest({...newRequest, estimatedCost: e.target.value})}
                    placeholder="$1,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newRequest.dueDate}
                  onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditRequest(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatus && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Update Request Status</h2>
              <button
                onClick={() => setShowUpdateStatus(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  id="statusSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Quote">Pending Quote</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowUpdateStatus(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const select = document.getElementById('statusSelect');
                    const newStatus = select.value;
                    handleStatusChange(newStatus);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Filter Maintenance Requests</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="all">All Status</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Quote">Pending Quote</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="all">All Categories</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Security">Security</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setFilters({ status: 'all', priority: 'all', category: 'all' });
                    setSelectedProperty('all');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {showViewSchedule && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Maintenance Schedule Details</h2>
              <button
                onClick={() => setShowViewSchedule(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <p className="text-black">{selectedSchedule.property}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <p className="text-black">{selectedSchedule.frequency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedSchedule.status === 'Due Soon' ? 'bg-orange-100 text-orange-800' :
                    selectedSchedule.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedSchedule.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <p className="text-black">{selectedSchedule.cost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Completed</label>
                  <p className="text-black">{selectedSchedule.lastCompleted}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Due</label>
                  <p className="text-black">{selectedSchedule.nextDue}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                <p className="text-black font-medium">{selectedSchedule.task}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <p className="text-black">{selectedSchedule.assignedTo}</p>
              </div>
              {selectedSchedule.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-black">{selectedSchedule.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowViewSchedule(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Edit Maintenance Schedule</h2>
              <button
                onClick={() => setShowEditSchedule(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property *
                  </label>
                  <select
                    value={newSchedule.property}
                    onChange={(e) => setNewSchedule({...newSchedule, property: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="">Select Property</option>
                    <option value="Muscat Villa">Muscat Villa</option>
                    <option value="London Apartment">London Apartment</option>
                    <option value="Monaco Penthouse">Monaco Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task *
                </label>
                <input
                  type="text"
                  value={newSchedule.task}
                  onChange={(e) => setNewSchedule({...newSchedule, task: e.target.value})}
                  placeholder="e.g., HVAC Annual Service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                  rows={2}
                  placeholder="Brief description of the maintenance task..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To *
                  </label>
                  <input
                    type="text"
                    value={newSchedule.assignedTo}
                    onChange={(e) => setNewSchedule({...newSchedule, assignedTo: e.target.value})}
                    placeholder="Contractor or staff name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    value={newSchedule.cost}
                    onChange={(e) => setNewSchedule({...newSchedule, cost: e.target.value})}
                    placeholder="$500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Due Date *
                </label>
                <input
                  type="date"
                  value={newSchedule.nextDue}
                  onChange={(e) => setNewSchedule({...newSchedule, nextDue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditSchedule(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Schedule Status Modal */}
      {showUpdateScheduleStatus && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black">Update Schedule Status</h2>
              <button
                onClick={() => setShowUpdateScheduleStatus(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Status
                </label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedSchedule.status === 'Due Soon' ? 'bg-orange-100 text-orange-800' :
                  selectedSchedule.status === 'Active' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedSchedule.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  id="scheduleStatusSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Active">Active</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowUpdateScheduleStatus(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const select = document.getElementById('scheduleStatusSelect');
                    const newStatus = select.value;
                    handleScheduleStatusChange(newStatus);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;