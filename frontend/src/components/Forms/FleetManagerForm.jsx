import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Filter,
  X,
  Search,
  ChevronDown,
  FileText,
  Eye,
  Edit,
  Trash2,
  Car,
  Users,
  Wrench,
  Calendar,
  Fuel,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const FleetManagerForm = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [showNewDriver, setShowNewDriver] = useState(false);
  const [showSchedulePM, setShowSchedulePM] = useState(false);
  const [showScheduleCM, setShowScheduleCM] = useState(false);

  // Dashboard data states
  const [vehicles, setVehicles] = useState([
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
      nextPM: "2024-02-15",
      lastCM: "2024-01-10",
      fuelEfficiency: "12.5 km/L",
      insuranceExpiry: "2024-12-31"
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
      nextPM: "2024-01-25",
      lastCM: "2024-01-05",
      fuelEfficiency: "11.8 km/L",
      insuranceExpiry: "2024-11-30"
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
      nextPM: "2024-01-20",
      lastCM: "2023-12-15",
      fuelEfficiency: "13.2 km/L",
      insuranceExpiry: "2024-10-15"
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
      nextPM: "2024-02-10",
      lastCM: "2024-01-08",
      fuelEfficiency: "10.5 km/L",
      insuranceExpiry: "2024-09-30"
    }
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      license: "Valid",
      experience: "8 years",
      status: "Active",
      assignedVehicle: "Mercedes S-Class",
      location: "Muscat",
      performance: "Excellent",
      lastMedical: "2024-01-10",
      licenseExpiry: "2025-06-30"
    },
    {
      id: 2,
      name: "James Wilson",
      license: "Valid",
      experience: "12 years",
      status: "Active",
      assignedVehicle: "BMW 7 Series",
      location: "London",
      performance: "Good",
      lastMedical: "2024-01-08",
      licenseExpiry: "2025-04-15"
    },
    {
      id: 3,
      name: "Mohammed Hassan",
      license: "Valid",
      experience: "5 years",
      status: "Active",
      assignedVehicle: "Range Rover",
      location: "Muscat",
      performance: "Good",
      lastMedical: "2024-01-05",
      licenseExpiry: "2025-08-20"
    },
    {
      id: 4,
      name: "David Smith",
      license: "Expired",
      experience: "3 years",
      status: "Inactive",
      assignedVehicle: "None",
      location: "Monaco",
      performance: "Needs Review",
      lastMedical: "2023-11-20",
      licenseExpiry: "2024-01-15"
    }
  ]);

  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    {
      id: 1,
      vehicle: "Mercedes S-Class",
      type: "Preventive Maintenance",
      scheduledDate: "2024-02-15",
      status: "Scheduled",
      cost: "$800",
      description: "Oil change, filter replacement, brake check",
      priority: "Medium"
    },
    {
      id: 2,
      vehicle: "BMW 7 Series",
      type: "Corrective Maintenance",
      scheduledDate: "2024-01-25",
      status: "In Progress",
      cost: "$1,200",
      description: "Brake pad and rotor replacement",
      priority: "High"
    },
    {
      id: 3,
      vehicle: "Audi A8",
      type: "Preventive Maintenance",
      scheduledDate: "2024-01-20",
      status: "Completed",
      cost: "$600",
      description: "Engine diagnostic and minor repairs",
      priority: "Low"
    }
  ]);

  // Form states
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    location: 'Muscat',
    fuelEfficiency: '',
    insuranceExpiry: ''
  });

  const [newDriver, setNewDriver] = useState({
    name: '',
    license: 'Valid',
    experience: '',
    location: 'Muscat',
    licenseExpiry: '',
    performance: 'Good'
  });

  const [newPM, setNewPM] = useState({
    vehicle: '',
    scheduledDate: '',
    cost: '',
    description: '',
    priority: 'Medium'
  });

  const [newCM, setNewCM] = useState({
    vehicle: '',
    scheduledDate: '',
    cost: '',
    description: '',
    priority: 'High'
  });


  const tabs = [
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Handler functions
  const handleNewVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: vehicles.length + 1,
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year,
      plate: newVehicle.plate,
      status: 'Active',
      driver: 'Unassigned',
      location: newVehicle.location,
      mileage: '0 km',
      nextPM: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months from now
      lastCM: 'Never',
      fuelEfficiency: newVehicle.fuelEfficiency,
      insuranceExpiry: newVehicle.insuranceExpiry
    };
    setVehicles(prev => [...prev, vehicle]);
    console.log('New vehicle added:', vehicle);
    alert('Vehicle added successfully!');
    setShowNewVehicle(false);
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      plate: '',
      location: 'Muscat',
      fuelEfficiency: '',
      insuranceExpiry: ''
    });
  };

  const handleNewDriver = (e) => {
    e.preventDefault();
    const driver = {
      id: drivers.length + 1,
      name: newDriver.name,
      license: newDriver.license,
      experience: newDriver.experience,
      status: 'Active',
      assignedVehicle: 'None',
      location: newDriver.location,
      performance: newDriver.performance,
      lastMedical: new Date().toISOString().split('T')[0],
      licenseExpiry: newDriver.licenseExpiry
    };
    setDrivers(prev => [...prev, driver]);
    console.log('New driver added:', driver);
    alert('Driver added successfully!');
    setShowNewDriver(false);
    setNewDriver({
      name: '',
      license: 'Valid',
      experience: '',
      location: 'Muscat',
      licenseExpiry: '',
      performance: 'Good'
    });
  };

  const handleSchedulePM = (e) => {
    e.preventDefault();
    const pm = {
      id: maintenanceSchedule.length + 1,
      vehicle: newPM.vehicle,
      type: 'Preventive Maintenance',
      scheduledDate: newPM.scheduledDate,
      status: 'Scheduled',
      cost: newPM.cost,
      description: newPM.description,
      priority: newPM.priority
    };
    setMaintenanceSchedule(prev => [...prev, pm]);
    console.log('PM scheduled:', pm);
    alert('Preventive maintenance scheduled successfully!');
    setShowSchedulePM(false);
    setNewPM({
      vehicle: '',
      scheduledDate: '',
      cost: '',
      description: '',
      priority: 'Medium'
    });
  };

  const handleScheduleCM = (e) => {
    e.preventDefault();
    const cm = {
      id: maintenanceSchedule.length + 1,
      vehicle: newCM.vehicle,
      type: 'Corrective Maintenance',
      scheduledDate: newCM.scheduledDate,
      status: 'Scheduled',
      cost: newCM.cost,
      description: newCM.description,
      priority: newCM.priority
    };
    setMaintenanceSchedule(prev => [...prev, cm]);
    console.log('CM scheduled:', cm);
    alert('Corrective maintenance scheduled successfully!');
    setShowScheduleCM(false);
    setNewCM({
      vehicle: '',
      scheduledDate: '',
      cost: '',
      description: '',
      priority: 'High'
    });
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'vehicle') {
      setNewVehicle(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'driver') {
      setNewDriver(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'pm') {
      setNewPM(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'cm') {
      setNewCM(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Fleet Manager</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewVehicle(true)}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
                <button
                  onClick={() => setShowNewDriver(true)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Add Driver</span>
                </button>
                <button
                  onClick={() => setShowSchedulePM(true)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Schedule PM</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Fleet Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Vehicles:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Drivers:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PM Due This Month:</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Fuel Efficiency:</span>
                  <span className="font-medium">12.0 km/L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'vehicles' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Vehicle Fleet</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                      <button
                        onClick={() => setShowNewVehicle(true)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Vehicle</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next PM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vehicle.year} • {vehicle.plate}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vehicle.driver}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {vehicle.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {vehicle.mileage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {vehicle.nextPM}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-red-600">
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
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Driver Management</h2>
                    <button
                      onClick={() => setShowNewDriver(true)}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Driver</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{driver.name}</h3>
                          <p className="text-xs text-gray-600">{driver.assignedVehicle} • {driver.location}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{driver.experience}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">License:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.license)}`}>
                            {driver.license}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Performance:</span>
                          <span className="font-medium text-green-600">{driver.performance}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">License Expiry:</span>
                          <span className="font-medium">{driver.licenseExpiry}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowSchedulePM(true)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Schedule PM</span>
                      </button>
                      <button
                        onClick={() => setShowScheduleCM(true)}
                        className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>Schedule CM</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {maintenanceSchedule.map((maintenance) => (
                      <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-gray-900">{maintenance.vehicle}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(maintenance.status)}`}>
                            {maintenance.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
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
                        </div>

                        <div className="mb-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                            {maintenance.priority} Priority
                          </span>
                        </div>

                        <p className="text-xs text-gray-500">{maintenance.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Vehicle Modal */}
      {showNewVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New Vehicle</h2>
              <button
                onClick={() => setShowNewVehicle(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleNewVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    name="make"
                    value={newVehicle.make}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    placeholder="e.g., Mercedes-Benz"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={newVehicle.model}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    placeholder="e.g., S-Class"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={newVehicle.year}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    placeholder="2024"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="plate"
                    value={newVehicle.plate}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    placeholder="MUS-001"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={newVehicle.location}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Muscat">Muscat</option>
                    <option value="London">London</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fuel Efficiency
                  </label>
                  <input
                    type="text"
                    name="fuelEfficiency"
                    value={newVehicle.fuelEfficiency}
                    onChange={(e) => handleInputChange(e, 'vehicle')}
                    placeholder="12.5 km/L"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={newVehicle.insuranceExpiry}
                  onChange={(e) => handleInputChange(e, 'vehicle')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewVehicle(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Driver Modal */}
      {showNewDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New Driver</h2>
              <button
                onClick={() => setShowNewDriver(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleNewDriver} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={(e) => handleInputChange(e, 'driver')}
                  placeholder="Driver's full name"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    License Status
                  </label>
                  <select
                    name="license"
                    value={newDriver.license}
                    onChange={(e) => handleInputChange(e, 'driver')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={newDriver.experience}
                    onChange={(e) => handleInputChange(e, 'driver')}
                    placeholder="5 years"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={newDriver.location}
                    onChange={(e) => handleInputChange(e, 'driver')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Muscat">Muscat</option>
                    <option value="London">London</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Performance
                  </label>
                  <select
                    name="performance"
                    value={newDriver.performance}
                    onChange={(e) => handleInputChange(e, 'driver')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Needs Review">Needs Review</option>
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={newDriver.licenseExpiry}
                  onChange={(e) => handleInputChange(e, 'driver')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewDriver(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule PM Modal */}
      {showSchedulePM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Schedule Preventive Maintenance</h2>
              <button
                onClick={() => setShowSchedulePM(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSchedulePM} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vehicle
                </label>
                <select
                  name="vehicle"
                  value={newPM.vehicle}
                  onChange={(e) => handleInputChange(e, 'pm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={`${vehicle.make} ${vehicle.model}`}>
                      {vehicle.make} {vehicle.model} ({vehicle.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={newPM.scheduledDate}
                  onChange={(e) => handleInputChange(e, 'pm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Cost
                </label>
                <input
                  type="text"
                  name="cost"
                  value={newPM.cost}
                  onChange={(e) => handleInputChange(e, 'pm')}
                  placeholder="$800"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newPM.priority}
                  onChange={(e) => handleInputChange(e, 'pm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newPM.description}
                  onChange={(e) => handleInputChange(e, 'pm')}
                  rows={3}
                  placeholder="Oil change, filter replacement, brake check..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSchedulePM(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule PM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule CM Modal */}
      {showScheduleCM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Schedule Corrective Maintenance</h2>
              <button
                onClick={() => setShowScheduleCM(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleScheduleCM} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vehicle
                </label>
                <select
                  name="vehicle"
                  value={newCM.vehicle}
                  onChange={(e) => handleInputChange(e, 'cm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={`${vehicle.make} ${vehicle.model}`}>
                      {vehicle.make} {vehicle.model} ({vehicle.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={newCM.scheduledDate}
                  onChange={(e) => handleInputChange(e, 'cm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Cost
                </label>
                <input
                  type="text"
                  name="cost"
                  value={newCM.cost}
                  onChange={(e) => handleInputChange(e, 'cm')}
                  placeholder="$1,200"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={newCM.priority}
                  onChange={(e) => handleInputChange(e, 'cm')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newCM.description}
                  onChange={(e) => handleInputChange(e, 'cm')}
                  rows={3}
                  placeholder="Brake pad and rotor replacement..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleCM(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Schedule CM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagerForm;