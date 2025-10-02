import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Trash2
} from 'lucide-react';

const HouseManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLocation, setSelectedLocation] = useState('muscat');
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch maintenance data on component mount
  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const [requestsResponse, schedulesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/maintenance-requests'),
        axios.get('http://localhost:5000/api/maintenance-schedules')
      ]);

      // Filter for housing-related maintenance only
      const housingRequests = requestsResponse.data.filter(item =>
        item.location && item.location.toLowerCase().includes('housing')
      );
      const housingSchedules = schedulesResponse.data.filter(item =>
        item.location && item.location.toLowerCase().includes('housing')
      );

      setMaintenanceRequests(housingRequests);
      setMaintenanceSchedules(housingSchedules);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const houseStats = [
    {
      title: "Total Properties",
      value: "3",
      change: "+1",
      icon: Home,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Maintenance",
      value: maintenanceRequests.filter(req => req.status !== 'Completed').length.toString(),
      change: `+${maintenanceRequests.filter(req => req.status === 'In Progress').length}`,
      icon: Wrench,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Staff Members",
      value: "12",
      change: "+1",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Monthly Expenses",
      value: "$25,000",
      change: "+5.2%",
      icon: ShoppingCart,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const properties = [
    {
      name: "Muscat Villa",
      location: "Muscat, Oman",
      type: "Primary Residence",
      status: "Active",
      staff: 6,
      monthlyCost: "$15,000",
      lastMaintenance: "2024-01-10"
    },
    {
      name: "London Apartment",
      location: "London, UK",
      type: "Business Residence",
      status: "Active",
      staff: 4,
      monthlyCost: "$8,000",
      lastMaintenance: "2024-01-05"
    },
    {
      name: "Monaco Penthouse",
      location: "Monaco",
      type: "Racing Residence",
      status: "Active",
      staff: 2,
      monthlyCost: "$12,000",
      lastMaintenance: "2024-01-08"
    }
  ];

  // Transform maintenance requests to match the expected format
  const maintenanceTasks = maintenanceRequests.map(request => ({
    id: request.id || request._id,
    property: request.property,
    task: request.title,
    priority: request.urgency === 'Critical' ? 'High' :
             request.urgency === 'Important' ? 'Medium' : 'Low',
    status: request.status,
    assignedTo: request.assignedTo || 'Not Assigned',
    dueDate: request.dueDate,
    cost: request.estimatedCost
  }));

  const staffMembers = [
    {
      name: "Ahmed Al-Mansouri",
      position: "House Manager",
      location: "Muscat",
      status: "Active",
      experience: "5 years",
      avatar: "AM"
    },
    {
      name: "Maria Rodriguez",
      position: "Chef",
      location: "Muscat",
      status: "Active",
      experience: "3 years",
      avatar: "MR"
    },
    {
      name: "James Wilson",
      position: "House Manager",
      location: "London",
      status: "Active",
      experience: "7 years",
      avatar: "JW"
    },
    {
      name: "Sophie Dubois",
      position: "Housekeeper",
      location: "Monaco",
      status: "Active",
      experience: "2 years",
      avatar: "SD"
    }
  ];

  const purchaseOrders = [
    {
      id: 1,
      property: "Muscat Villa",
      item: "Furniture Set",
      quantity: 1,
      cost: "$5,000",
      status: "Delivered",
      date: "2024-01-12"
    },
    {
      id: 2,
      property: "London Apartment",
      item: "Kitchen Appliances",
      quantity: 3,
      cost: "$3,500",
      status: "Pending",
      date: "2024-01-18"
    },
    {
      id: 3,
      property: "Monaco Penthouse",
      item: "Security System",
      quantity: 1,
      cost: "$8,000",
      status: "Ordered",
      date: "2024-01-15"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'properties', label: 'Properties' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'staff', label: 'Staff' },
    { id: 'purchases', label: 'Purchases' }
  ];

  const locations = [
    { id: 'muscat', label: 'Muscat' },
    { id: 'abroad', label: 'Abroad' },
    { id: 'all', label: 'All Locations' }
  ];

  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-screen">
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
        {houseStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Properties
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {properties.map((property, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {property.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Home className="w-3 h-3" />
                    <span>{property.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{property.staff} staff</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{property.monthlyCost}/month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Maintenance Tasks
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {task.task}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Home className="w-3 h-3" />
                    <span>{task.property}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{task.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Members */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Staff Members
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staffMembers.map((staff, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {staff.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {staff.position}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{staff.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Experience:</span>
                  <span className="font-medium">{staff.experience}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {property.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>Location: {property.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="w-3 h-3" />
                    <span>Type: {property.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>Staff: {property.staff}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-3 h-3" />
                    <span>Monthly Cost: {property.monthlyCost}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last Maintenance:</span>
                    <span className="text-gray-800 font-medium">{property.lastMaintenance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Housing Maintenance</h2>
              <p className="text-gray-600">Manage maintenance requests and schedules for housing properties</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Add maintenance request functionality could be added here
                  alert('Add maintenance request functionality would be implemented here');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Request</span>
              </button>
              <button
                onClick={() => {
                  // Add maintenance schedule functionality could be added here
                  alert('Schedule maintenance functionality would be implemented here');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Maintenance</span>
              </button>
            </div>
          </div>

          {/* Combined Maintenance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Requests</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status !== 'Completed').length}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Scheduled</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceSchedules.filter(sch => sch.status === 'Scheduled').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status === 'In Progress').length +
                     maintenanceSchedules.filter(sch => sch.status === 'In Progress').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-black">
                    {maintenanceRequests.filter(req => req.status === 'Completed').length +
                     maintenanceSchedules.filter(sch => sch.status === 'Completed').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Maintenance Requests Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Maintenance Requests</h3>
            <div className="space-y-4">
              {maintenanceRequests.length > 0 ? (
                maintenanceRequests.map((request) => (
                  <div key={request.id || request._id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-black">{request.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Request
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Home className="w-3 h-3" />
                        <span>{request.property || 'Property'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {request.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{request.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{request.estimatedCost}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No maintenance requests found for housing properties.</p>
                  <p className="text-sm text-gray-400 mt-1">Add a new maintenance request to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Schedules Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Maintenance Schedules</h3>
            <div className="space-y-4">
              {maintenanceSchedules.length > 0 ? (
                maintenanceSchedules.map((schedule) => (
                  <div key={schedule.id || schedule._id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-black">{schedule.title || schedule.description}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Schedule
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          schedule.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          schedule.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Home className="w-3 h-3" />
                        <span>{schedule.property || 'Property'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Scheduled: {schedule.scheduledDate || schedule.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{schedule.assignedTechnician || schedule.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{schedule.estimatedCost}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{schedule.description || schedule.notes}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No maintenance schedules found for housing properties.</p>
                  <p className="text-sm text-gray-400 mt-1">Schedule maintenance to keep properties in optimal condition.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffMembers.map((staff, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {staff.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {staff.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {staff.position}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{staff.location}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Experience:</span>
                    <span className="font-medium">{staff.experience}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Purchase Orders
            </h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Purchase</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.property}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.item}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{order.cost}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Property</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Wrench className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Maintenance</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Staff</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <ShoppingCart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">New Purchase</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseManagementDashboard;