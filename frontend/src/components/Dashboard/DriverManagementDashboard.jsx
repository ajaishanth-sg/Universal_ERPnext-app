import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, Calendar,
  MapPin, Phone, Mail, FileText, Award, AlertTriangle, CheckCircle, Clock, Car,
  Star, TrendingUp, Download, Upload, MoreVertical, Shield, CreditCard, ArrowLeft
} from 'lucide-react';

const DriverManagementDashboard = ({ onBack }) => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showEditDriver, setShowEditDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [newDriver, setNewDriver] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    licenseNumber: '',
    licenseType: 'Full',
    licenseExpiry: '',
    experience: '',
    hireDate: '',
    salary: '',
    status: 'Active',
    assignedVehicle: '',
    location: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    address: '',
    performance: 'Good',
    rating: 4.0,
    totalTrips: 0
  });

  // Fetch drivers from backend
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  };

  // Add new driver
  const addDriver = async (driver) => {
    try {
      const response = await axios.post('http://localhost:5000/api/drivers', driver);
      setDrivers([...drivers, response.data]);
    } catch (err) {
      console.error('Error adding driver:', err);
    }
  };

  // Update driver
  const updateDriver = async (id, updatedDriver) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/drivers/${id}`, updatedDriver);
      setDrivers(drivers.map(d => (d.id === id ? response.data : d)));
    } catch (err) {
      console.error('Error updating driver:', err);
    }
  };

  // Delete driver
  const deleteDriver = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      setDrivers(drivers.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting driver:', err);
    }
  };

  // Handle add driver
  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.employeeId || !newDriver.email || !newDriver.phone || !newDriver.licenseNumber || !newDriver.licenseExpiry) {
      alert('Please fill in all required fields!');
      return;
    }

    // Check for duplicate employee ID
    if (drivers.some(d => d.employeeId === newDriver.employeeId)) {
      alert('Employee ID already exists');
      return;
    }

    addDriver(newDriver);
    setNewDriver({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      licenseNumber: '',
      licenseType: 'Full',
      licenseExpiry: '',
      experience: '',
      hireDate: '',
      salary: '',
      status: 'Active',
      assignedVehicle: '',
      location: '',
      emergencyContact: {
        name: '',
        phone: '',
        relation: ''
      },
      address: '',
      performance: 'Good',
      rating: 4.0,
      totalTrips: 0
    });
    setShowAddDriver(false);
  };

  // Handle edit driver
  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowEditDriver(true);
  };

  // Handle update driver
  const handleUpdateDriver = () => {
    updateDriver(selectedDriver.id, selectedDriver);
    setShowEditDriver(false);
    setSelectedDriver(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get performance color
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Needs Review':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Driver stats
  const getDriverStats = () => {
    const total = drivers.length;
    const active = drivers.filter(d => d.status === 'Active').length;
    const avgRating = drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length || 0;
    const licenseRenewalsDue = drivers.filter(d => {
      const expiryDate = new Date(d.licenseExpiry);
      const today = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(today.getMonth() + 3);
      return expiryDate <= threeMonthsFromNow && expiryDate > today;
    }).length;
    return {
      total,
      active,
      avgRating: avgRating.toFixed(1),
      licenseRenewalsDue
    };
  };

  const driverStats = [
    {
      title: "Total Drivers",
      value: getDriverStats().total,
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Drivers",
      value: getDriverStats().active,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Avg Performance",
      value: `${getDriverStats().avgRating}/5`,
      icon: Star,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "License Renewals Due",
      value: getDriverStats().licenseRenewalsDue,
      icon: AlertTriangle,
      color: "from-red-500 to-pink-600"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {driverStats.map((stat, index) => {
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
                placeholder="Search drivers by name, ID, or email..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Driver Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddDriver(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {driver.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {driver.employeeId}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Vehicle:</span>
                <span className="text-black">{driver.assignedVehicle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-black">{driver.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Performance:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(driver.performance)}`}>
                  {driver.performance}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-black">{driver.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">License Expiry:</span>
                <span className="text-black">{new Date(driver.licenseExpiry).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Trips:</span>
                <span className="text-black">{driver.totalTrips}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditDriver(driver)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteDriver(driver.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Add New Driver</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={newDriver.employeeId}
                  onChange={(e) => setNewDriver({...newDriver, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="DRV001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newDriver.dateOfBirth}
                  onChange={(e) => setNewDriver({...newDriver, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={newDriver.nationality}
                  onChange={(e) => setNewDriver({...newDriver, nationality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Country of origin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number *
                </label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="License number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry *
                </label>
                <input
                  type="date"
                  value={newDriver.licenseExpiry}
                  onChange={(e) => setNewDriver({...newDriver, licenseExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={newDriver.experience}
                  onChange={(e) => setNewDriver({...newDriver, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., 5 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hire Date
                </label>
                <input
                  type="date"
                  value={newDriver.hireDate}
                  onChange={(e) => setNewDriver({...newDriver, hireDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  value={newDriver.salary}
                  onChange={(e) => setNewDriver({...newDriver, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Monthly salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newDriver.status}
                  onChange={(e) => setNewDriver({...newDriver, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newDriver.location}
                  onChange={(e) => setNewDriver({...newDriver, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Vehicle
                </label>
                <input
                  type="text"
                  value={newDriver.assignedVehicle}
                  onChange={(e) => setNewDriver({...newDriver, assignedVehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Assigned Vehicle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={newDriver.rating}
                  onChange={(e) => setNewDriver({...newDriver, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Rating (0-5)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Trips
                </label>
                <input
                  type="number"
                  value={newDriver.totalTrips}
                  onChange={(e) => setNewDriver({...newDriver, totalTrips: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Total Trips"
                />
              </div>
            </div>
            {/* Emergency Contact Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-black mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newDriver.emergencyContact.name}
                    onChange={(e) => setNewDriver({
                      ...newDriver,
                      emergencyContact: {
                        ...newDriver.emergencyContact,
                        name: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={newDriver.emergencyContact.phone}
                    onChange={(e) => setNewDriver({
                      ...newDriver,
                      emergencyContact: {
                        ...newDriver.emergencyContact,
                        phone: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                    placeholder="Emergency contact phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={newDriver.emergencyContact.relation}
                    onChange={(e) => setNewDriver({
                      ...newDriver,
                      emergencyContact: {
                        ...newDriver.emergencyContact,
                        relation: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                    placeholder="e.g., Wife, Brother"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddDriver(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditDriver && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Driver</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={selectedDriver.name}
                  onChange={(e) => setSelectedDriver({...selectedDriver, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedDriver.status}
                  onChange={(e) => setSelectedDriver({...selectedDriver, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedDriver.location}
                  onChange={(e) => setSelectedDriver({...selectedDriver, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Vehicle
                </label>
                <input
                  type="text"
                  value={selectedDriver.assignedVehicle}
                  onChange={(e) => setSelectedDriver({...selectedDriver, assignedVehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={selectedDriver.rating}
                  onChange={(e) => setSelectedDriver({...selectedDriver, rating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Trips
                </label>
                <input
                  type="number"
                  value={selectedDriver.totalTrips}
                  onChange={(e) => setSelectedDriver({...selectedDriver, totalTrips: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance
                </label>
                <select
                  value={selectedDriver.performance}
                  onChange={(e) => setSelectedDriver({...selectedDriver, performance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Needs Review">Needs Review</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditDriver(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagementDashboard;
