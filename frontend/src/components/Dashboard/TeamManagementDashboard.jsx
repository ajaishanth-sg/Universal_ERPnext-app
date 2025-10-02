import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Star,
  TrendingUp,
  Clock,
  Settings,
  FileText,
  Download,
  Upload,
  MoreVertical,
  Shield,
  Target,
  Trophy,
  Activity,
  UserCheck,
  UserX
} from 'lucide-react';

const TeamManagementDashboard = ({ onBack }) => {
  // State for team members
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from backend
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/team-members');
      setTeamMembers(response.data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Driver',
    status: 'Active',
    location: '',
    phone: '',
    email: '',
    joinDate: '',
    experience: '',
    salary: '',
    contractExpiry: '',
    specializations: '',
    certifications: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Injured':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Needs Improvement':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Lead Driver':
        return Trophy;
      case 'Driver':
        return Target;
      case 'Team Principal':
        return Shield;
      case 'Race Engineer':
        return Settings;
      case 'Mechanic':
        return Activity;
      default:
        return Users;
    }
  };

  // CRUD functions
  const handleAddMember = async () => {
    try {
      const member = {
        ...newMember,
        performance: 'Good',
        rating: 4.0,
        racesCompleted: 0,
        wins: 0,
        podiums: 0,
        championshipPoints: 0,
        specializations: newMember.specializations.split(',').map(s => s.trim()),
        certifications: newMember.certifications.split(',').map(c => c.trim())
      };

      const response = await axios.post('http://localhost:5000/api/team-members', member);
      setTeamMembers([...teamMembers, response.data]);

      setNewMember({
        name: '',
        role: 'Driver',
        status: 'Active',
        location: '',
        phone: '',
        email: '',
        joinDate: '',
        experience: '',
        salary: '',
        contractExpiry: '',
        specializations: '',
        certifications: '',
        emergencyContact: {
          name: '',
          phone: '',
          relation: ''
        }
      });
      setShowAddMember(false);
    } catch (err) {
      console.error('Error adding team member:', err);
      alert('Failed to add team member. Please try again.');
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      status: member.status,
      location: member.location,
      phone: member.phone,
      email: member.email,
      joinDate: member.joinDate,
      experience: member.experience,
      salary: member.salary,
      contractExpiry: member.contractExpiry,
      specializations: member.specializations.join(', '),
      certifications: member.certifications.join(', '),
      emergencyContact: member.emergencyContact
    });
    setShowEditMember(true);
  };

  const handleUpdateMember = async () => {
    try {
      const updatedMember = {
        ...selectedMember,
        ...newMember,
        specializations: newMember.specializations.split(',').map(s => s.trim()),
        certifications: newMember.certifications.split(',').map(c => c.trim())
      };

      const originalMember = teamMembers.find(m => m.name === selectedMember.name && m.email === selectedMember.email);
      if (!originalMember) {
        alert('Member not found');
        return;
      }

      const id = originalMember.id || originalMember._id;
      if (!id || id === "null") {
        alert('Member ID not found');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/team-members/${id}`, updatedMember);
      setTeamMembers(teamMembers.map(m => m.id === id ? response.data : m));
      setShowEditMember(false);
      setSelectedMember(null);
      setNewMember({
        name: '',
        role: 'Driver',
        status: 'Active',
        location: '',
        phone: '',
        email: '',
        joinDate: '',
        experience: '',
        salary: '',
        contractExpiry: '',
        specializations: '',
        certifications: '',
        emergencyContact: {
          name: '',
          phone: '',
          relation: ''
        }
      });
    } catch (err) {
      console.error('Error updating team member:', err);
      alert('Failed to update team member. Please try again.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/team-members/${id}`);
        setTeamMembers(teamMembers.filter(m => m.id !== id));
      } catch (err) {
        console.error('Error deleting team member:', err);
        alert('Failed to delete team member. Please try again.');
      }
    }
  };

  // Filtering logic
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats calculation
  const teamStats = [
    {
      title: "Total Team Members",
      value: teamMembers.length,
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Active Drivers",
      value: teamMembers.filter(m => m.role.includes('Driver') && m.status === 'Active').length,
      icon: Target,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Championship Points",
      value: teamMembers.reduce((sum, m) => sum + (m.championshipPoints || 0), 0),
      icon: Trophy,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Avg Performance",
      value: "4.5/5",
      icon: Star,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const roles = ['all', 'Lead Driver', 'Driver', 'Reserve Driver', 'Team Principal', 'Race Engineer', 'Mechanic'];

  // Render
  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
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
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
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
                placeholder="Search team members by name, email, or role..."
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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Injured">Injured</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-gray-500">Loading team members...</div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 mb-4">Get started by adding your first team member</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Team Member
            </button>
          </div>
        ) : (
          filteredMembers.map((member) => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RoleIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Performance:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                    {member.performance}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-black">{member.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-black">{member.location}</span>
                </div>
                {member.role.includes('Driver') && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Races:</span>
                      <span className="text-black">{member.racesCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Wins:</span>
                      <span className="text-black">{member.wins}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Points:</span>
                      <span className="text-black">{member.championshipPoints}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Contract:</span>
                  <span className="text-black">{member.contractExpiry}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditMember(member)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    const id = member.id || member._id;
                    if (id && id !== "null") {
                      handleDeleteMember(id);
                    } else {
                      alert('Member ID not found');
                    }
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })
     )}

   </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Add Team Member</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Driver">Driver</option>
                  <option value="Lead Driver">Lead Driver</option>
                  <option value="Reserve Driver">Reserve Driver</option>
                  <option value="Team Principal">Team Principal</option>
                  <option value="Race Engineer">Race Engineer</option>
                  <option value="Mechanic">Mechanic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
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
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date *
                </label>
                <input
                  type="date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={newMember.experience}
                  onChange={(e) => setNewMember({...newMember, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., 5 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  value={newMember.salary}
                  onChange={(e) => setNewMember({...newMember, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Monthly salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Expiry
                </label>
                <input
                  type="date"
                  value={newMember.contractExpiry}
                  onChange={(e) => setNewMember({...newMember, contractExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Injured">Injured</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations
                </label>
                <input
                  type="text"
                  value={newMember.specializations}
                  onChange={(e) => setNewMember({...newMember, specializations: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Circuit Racing, Endurance, Testing"
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <input
                  type="text"
                  value={newMember.certifications}
                  onChange={(e) => setNewMember({...newMember, certifications: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., FIA License, Advanced Racing, Safety Protocol"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddMember(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Member Modal */}
      {showEditMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Team Member</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Driver">Driver</option>
                  <option value="Lead Driver">Lead Driver</option>
                  <option value="Reserve Driver">Reserve Driver</option>
                  <option value="Team Principal">Team Principal</option>
                  <option value="Race Engineer">Race Engineer</option>
                  <option value="Mechanic">Mechanic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
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
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date *
                </label>
                <input
                  type="date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={newMember.experience}
                  onChange={(e) => setNewMember({...newMember, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., 5 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  value={newMember.salary}
                  onChange={(e) => setNewMember({...newMember, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="Monthly salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Expiry
                </label>
                <input
                  type="date"
                  value={newMember.contractExpiry}
                  onChange={(e) => setNewMember({...newMember, contractExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({...newMember, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Injured">Injured</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations
                </label>
                <input
                  type="text"
                  value={newMember.specializations}
                  onChange={(e) => setNewMember({...newMember, specializations: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., Circuit Racing, Endurance, Testing"
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                <input
                  type="text"
                  value={newMember.certifications}
                  onChange={(e) => setNewMember({...newMember, certifications: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="e.g., FIA License, Advanced Racing, Safety Protocol"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditMember(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementDashboard;
