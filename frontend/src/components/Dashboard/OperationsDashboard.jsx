import React, { useState, useEffect } from 'react';
import {
  Building2,
  Flag,
  Users,
  Plane,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings
} from 'lucide-react';

const OperationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/operations');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching operations dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading operations dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const operationsStats = [
    {
      title: "SPV Companies",
      value: dashboardData.stats.spvCompanies.toString(),
      change: "+1",
      icon: Building2,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Racing Events",
      value: dashboardData.stats.racingEvents.toString(),
      change: "+3",
      icon: Flag,
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Active Consultants",
      value: dashboardData.stats.activeConsultants.toString(),
      change: "+2",
      icon: Users,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Service Providers",
      value: dashboardData.stats.serviceProviders.toString(),
      change: "+5",
      icon: Settings,
      color: "from-purple-500 to-violet-600"
    }
  ];

  const spvCompanies = dashboardData.spvCompanies;

  const racingEvents = dashboardData.racingEvents;

  const consultants = dashboardData.consultants;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'spv-company', label: 'SPV Company' },
    { id: 'racing-team', label: 'Racing Team' },
    { id: 'consultants', label: 'Consultants' }
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
        {operationsStats.map((stat, index) => {
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
        {/* SPV Companies */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              SPV Companies
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {spvCompanies.map((company, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    {company.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    company.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span>{company.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{`₹${parseFloat(company.totalAssets || 0).toLocaleString()}`}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{company.lastTransaction || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Racing Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Racing Events
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {racingEvents.map((event, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">
                    {event.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'Received' ? 'bg-green-100 text-green-800' :
                    event.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.category || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{`₹${parseFloat(event.amount || 0).toLocaleString()}`}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{event.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultants */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Active Consultants
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {consultants.map((consultant, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    {consultant.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {consultant.role}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Rate:</span>
                  <span className="font-medium">{`₹${parseFloat(consultant.salary || 0).toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Rating:</span>
                  <span className="font-medium">{consultant.rating || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    consultant.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {consultant.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">New SPV</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Flag className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Schedule Event</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Add Consultant</p>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
            <Plane className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Travel Planning</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;