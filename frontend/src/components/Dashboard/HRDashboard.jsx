import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Calendar, Clock, MapPin, Plane, Home, Car,
  CheckCircle, AlertCircle, Plus, Eye, Edit, Trash2, Search,
  Filter, MoreHorizontal, RefreshCw, ArrowLeft, X, Save,
  FileText, Upload, Download, Bell, Settings, ChevronDown,
  Building, Globe, Phone, Mail, CreditCard, Briefcase
} from 'lucide-react';

// Employee Form Component
const EmployeeForm = ({ employee = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(employee || {
    name: '',
    employeeId: '',
    designation: '',
    department: '',
    location: '',
    country: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    salary: '',
    bankAccount: '',
    contractStart: '',
    contractEnd: '',
    reportingManager: '',
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: employee?.id || Date.now(),
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation *
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Financial">Financial</option>
                <option value="PA to Chairman">PA to Chairman</option>
                <option value="House Management">House Management</option>
                <option value="Fleet Management">Fleet Management</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Location</option>
                <option value="Muscat">Muscat</option>
                <option value="Dubai">Dubai</option>
                <option value="London">London</option>
                <option value="Monaco">Monaco</option>
                <option value="Abroad">Abroad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Start Date
              </label>
              <input
                type="date"
                value={formData.contractStart}
                onChange={(e) => setFormData({...formData, contractStart: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Leave Request Form Component
const LeaveRequestForm = ({ request = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(request || {
    employee: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    onSave({
      ...formData,
      id: request?.id || Date.now(),
      days
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {request ? 'Edit Leave Request' : 'New Leave Request'}
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee *
              </label>
              <input
                type="text"
                value={formData.employee}
                onChange={(e) => setFormData({...formData, employee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Travel Request Form Component
const TravelRequestForm = ({ request = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState(request || {
    employee: '',
    destination: '',
    purpose: '',
    departure: '',
    return: '',
    type: 'Business',
    flightRequired: false,
    hotelRequired: false,
    visaRequired: false,
    status: 'Pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: request?.id || Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {request ? 'Edit Travel Request' : 'New Travel Request'}
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee *
              </label>
              <input
                type="text"
                value={formData.employee}
                onChange={(e) => setFormData({...formData, employee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Business">Business</option>
                <option value="Transfer">Transfer</option>
                <option value="Training">Training</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date *
              </label>
              <input
                type="date"
                value={formData.departure}
                onChange={(e) => setFormData({...formData, departure: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date *
              </label>
              <input
                type="date"
                value={formData.return}
                onChange={(e) => setFormData({...formData, return: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Services Required</label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.flightRequired}
                  onChange={(e) => setFormData({...formData, flightRequired: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Flight Booking</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hotelRequired}
                  onChange={(e) => setFormData({...formData, hotelRequired: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Hotel Booking</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.visaRequired}
                  onChange={(e) => setFormData({...formData, visaRequired: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Visa Assistance</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee Management Page
const EmployeeManagement = ({ employees, onAddEmployee, onEditEmployee, onDeleteEmployee }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const filteredEmployees = employees.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === '' || employee.department === filterDepartment) &&
      (filterLocation === '' || employee.location === filterLocation)
    );
  });

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      onEditEmployee(employeeData);
    } else {
      onAddEmployee(employeeData);
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage staff across multiple properties</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="Financial">Financial</option>
            <option value="PA to Chairman">PA to Chairman</option>
            <option value="House Management">House Management</option>
            <option value="Fleet Management">Fleet Management</option>
          </select>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option value="Muscat">Muscat</option>
            <option value="Dubai">Dubai</option>
            <option value="London">London</option>
            <option value="Abroad">Abroad</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Employee Directory */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Employee Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {employee.avatar}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.designation || employee.position}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.employeeId || `EMP-${employee.id}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      {employee.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEmployee(employee);
                          setShowForm(true);
                        }}
                        className="p-1 text-gray-600 hover:text-green-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(employee.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
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

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

// Leave Management Page
const LeaveManagement = ({ leaveRequests, onAddRequest, onEditRequest, onDeleteRequest, onApproveRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleSaveRequest = (requestData) => {
    if (editingRequest) {
      onEditRequest(requestData);
    } else {
      onAddRequest(requestData);
    }
    setShowForm(false);
    setEditingRequest(null);
  };

  const handleApprove = (requestId, status) => {
    onApproveRequest(requestId, status);
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'Approved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Handle leave requests and approvals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Leave Request</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.filter(req => req.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
        </div>
        <div className="p-4 space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{request.employee}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {request.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{request.startDate} - {request.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{request.days} days</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-900">{request.type}</span>
                      <p className="text-gray-500 mt-1">{request.reason}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(request.id, 'Approved')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(request.id, 'Rejected')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <p className="text-center text-gray-500 py-8">No pending requests</p>
          )}
        </div>
      </div>

      {/* All Leave Requests */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.startDate} - {request.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRequest(request);
                          setShowForm(true);
                        }}
                        className="p-1 text-gray-600 hover:text-green-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(request.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
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

      {showForm && (
        <LeaveRequestForm
          request={editingRequest}
          onSave={handleSaveRequest}
          onCancel={() => {
            setShowForm(false);
            setEditingRequest(null);
          }}
        />
      )}
    </div>
  );
};

// Travel Desk Page
const TravelDesk = ({ travelRequests, onAddRequest, onEditRequest, onDeleteRequest }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const handleSaveRequest = (requestData) => {
    if (editingRequest) {
      onEditRequest(requestData);
    } else {
      onAddRequest(requestData);
    }
    setShowForm(false);
    setEditingRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Travel Desk</h2>
          <p className="text-gray-600">Manage travel requests and bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plane className="w-4 h-4" />
            <span>New Travel Request</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Plane className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{travelRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {travelRequests.filter(req => req.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {travelRequests.filter(req => req.status === 'Confirmed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(travelRequests.map(req => req.destination)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Requests Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Travel Requests</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelRequests.map((request) => (
              <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">{request.employee}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{request.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {request.departure} - {request.return}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{request.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{request.purpose}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-600 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingRequest(request);
                        setShowForm(true);
                      }}
                      className="p-1 text-gray-600 hover:text-green-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(request.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {request.status === 'Pending' && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Process
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {travelRequests.length === 0 && (
            <div className="text-center py-12">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Travel Requests</h3>
              <p className="text-gray-500">Get started by creating your first travel request</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <TravelRequestForm
          request={editingRequest}
          onSave={handleSaveRequest}
          onCancel={() => {
            setShowForm(false);
            setEditingRequest(null);
          }}
        />
      )}
    </div>
  );
};

// Main HR Dashboard Component
const HRDashboard = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showOfficeSupportModal, setShowOfficeSupportModal] = useState(false);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Sample data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      position: "Senior Accountant",
      designation: "Senior Accountant",
      department: "Financial",
      status: "Active",
      location: "Muscat",
      joinDate: "2022-03-15",
      avatar: "AA",
      employeeId: "EMP001"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Executive Assistant",
      designation: "Executive Assistant",
      department: "PA to Chairman",
      status: "Active",
      location: "Abroad",
      joinDate: "2021-08-20",
      avatar: "SJ",
      employeeId: "EMP002"
    },
    {
      id: 3,
      name: "Mohammed Hassan",
      position: "House Manager",
      designation: "House Manager",
      department: "House Management",
      status: "Active",
      location: "Muscat",
      joinDate: "2020-11-10",
      avatar: "MH",
      employeeId: "EMP003"
    },
    {
      id: 4,
      name: "David Wilson",
      position: "Fleet Manager",
      designation: "Fleet Manager",
      department: "Fleet Management",
      status: "On Leave",
      location: "Abroad",
      joinDate: "2023-01-05",
      avatar: "DW",
      employeeId: "EMP004"
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: "David Wilson",
      type: "Annual Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      days: 5,
      status: "Approved",
      reason: "Family vacation"
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      type: "Sick Leave",
      startDate: "2024-01-18",
      endDate: "2024-01-19",
      days: 2,
      status: "Pending",
      reason: "Medical appointment"
    },
    {
      id: 3,
      employee: "Ahmed Al-Rashid",
      type: "Personal Leave",
      startDate: "2024-01-22",
      endDate: "2024-01-22",
      days: 1,
      status: "Approved",
      reason: "Personal matters"
    }
  ]);

  const [travelRequests, setTravelRequests] = useState([
    {
      id: 1,
      employee: "Chairman",
      destination: "Monaco",
      purpose: "Racing Event",
      departure: "2024-05-20",
      return: "2024-05-28",
      status: "Confirmed",
      type: "Business"
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      destination: "London",
      purpose: "Business Meeting",
      departure: "2024-02-15",
      return: "2024-02-18",
      status: "Pending",
      type: "Business"
    },
    {
      id: 3,
      employee: "Mohammed Hassan",
      destination: "Dubai",
      purpose: "Property Inspection",
      departure: "2024-01-25",
      return: "2024-01-27",
      status: "Confirmed",
      type: "Business"
    }
  ]);

  // CRUD Operations
  const handleAddEmployee = (employeeData) => {
    setEmployees([...employees, employeeData]);
  };

  const handleEditEmployee = (employeeData) => {
    setEmployees(employees.map(emp => emp.id === employeeData.id ? employeeData : emp));
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  const handleAddLeaveRequest = (requestData) => {
    setLeaveRequests([...leaveRequests, requestData]);
  };

  const handleEditLeaveRequest = (requestData) => {
    setLeaveRequests(leaveRequests.map(req => req.id === requestData.id ? requestData : req));
  };

  const handleDeleteLeaveRequest = (requestId) => {
    setLeaveRequests(leaveRequests.filter(req => req.id !== requestId));
  };

  const handleApproveLeaveRequest = (requestId, status) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === requestId ? { ...req, status } : req
    ));
  };

  const handleAddTravelRequest = (requestData) => {
    setTravelRequests([...travelRequests, requestData]);
  };

  const handleEditTravelRequest = (requestData) => {
    setTravelRequests(travelRequests.map(req => req.id === requestData.id ? requestData : req));
  };

  const handleDeleteTravelRequest = (requestId) => {
    setTravelRequests(travelRequests.filter(req => req.id !== requestId));
  };

  const hrStats = [
    {
      title: "Total Employees",
      value: employees.length.toString(),
      change: "+3",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Leave",
      value: leaveRequests.filter(req => req.status === 'Approved').length.toString(),
      change: "-2",
      icon: Calendar,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Travel Bookings",
      value: travelRequests.length.toString(),
      change: "+4",
      icon: Plane,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Office Support",
      value: "8",
      change: "+1",
      icon: Home,
      color: "from-orange-500 to-red-600"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'employees', label: 'Employee Management' },
    { id: 'leave', label: 'Leave Management' },
    { id: 'travel', label: 'Travel Desk' },
    { id: 'office-support', label: 'Office Support' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <EmployeeManagement
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );
      case 'leave':
        return (
          <LeaveManagement
            leaveRequests={leaveRequests}
            onAddRequest={handleAddLeaveRequest}
            onEditRequest={handleEditLeaveRequest}
            onDeleteRequest={handleDeleteLeaveRequest}
            onApproveRequest={handleApproveLeaveRequest}
          />
        );
      case 'travel':
        return (
          <TravelDesk
            travelRequests={travelRequests}
            onAddRequest={handleAddTravelRequest}
            onEditRequest={handleEditTravelRequest}
            onDeleteRequest={handleDeleteTravelRequest}
          />
        );
      case 'office-support':
        return (
          <div className="space-y-6">
            {/* Office Support Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Office Support Services</h2>
              <p className="text-gray-600 mb-6">Access various office support services and request assistance.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">IT Support</h4>
                      <p className="text-sm text-gray-500">Technical assistance</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Maintenance</h4>
                      <p className="text-sm text-gray-500">Facility repairs</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Communications</h4>
                      <p className="text-sm text-gray-500">Phone & internet</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Facilities</h4>
                      <p className="text-sm text-gray-500">Office supplies</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Mail Services</h4>
                      <p className="text-sm text-gray-500">Courier & postage</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Security</h4>
                      <p className="text-sm text-gray-500">Access & safety</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hrStats.map((stat, index) => {
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
              {/* Employee Overview */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Employees
                  </h2>
                  <button 
                    onClick={() => setActiveTab('employees')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {employees.slice(0, 3).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {employee.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.position} • {employee.department}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave Overview */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Leave Requests
                  </h2>
                  <button 
                    onClick={() => setActiveTab('leave')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {leaveRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {request.employee}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{request.type} • {request.days} days</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('employees')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  <UserPlus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Add Employee</p>
                </button>
                <button 
                  onClick={() => setActiveTab('leave')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Process Leave</p>
                </button>
                <button 
                  onClick={() => setActiveTab('travel')}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  <Plane className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Book Travel</p>
                </button>
                <button
                  onClick={() => setShowOfficeSupportModal(true)}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  <Home className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Office Support</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 text-black min-h-screen">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-lg">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Main Content */}
      {renderContent()}

      {/* Office Support Modal */}
      {showOfficeSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Office Support Services</h3>
              <button onClick={() => setShowOfficeSupportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">IT Support</h4>
                    <p className="text-sm text-gray-500">Technical assistance</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Maintenance</h4>
                    <p className="text-sm text-gray-500">Facility repairs</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Communications</h4>
                    <p className="text-sm text-gray-500">Phone & internet</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Facilities</h4>
                    <p className="text-sm text-gray-500">Office supplies</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mail Services</h4>
                    <p className="text-sm text-gray-500">Courier & postage</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Security</h4>
                    <p className="text-sm text-gray-500">Access & safety</p>
                  </div>
                </div>
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Emergency Contact</h4>
                  <p className="text-sm text-gray-500">For urgent office support needs</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Call Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;