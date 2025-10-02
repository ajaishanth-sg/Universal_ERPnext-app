import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Car,
  Home,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  PieChart,
  Activity,
  UserCheck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

// Mock data for the donut chart
const approvalData = [
  { label: 'Approved', value: 75, color: '#10B981' },
  { label: 'Pending', value: 15, color: '#F59E0B' },
  { label: 'Rejected', value: 10, color: '#EF4444' }
];

// Mock data for departmental overview
const departmentStatus = [
  {
    name: "Financial Operations",
    status: "All systems operational",
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "bg-green-100",
    textColor: "text-green-800"
  },
  {
    name: "House Operations",
    status: "2 maintenance tasks pending",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "bg-blue-100",
    textColor: "text-blue-800"
  },
  {
    name: "Fleet Management",
    status: "Service due for 2 vehicles",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "bg-purple-100",
    textColor: "text-purple-800"
  }
];

const ExecutiveDashboard = ({ onNavigate }) => {
  const stats = [
    {
      title: "Total Assets",
      value: "$2.4M",
      change: "+12.5% vs last month",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Active Employees",
      value: "24",
      change: "+2% vs last month",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Fleet Vehicles",
      value: "8",
      change: "+0% vs last month",
      icon: Car,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Properties",
      value: "3",
      change: "+1% vs last month",
      icon: Home,
      color: "from-orange-500 to-red-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      title: "Payment processed for Racing Team",
      amount: "$45,000",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "maintenance",
      title: "House maintenance scheduled - Muscat",
      time: "4 hours ago",
      status: "pending"
    },
    {
      id: 3,
      type: "travel",
      title: "Travel arrangements for Chairman",
      time: "6 hours ago",
      status: "completed"
    },
    {
      id: 4,
      type: "hr",
      title: "New employee onboarding",
      time: "1 day ago",
      status: "in-progress"
    }
  ];

  const upcomingEvents = [
    {
      title: "Board Meeting",
      date: "Tomorrow, 10:00 AM",
      location: "Main Office",
      type: "meeting"
    },
    {
      title: "Racing Event - Monaco",
      date: "Next Week",
      location: "Monaco",
      type: "event"
    },
    {
      title: "Property Inspection",
      date: "Friday, 2:00 PM",
      location: "Muscat House",
      type: "inspection"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Approval Status
              </h2>
              <p className="text-gray-500 text-sm">
                Distribution of approval requests this month
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {approvalData.map((item, index) => {
                  const { value, color } = item;
                  const total = approvalData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = (value / total) * 100;
                  const cumulativePercentage = approvalData
                    .slice(0, index)
                    .reduce((sum, item) => sum + (item.value / total) * 100, 0);
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (percentage / 100) * circumference;
                  const transform = `rotate(-90 ${50} ${50})`;
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={color}
                      strokeWidth="15"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform={transform}
                      style={{
                        strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
                        transformOrigin: '50% 50%',
                        transform: `rotate(${-90 + cumulativePercentage * 3.6}deg)`
                      }}
                    />
                  );
                })}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold fill-gray-700"
                >
                  {approvalData.reduce((sum, item) => sum + item.value, 0)}
                </text>
              </svg>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {approvalData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Departmental Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Departmental Overview
              </h2>
              <p className="text-gray-500 text-sm">
                Current status across all departments
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {departmentStatus.map((dept, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${dept.color}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                    {dept.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {dept.name}
                    </p>
                    <p className={`text-xs ${dept.textColor}`}>
                      {dept.status}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${dept.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activities
            </h2>
            <button
              onClick={() => onNavigate('accounting')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-green-100' :
                    activity.status === 'pending' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}
                >
                  {activity.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : activity.status === 'pending' ? (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  {activity.amount && (
                    <p className="text-sm text-green-600 font-medium">
                      {activity.amount}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Events
            </h2>
            <button
              onClick={() => onNavigate('maintenance-scheduling')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.date}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('payments')}
            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Process Payment</p>
          </button>
          <button
            onClick={() => onNavigate('employee-management')}
            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Add Employee</p>
          </button>
          <button
            onClick={() => onNavigate('maintenance-scheduling')}
            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            <Car className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Schedule Maintenance</p>
          </button>
          <button
            onClick={() => onNavigate('travel-desk')}
            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center"
          >
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Book Travel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
