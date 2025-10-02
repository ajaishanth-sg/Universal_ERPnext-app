import React, { useState } from 'react';
import {
  Plane,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Car,
  Hotel,
  Users
} from 'lucide-react';

const TravelDeskDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showBookTravel, setShowBookTravel] = useState(false);
  const [travelBookings, setTravelBookings] = useState([
    {
      id: 1,
      employee: "Chairman",
      destination: "Monaco",
      purpose: "Racing Event",
      departure: "2024-05-20",
      return: "2024-05-28",
      status: "Confirmed",
      type: "Business",
      airline: "Emirates",
      hotel: "Hotel de Paris",
      transportation: "Private Car",
      cost: "$15,000",
      approvedBy: "Board"
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      destination: "London",
      purpose: "Business Meeting",
      departure: "2024-02-15",
      return: "2024-02-18",
      status: "Pending",
      type: "Business",
      airline: "British Airways",
      hotel: "The Ritz London",
      transportation: "Company Car",
      cost: "$8,500",
      approvedBy: null
    },
    {
      id: 3,
      employee: "Mohammed Hassan",
      destination: "Dubai",
      purpose: "Property Inspection",
      departure: "2024-01-25",
      return: "2024-01-27",
      status: "Confirmed",
      type: "Business",
      airline: "Oman Air",
      hotel: "Burj Al Arab",
      transportation: "Rental Car",
      cost: "$3,200",
      approvedBy: "Sarah Johnson"
    },
    {
      id: 4,
      employee: "David Wilson",
      destination: "Paris",
      purpose: "Family Vacation",
      departure: "2024-03-10",
      return: "2024-03-17",
      status: "Cancelled",
      type: "Personal",
      airline: "Air France",
      hotel: "Hotel Lutetia",
      transportation: "Taxi",
      cost: "$5,800",
      approvedBy: null
    }
  ]);

  const [newBooking, setNewBooking] = useState({
    employee: '',
    destination: '',
    purpose: '',
    departure: '',
    return: '',
    type: 'Business',
    airline: '',
    hotel: '',
    transportation: 'Company Car'
  });


  const filteredBookings = travelBookings.filter(booking => {
    const matchesSearch = booking.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus;
    const matchesType = filterType === 'all' || booking.type.toLowerCase() === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBookTravel = () => {
    setShowBookTravel(true);
  };

  const handleBookTravelSubmit = (e) => {
    e.preventDefault();
    const booking = {
      id: travelBookings.length + 1,
      employee: newBooking.employee,
      destination: newBooking.destination,
      purpose: newBooking.purpose,
      departure: newBooking.departure,
      return: newBooking.return,
      status: 'Pending',
      type: newBooking.type,
      airline: newBooking.airline,
      hotel: newBooking.hotel,
      transportation: newBooking.transportation,
      cost: 'TBD', // To be determined
      approvedBy: null
    };
    setTravelBookings(prev => [...prev, booking]);
    console.log('New travel booking:', booking);
    alert('Travel booking request submitted successfully!');
    setShowBookTravel(false);
    setNewBooking({
      employee: '',
      destination: '',
      purpose: '',
      departure: '',
      return: '',
      type: 'Business',
      airline: '',
      hotel: '',
      transportation: 'Company Car'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleViewBooking = (booking) => {
    // TODO: Implement view booking details
    alert(`View details for ${booking.employee}'s booking to ${booking.destination}`);
  };

  const handleEditBooking = (booking) => {
    // TODO: Implement edit booking functionality
    alert(`Edit booking: ${booking.employee} to ${booking.destination}`);
  };

  const handleCancelBooking = (booking) => {
    // TODO: Implement cancel booking functionality
    if (window.confirm(`Are you sure you want to cancel ${booking.employee}'s booking to ${booking.destination}?`)) {
      alert(`Cancel booking: ${booking.employee} to ${booking.destination}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Business':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {travelBookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Confirmed
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {travelBookings.filter(b => b.status === 'Confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {travelBookings.filter(b => b.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Business Travel
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {travelBookings.filter(b => b.type === 'Business').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search travel bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Travel Bookings List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Travel Bookings
          </h2>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(booking.status)}
                    <div>
                      <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                        {booking.employee} - {booking.destination}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {booking.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(booking.type)}`}>
                      {booking.type}
                    </span>
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditBooking(booking)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit Booking"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{booking.departure} - {booking.return}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Plane className="w-3 h-3" />
                    <span>{booking.airline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-3 h-3" />
                    <span>{booking.hotel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="w-3 h-3" />
                    <span>{booking.transportation}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Cost: {booking.cost}
                    {booking.approvedBy && ` • Approved by: ${booking.approvedBy}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <Plane className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No travel bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Book Travel Modal */}
      {showBookTravel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Book Travel</h2>
              <button
                onClick={() => setShowBookTravel(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBookTravelSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employee"
                    value={newBooking.employee}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={newBooking.destination}
                    onChange={handleInputChange}
                    placeholder="City/Country"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={newBooking.purpose}
                  onChange={handleInputChange}
                  placeholder="Business meeting, conference, etc."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    name="departure"
                    value={newBooking.departure}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="return"
                    value={newBooking.return}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Travel Type
                  </label>
                  <select
                    name="type"
                    value={newBooking.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Transportation
                  </label>
                  <select
                    name="transportation"
                    value={newBooking.transportation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="Company Car">Company Car</option>
                    <option value="Rental Car">Rental Car</option>
                    <option value="Private Car">Private Car</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Public Transport">Public Transport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Airline
                  </label>
                  <input
                    type="text"
                    name="airline"
                    value={newBooking.airline}
                    onChange={handleInputChange}
                    placeholder="Emirates, British Airways, etc."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Hotel
                  </label>
                  <input
                    type="text"
                    name="hotel"
                    value={newBooking.hotel}
                    onChange={handleInputChange}
                    placeholder="Hotel name or chain"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookTravel(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDeskDashboard;