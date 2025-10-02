import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plane,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  Car,
  Hotel,
  CreditCard,
  FileText,
  Download,
  Upload,
  MoreVertical,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Clock4,
  Route,
  Globe
} from 'lucide-react';

const TravelCoordinationDashboard = ({ onBack }) => {
  // Mock data for drivers
  const drivers = [
    { id: 1, name: "Ahmed Al-Rashid", role: "Lead Driver" },
    { id: 2, name: "James Wilson", role: "Driver" },
    { id: 3, name: "Maria Rodriguez", role: "Reserve Driver" },
    { id: 4, name: "David Smith", role: "Team Principal" },
    { id: 5, name: "Sarah Johnson", role: "Race Engineer" },
    { id: 6, name: "Pierre Dubois", role: "Mechanic" }
  ];

  // State for travel trips
  const [travelTrips, setTravelTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
const [showMenu, setShowMenu] = useState(null);
const [showViewTrip, setShowViewTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: '',
    type: 'Race Event',
    destination: '',
    departureLocation: '',
    startDate: '',
    endDate: '',
    travelers: [],
    transport: {
      outbound: {
        type: 'Flight',
        airline: '',
        flightNumber: '',
        departure: '',
        arrival: '',
        date: ''
      },
      return: {
        type: 'Flight',
        airline: '',
        flightNumber: '',
        departure: '',
        arrival: '',
        date: ''
      }
    },
    accommodation: {
      hotel: '',
      checkIn: '',
      checkOut: '',
      rooms: '',
      cost: ''
    },
    estimatedCost: '',
    purpose: '',
    notes: ''
  });

  // Fetch travel trips from backend
  useEffect(() => {
    fetchTravelTrips();
  }, []);

  const fetchTravelTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/travel-trips');
      setTravelTrips(response.data);
    } catch (err) {
      console.error('Error fetching travel trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Race Event':
        return Navigation;
      case 'Testing':
        return Route;
      case 'Business':
        return FileText;
      case 'Logistics':
        return Car;
      default:
        return Plane;
    }
  };

  // CRUD functions
  const handleAddTrip = async () => {
    try {
      const trip = {
        ...newTrip,
        status: 'Pending Approval',
        travelers: newTrip.travelers.map(name => ({
          name,
          role: drivers.find(d => d.name === name)?.role || 'Team Member',
          status: 'Pending'
        })),
        estimatedCost: parseFloat(newTrip.estimatedCost) || 0,
        accommodation: {
          ...newTrip.accommodation,
          cost: parseFloat(newTrip.accommodation.cost) || 0,
          rooms: parseInt(newTrip.accommodation.rooms) || 0
        },
        createdBy: 'Travel Coordinator',
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post('http://localhost:5000/api/travel-trips', trip);
      setTravelTrips([...travelTrips, response.data]);

      setNewTrip({
        title: '',
        type: 'Race Event',
        destination: '',
        departureLocation: '',
        startDate: '',
        endDate: '',
        travelers: [],
        transport: {
          outbound: {
            type: 'Flight',
            airline: '',
            flightNumber: '',
            departure: '',
            arrival: '',
            date: ''
          },
          return: {
            type: 'Flight',
            airline: '',
            flightNumber: '',
            departure: '',
            arrival: '',
            date: ''
          }
        },
        accommodation: {
          hotel: '',
          checkIn: '',
          checkOut: '',
          rooms: '',
          cost: ''
        },
        estimatedCost: '',
        purpose: '',
        notes: ''
      });
      setShowAddTrip(false);
    } catch (err) {
      console.error('Error adding travel trip:', err);
      alert('Failed to add travel trip. Please try again.');
    }
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setNewTrip({
      title: trip.title,
      type: trip.type,
      destination: trip.destination,
      departureLocation: trip.departureLocation,
      startDate: trip.startDate,
      endDate: trip.endDate,
      travelers: trip.travelers.map(t => t.name),
      transport: trip.transport,
      accommodation: trip.accommodation,
      estimatedCost: trip.estimatedCost,
      purpose: trip.purpose,
      notes: trip.notes
    });
    setShowEditTrip(true);
  };

  const handleUpdateTrip = async () => {
    try {
      const updatedTrip = {
        ...selectedTrip,
        ...newTrip,
        travelers: newTrip.travelers.map(name => ({
          name,
          role: drivers.find(d => d.name === name)?.role || 'Team Member',
          status: 'Confirmed'
        })),
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      const response = await axios.put(`http://localhost:5000/api/travel-trips/${selectedTrip.id}`, updatedTrip);
      setTravelTrips(travelTrips.map(t => t.id === selectedTrip.id ? response.data : t));
      setShowEditTrip(false);
      setSelectedTrip(null);
      setNewTrip({
        title: '',
        type: 'Race Event',
        destination: '',
        departureLocation: '',
        startDate: '',
        endDate: '',
        travelers: [],
        transport: {
          outbound: {
            type: 'Flight',
            airline: '',
            flightNumber: '',
            departure: '',
            arrival: '',
            date: ''
          },
          return: {
            type: 'Flight',
            airline: '',
            flightNumber: '',
            departure: '',
            arrival: '',
            date: ''
          }
        },
        accommodation: {
          hotel: '',
          checkIn: '',
          checkOut: '',
          rooms: '',
          cost: ''
        },
        estimatedCost: '',
        purpose: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error updating travel trip:', err);
      alert('Failed to update travel trip. Please try again.');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`http://localhost:5000/api/travel-trips/${id}`);
        setTravelTrips(travelTrips.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error deleting travel trip:', err);
        alert('Failed to delete travel trip. Please try again.');
      }
    }
  };

  // Filtering logic
  const filteredTrips = travelTrips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesType = filterType === 'all' || trip.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats calculation
  const travelStats = [
    {
      title: "Total Trips",
      value: travelTrips.length,
      icon: Plane,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Confirmed Trips",
      value: travelTrips.filter(t => t.status === 'Confirmed').length,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "In Progress",
      value: travelTrips.filter(t => t.status === 'In Progress').length,
      icon: Clock4,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Total Cost",
      value: `$${travelTrips.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0).toLocaleString()}`,
      icon: CreditCard,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const tripTypes = ['all', 'Race Event', 'Testing', 'Business', 'Logistics'];

  // Render
  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <p className="text-gray-600 mt-1">
              Manage travel trips and logistics for racing events
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddTrip(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Travel Trip</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {travelStats.map((stat, index) => {
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

      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips by title, destination, or type..."
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
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                {tripTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading travel trips...</div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No travel trips found
            </h3>
            <p className="text-gray-500 mb-4">Get started by creating your first travel trip</p>
            <button
              onClick={() => setShowAddTrip(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Travel Trip
            </button>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const TypeIcon = getTypeIcon(trip.type);
            return (
              <div key={trip.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {trip.type} • {trip.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === trip.id ? null : trip.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showMenu === trip.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSelectedTrip(trip);
                                setShowViewTrip(true);
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleEditTrip(trip);
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Trip
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteTrip(trip.id);
                                setShowMenu(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Trip
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-black">{trip.startDate} - {trip.endDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Travelers:</span>
                    <span className="text-black">{trip.travelers.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Cost:</span>
                    <span className="text-black">${trip.actualCost || trip.estimatedCost}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>Transport: {trip.transport.outbound.airline} {trip.transport.outbound.flightNumber}</span>
                      <span className="mx-2">•</span>
                      <span>Hotel: {trip.accommodation.hotel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Trip Modal */}
      {showAddTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Add New Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Title *
                </label>
                <input
                  type="text"
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Monaco Grand Prix 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newTrip.type}
                  onChange={(e) => setNewTrip({...newTrip, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Race Event">Race Event</option>
                  <option value="Testing">Testing</option>
                  <option value="Business">Business</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Location *
                </label>
                <input
                  type="text"
                  value={newTrip.departureLocation}
                  onChange={(e) => setNewTrip({...newTrip, departureLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newTrip.startDate}
                  onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newTrip.endDate}
                  onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={newTrip.estimatedCost}
                  onChange={(e) => setNewTrip({...newTrip, estimatedCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="45000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  value={newTrip.purpose}
                  onChange={(e) => setNewTrip({...newTrip, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Purpose of the trip"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newTrip.notes}
                  onChange={(e) => setNewTrip({...newTrip, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTrip(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrip}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {showEditTrip && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Title *
                </label>
                <input
                  type="text"
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Monaco Grand Prix 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newTrip.type}
                  onChange={(e) => setNewTrip({...newTrip, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Race Event">Race Event</option>
                  <option value="Testing">Testing</option>
                  <option value="Business">Business</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Location *
                </label>
                <input
                  type="text"
                  value={newTrip.departureLocation}
                  onChange={(e) => setNewTrip({...newTrip, departureLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newTrip.startDate}
                  onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newTrip.endDate}
                  onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={newTrip.estimatedCost}
                  onChange={(e) => setNewTrip({...newTrip, estimatedCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="45000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  value={newTrip.purpose}
                  onChange={(e) => setNewTrip({...newTrip, purpose: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Purpose of the trip"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newTrip.notes}
                  onChange={(e) => setNewTrip({...newTrip, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  rows={2}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditTrip(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTrip}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Trip Modal */}
      {showViewTrip && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Trip Details</h2>
              <button
                onClick={() => setShowViewTrip(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Title
                </label>
                <p className="text-black">{selectedTrip.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <p className="text-black">{selectedTrip.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <p className="text-black">{selectedTrip.destination}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Location
                </label>
                <p className="text-black">{selectedTrip.departureLocation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <p className="text-black">{selectedTrip.startDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <p className="text-black">{selectedTrip.endDate}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost ($)
                </label>
                <p className="text-black">{selectedTrip.estimatedCost}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <p className="text-black">{selectedTrip.purpose}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <p className="text-black">{selectedTrip.notes}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <p className="text-black">{selectedTrip.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created By
                </label>
                <p className="text-black">{selectedTrip.createdBy}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewTrip(false)}
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

export default TravelCoordinationDashboard;