import React, { useState } from 'react';
import {
  Car,
  Users,
  Wrench,
  Calendar,
  MapPin,
  Fuel,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  Navigation
} from 'lucide-react';
import MaintenanceSchedulingDashboard from './MaintenanceSchedulingDashboard';

const FleetManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    {
      id: 1,
      vehicle: "Mercedes S-Class",
      type: "Regular Service",
      scheduledDate: "2024-02-15",
      status: "Scheduled",
      cost: "$800",
      description: "Oil change, filter replacement, brake check"
    },
    {
      id: 2,
      vehicle: "BMW 7 Series",
      type: "Brake Service",
      scheduledDate: "2024-01-25",
      status: "In Progress",
      cost: "$1,200",
      description: "Brake pad and rotor replacement"
    },
    {
      id: 3,
      vehicle: "Audi A8",
      type: "Engine Check",
      scheduledDate: "2024-01-20",
      status: "Completed",
      cost: "$600",
      description: "Engine diagnostic and minor repairs"
    }
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicle: '',
    type: '',
    scheduledDate: '',
    status: '',
    cost: '',
    description: ''
  });

  // Handler functions
  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setEditForm({
      vehicle: maintenance.vehicle,
      type: maintenance.type,
      scheduledDate: maintenance.scheduledDate,
      status: maintenance.status,
      cost: maintenance.cost,
      description: maintenance.description
    });
    setShowEditModal(true);
  };

  const handleUpdateMaintenance = () => {
    const updatedMaintenance = {
      ...selectedMaintenance,
      ...editForm
    };
    setMaintenanceSchedule(maintenanceSchedule.map(m => m.id === selectedMaintenance.id ? updatedMaintenance : m));
    setShowEditModal(false);
    setSelectedMaintenance(null);
    setEditForm({
      vehicle: '',
      type: '',
      scheduledDate: '',
      status: '',
      cost: '',
      description: ''
    });
  };

  const handleDeleteMaintenance = (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance schedule?')) {
      setMaintenanceSchedule(maintenanceSchedule.filter(m => m.id !== id));
    }
  };

  const handleMarkCompleted = (id) => {
    setMaintenanceSchedule(maintenanceSchedule.map(m => m.id === id ? { ...m, status: 'Completed' } : m));
  };

  const fleetStats = [
    {
      title: "Total Vehicles",
      value: "8",
      change: "+1",
      icon: Car,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Drivers",
      value: "6",
      change: "0",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Maintenance Due",
      value: "3",
      change: "+1",
      icon: Wrench,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Monthly Fuel Cost",
      value: "$4,500",
      change: "+12.5%",
      icon: Fuel,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const vehicles = [
    {
      id: 1,
      make: "Mercedes-Benz",
      model: "S-Class",
      year: "2023",
      plate: "MUS-001",
      status: "Active",
      driver: "Ahmed Al-Rashid",
      location: "Muscat",
      mileage: "15,000 km",
      nextService: "2024-02-15"
    },
    {
      id: 2,
      make: "BMW",
      model: "7 Series",
      year: "2022",
      plate: "LON-002",
      status: "Active",
      driver: "James Wilson",
      location: "London",
      mileage: "28,500 km",
      nextService: "2024-01-25"
    },
    {
      id: 3,
      make: "Audi",
      model: "A8",
      year: "2023",
      plate: "MON-003",
      status: "Maintenance",
      driver: "Unassigned",
      location: "Monaco",
      mileage: "12,000 km",
      nextService: "2024-01-20"
    },
    {
      id: 4,
      make: "Range Rover",
      model: "Autobiography",
      year: "2022",
      plate: "MUS-004",
      status: "Active",
      driver: "Mohammed Hassan",
      location: "Muscat",
      mileage: "22,000 km",
      nextService: "2024-02-10"
    }
  ];

  const drivers = [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      license: "Valid",
      experience: "8 years",
      status: "Active",
      currentVehicle: "Mercedes S-Class",
      location: "Muscat",
      avatar: "AR"
    },
    {
      id: 2,
      name: "James Wilson",
      license: "Valid",
      experience: "12 years",
      status: "Active",
      currentVehicle: "BMW 7 Series",
      location: "London",
      avatar: "JW"
    },
    {
      id: 3,
      name: "Mohammed Hassan",
      license: "Valid",
      experience: "5 years",
      status: "Active",
      currentVehicle: "Range Rover",
      location: "Muscat",
      avatar: "MH"
    },
    {
      id: 4,
      name: "David Smith",
      license: "Expired",
      experience: "3 years",
      status: "Inactive",
      currentVehicle: "None",
      location: "Monaco",
      avatar: "DS"
    }
  ];


  const recentTrips = [
    {
      id: 1,
      vehicle: "Mercedes S-Class",
      driver: "Ahmed Al-Rashid",
      route: "Muscat Airport → Villa",
      distance: "25 km",
      duration: "45 min",
      date: "2024-01-15",
      purpose: "Airport Pickup"
    },
    {
      id: 2,
      vehicle: "BMW 7 Series",
      driver: "James Wilson",
      route: "London Office → Heathrow",
      distance: "35 km",
      duration: "1h 15min",
      date: "2024-01-14",
      purpose: "Business Travel"
    },
    {
      id: 3,
      vehicle: "Range Rover",
      driver: "Mohammed Hassan",
      route: "Villa → Shopping Mall",
      distance: "15 km",
      duration: "30 min",
      date: "2024-01-13",
      purpose: "Personal Errand"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'drivers', label: 'Drivers' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'trips', label: 'Trips' }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-full text-black">
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
        {fleetStats.map((stat, index) => {
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
        {/* Vehicles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Vehicle Fleet
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Car className="w-3 h-3" />
                    <span>{vehicle.plate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{vehicle.driver}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="w-3 h-3" />
                    <span>{vehicle.mileage}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Next Service:</span>
                    <span className="text-gray-800 font-medium">{vehicle.nextService}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Drivers
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage All
            </button>
          </div>
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {driver.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {driver.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {driver.currentVehicle}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {driver.location}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {driver.experience}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    driver.license === 'Valid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {driver.license}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Maintenance Schedule
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {maintenanceSchedule.map((maintenance) => (
            <div key={maintenance.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-800">
                  {maintenance.vehicle}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  maintenance.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  maintenance.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {maintenance.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{maintenance.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{maintenance.scheduledDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{maintenance.cost}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {maintenance.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditMaintenance(maintenance)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                {maintenance.status !== 'Completed' && (
                  <button
                    onClick={() => handleMarkCompleted(maintenance.id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Complete</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMaintenance(maintenance.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Trips
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vehicle</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Driver</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Route</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Distance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{trip.vehicle}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{trip.driver}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{trip.route}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{trip.distance}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{trip.duration}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{trip.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Fleet Vehicles</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Car className="w-3 h-3" />
                    <span>Plate: {vehicle.plate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>Location: {vehicle.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>Driver: {vehicle.driver}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-3 h-3" />
                    <span>Mileage: {vehicle.mileage}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Next Service:</span>
                    <span className="text-gray-800 font-medium">{vehicle.nextService}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Fleet Drivers</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {driver.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {driver.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {driver.currentVehicle}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {driver.location}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {driver.experience}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    driver.license === 'Valid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {driver.license}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <MaintenanceSchedulingDashboard />
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Trips</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Book Trip</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Route</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Distance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{trip.vehicle}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{trip.driver}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.distance}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.duration}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Add Vehicle</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Add Driver</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Wrench className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Schedule Maintenance</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Book Trip</p>
          </button>
        </div>
      </div>

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
                  value={editForm.vehicle}
                  onChange={(e) => setEditForm({...editForm, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Vehicle name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Maintenance type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={editForm.scheduledDate}
                  onChange={(e) => setEditForm({...editForm, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost
                </label>
                <input
                  type="text"
                  value={editForm.cost}
                  onChange={(e) => setEditForm({...editForm, cost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Cost"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Maintenance description"
                  rows="3"
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
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagementDashboard;
