import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Car,
  Users,
  Wrench,
  Calendar,
  MapPin,
  Fuel,
  AlertCircle,
  Clock,
  Plus,
  Eye,
  Navigation
} from 'lucide-react';

const FleetManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

      // Filter for fleet-related maintenance only
      const fleetRequests = requestsResponse.data.filter(item =>
        item.location && item.location.toLowerCase().includes('fleet')
      );
      const fleetSchedules = schedulesResponse.data.filter(item =>
        item.location && item.location.toLowerCase().includes('fleet')
      );

      setMaintenanceRequests(fleetRequests);
      setMaintenanceSchedules(fleetSchedules);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
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
      value: maintenanceRequests.filter(req => req.status !== 'Completed').length.toString(),
      change: `+${maintenanceRequests.filter(req => req.status === 'In Progress').length}`,
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
    { id: 'maintenance', label: 'Maintenance Drive' },
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
            Fleet Maintenance
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {maintenanceRequests.slice(0, 3).map((maintenance) => (
            <div key={maintenance.id || maintenance._id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-800">
                  {maintenance.title || maintenance.property || 'Vehicle Maintenance'}
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
                  <span className="text-sm text-gray-600">{maintenance.category || 'Maintenance'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{maintenance.dueDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{maintenance.estimatedCost}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {maintenance.description}
                </p>
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Fleet Maintenance</h2>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Schedule Maintenance</span>
            </button>
          </div>

          {/* Maintenance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-xl font-bold text-gray-800">
                    {maintenanceRequests.filter(req => req.status === 'Pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-xl font-bold text-gray-800">
                    {maintenanceRequests.filter(req => req.status === 'In Progress').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-800">
                    {maintenanceRequests.filter(req => req.status === 'Completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800">Maintenance Requests</h3>
            {maintenanceRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceRequests.map((maintenance) => (
                  <div key={maintenance.id || maintenance._id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-800">
                        {maintenance.title || maintenance.property || 'Vehicle Maintenance'}
                      </h4>
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
                        <span className="text-sm text-gray-600">{maintenance.category || 'Fleet Maintenance'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{maintenance.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Fuel className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{maintenance.estimatedCost}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {maintenance.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-xs font-medium">
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No fleet maintenance requests found</p>
                <p className="text-sm text-gray-400 mt-1">Schedule maintenance for your fleet vehicles</p>
              </div>
            )}
          </div>
        </div>
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

    </div>
  );
};

export default FleetManagementDashboard;
