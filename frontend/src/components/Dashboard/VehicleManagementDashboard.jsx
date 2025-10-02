import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Car, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, Calendar,
  Fuel, MapPin, Settings, AlertTriangle, CheckCircle, Clock, Users,
  Wrench, FileText, Download, Upload, MoreVertical, Navigation, Gauge, ArrowLeft
} from 'lucide-react';

const VehicleManagementDashboard = ({ onBack }) => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    vin: '',
    status: 'Active',
    driver: '',
    location: '',
    mileage: '',
    fuelType: 'Petrol',
    fuelEfficiency: '',
    nextPM: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    purchaseDate: '',
    purchasePrice: '',
    color: '',
    seats: '',
    engineSize: '',
    transmission: 'Automatic'
  });

  // Fetch vehicles from backend
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  // Add new vehicle
  const addVehicle = async (vehicle) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vehicles', vehicle);
      setVehicles([...vehicles, response.data]);
    } catch (err) {
      console.error('Error adding vehicle:', err);
    }
  };

  // Update vehicle
  const updateVehicle = async (id, updatedVehicle) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/vehicles/${id}`, updatedVehicle);
      setVehicles(vehicles.map(v => (v.id === id ? response.data : v)));
    } catch (err) {
      console.error('Error updating vehicle:', err);
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };

  // Handle add vehicle
  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.plate) {
      alert('Make, Model, and Plate Number are required!');
      return;
    }
    addVehicle(newVehicle);
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      plate: '',
      vin: '',
      status: 'Active',
      driver: '',
      location: '',
      mileage: '',
      fuelType: 'Petrol',
      fuelEfficiency: '',
      nextPM: '',
      insuranceExpiry: '',
      registrationExpiry: '',
      purchaseDate: '',
      purchasePrice: '',
      color: '',
      seats: '',
      engineSize: '',
      transmission: 'Automatic'
    });
    setShowAddVehicle(false);
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditVehicle(true);
  };

  // Handle update vehicle
  const handleUpdateVehicle = () => {
    updateVehicle(selectedVehicle.id, selectedVehicle);
    setShowEditVehicle(false);
    setSelectedVehicle(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Vehicle stats
  const getVehicleStats = () => {
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status === 'Active').length;
    const maintenance = vehicles.filter(v => v.status === 'Maintenance').length;
    const avgFuelEfficiency = vehicles.reduce((sum, v) => {
      const efficiency = parseFloat(v.fuelEfficiency);
      return sum + (isNaN(efficiency) ? 0 : efficiency);
    }, 0) / vehicles.length || 0;
    return {
      total,
      active,
      maintenance,
      avgFuelEfficiency: avgFuelEfficiency.toFixed(1)
    };
  };

  const vehicleStats = [
    {
      title: "Total Vehicles",
      value: getVehicleStats().total,
      icon: Car,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Vehicles",
      value: getVehicleStats().active,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "In Maintenance",
      value: getVehicleStats().maintenance,
      icon: Wrench,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Avg Fuel Efficiency",
      value: `${getVehicleStats().avgFuelEfficiency} km/L`,
      icon: Fuel,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicleStats.map((stat, index) => {
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
                placeholder="Search vehicles by make, model, or plate..."
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
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddVehicle(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-600">
                  {vehicle.year} • {vehicle.plate}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Driver:</span>
                <span className="text-black">{vehicle.driver}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-black">{vehicle.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mileage:</span>
                <span className="text-black">{vehicle.mileage?.toLocaleString()} km</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fuel Efficiency:</span>
                <span className="text-black">{vehicle.fuelEfficiency}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next PM:</span>
                <span className="text-black">{vehicle.nextPM ? new Date(vehicle.nextPM).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditVehicle(vehicle)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteVehicle(vehicle.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Add New Vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Mercedes-Benz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., S-Class"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plate Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="ABC 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIN
                </label>
                <input
                  type="text"
                  value={newVehicle.vin}
                  onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="WDDUG8CB1EA123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newVehicle.status}
                  onChange={(e) => setNewVehicle({...newVehicle, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <input
                  type="text"
                  value={newVehicle.driver}
                  onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Driver Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newVehicle.location}
                  onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Muscat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={newVehicle.fuelType}
                  onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Efficiency (km/L)
                </label>
                <input
                  type="text"
                  value={newVehicle.fuelEfficiency}
                  onChange={(e) => setNewVehicle({...newVehicle, fuelEfficiency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="12 km/L"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next PM Date
                </label>
                <input
                  type="date"
                  value={newVehicle.nextPM}
                  onChange={(e) => setNewVehicle({...newVehicle, nextPM: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  value={newVehicle.insuranceExpiry}
                  onChange={(e) => setNewVehicle({...newVehicle, insuranceExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Expiry
                </label>
                <input
                  type="date"
                  value={newVehicle.registrationExpiry}
                  onChange={(e) => setNewVehicle({...newVehicle, registrationExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={newVehicle.purchaseDate}
                  onChange={(e) => setNewVehicle({...newVehicle, purchaseDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="text"
                  value={newVehicle.purchasePrice}
                  onChange={(e) => setNewVehicle({...newVehicle, purchasePrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="$85,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={newVehicle.color}
                  onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <input
                  type="number"
                  value={newVehicle.seats}
                  onChange={(e) => setNewVehicle({...newVehicle, seats: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Size
                </label>
                <input
                  type="text"
                  value={newVehicle.engineSize}
                  onChange={(e) => setNewVehicle({...newVehicle, engineSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="3.0L"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={newVehicle.transmission}
                  onChange={(e) => setNewVehicle({...newVehicle, transmission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddVehicle(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditVehicle && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={selectedVehicle.make}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, make: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={selectedVehicle.model}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedVehicle.status}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <input
                  type="text"
                  value={selectedVehicle.driver}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, driver: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedVehicle.location}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={selectedVehicle.mileage}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, mileage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={selectedVehicle.fuelType}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Efficiency (km/L)
                </label>
                <input
                  type="text"
                  value={selectedVehicle.fuelEfficiency}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, fuelEfficiency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next PM Date
                </label>
                <input
                  type="date"
                  value={selectedVehicle.nextPM ? new Date(selectedVehicle.nextPM).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, nextPM: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  value={selectedVehicle.insuranceExpiry ? new Date(selectedVehicle.insuranceExpiry).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, insuranceExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Expiry
                </label>
                <input
                  type="date"
                  value={selectedVehicle.registrationExpiry ? new Date(selectedVehicle.registrationExpiry).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, registrationExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={selectedVehicle.purchaseDate ? new Date(selectedVehicle.purchaseDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, purchaseDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="text"
                  value={selectedVehicle.purchasePrice}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, purchasePrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={selectedVehicle.color}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <input
                  type="number"
                  value={selectedVehicle.seats}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, seats: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Size
                </label>
                <input
                  type="text"
                  value={selectedVehicle.engineSize}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, engineSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={selectedVehicle.transmission}
                  onChange={(e) => setSelectedVehicle({...selectedVehicle, transmission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditVehicle(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagementDashboard;
