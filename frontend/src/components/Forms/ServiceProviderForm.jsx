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
  Settings,
  Star,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2
} from 'lucide-react';

const ServiceProviderForm = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('providers');
  const [showNewProvider, setShowNewProvider] = useState(false);

  const serviceProviders = [
    {
      id: 1,
      name: "Elite Catering Services",
      category: "Catering",
      location: "Monaco",
      status: "Active",
      contracts: 5,
      monthlySpend: "$15,000",
      lastService: "2024-01-15",
      rating: 4.8,
      contact: "Jean Pierre",
      phone: "+377 93 50 12 34",
      email: "contact@elitecatering.mc",
      services: ["Event Catering", "Daily Meals", "Special Diets", "Staff Training"]
    },
    {
      id: 2,
      name: "Premium Security Solutions",
      category: "Security",
      location: "Muscat",
      status: "Active",
      contracts: 3,
      monthlySpend: "$8,500",
      lastService: "2024-01-14",
      rating: 4.9,
      contact: "Ahmed Al-Security",
      phone: "+968 24 56 78 90",
      email: "info@premiumsecurity.om",
      services: ["Property Security", "Event Security", "Surveillance", "Access Control"]
    },
    {
      id: 3,
      name: "Luxury Transport Ltd",
      category: "Transportation",
      location: "London",
      status: "Active",
      contracts: 7,
      monthlySpend: "$12,000",
      lastService: "2024-01-13",
      rating: 4.7,
      contact: "James Harrington",
      phone: "+44 20 79 46 12 34",
      email: "bookings@luxurytransport.co.uk",
      services: ["Airport Transfers", "Event Transport", "Daily Commute", "Luxury Vehicles"]
    },
    {
      id: 4,
      name: "Executive Cleaning Co",
      category: "Cleaning",
      location: "Monaco",
      status: "Active",
      contracts: 4,
      monthlySpend: "$6,500",
      lastService: "2024-01-12",
      rating: 4.6,
      contact: "Marie Dubois",
      phone: "+377 93 25 67 89",
      email: "service@execcleaning.mc",
      services: ["Deep Cleaning", "Daily Maintenance", "Specialized Cleaning", "Eco-friendly Products"]
    },
    {
      id: 5,
      name: "Tech Support Pro",
      category: "IT Services",
      location: "Remote",
      status: "Active",
      contracts: 2,
      monthlySpend: "$4,200",
      lastService: "2024-01-11",
      rating: 4.8,
      contact: "David Chen",
      phone: "+1 415 23 45 67",
      email: "support@techsupportpro.com",
      services: ["Network Management", "Software Support", "Hardware Maintenance", "Security Updates"]
    }
  ];

  const serviceCategories = [
    {
      id: 1,
      name: "Catering",
      providers: 1,
      totalSpend: "$15,000",
      avgRating: 4.8,
      status: "Active"
    },
    {
      id: 2,
      name: "Security",
      providers: 1,
      totalSpend: "$8,500",
      avgRating: 4.9,
      status: "Active"
    },
    {
      id: 3,
      name: "Transportation",
      providers: 1,
      totalSpend: "$12,000",
      avgRating: 4.7,
      status: "Active"
    },
    {
      id: 4,
      name: "Cleaning",
      providers: 1,
      totalSpend: "$6,500",
      avgRating: 4.6,
      status: "Active"
    },
    {
      id: 5,
      name: "IT Services",
      providers: 1,
      totalSpend: "$4,200",
      avgRating: 4.8,
      status: "Active"
    }
  ];

  const recentServices = [
    {
      id: 1,
      provider: "Elite Catering Services",
      service: "Event Catering",
      date: "2024-01-15",
      amount: "$3,500",
      status: "Completed",
      rating: 5,
      property: "Monaco Penthouse"
    },
    {
      id: 2,
      provider: "Premium Security Solutions",
      service: "Property Security",
      date: "2024-01-14",
      amount: "$2,100",
      status: "Completed",
      rating: 5,
      property: "Muscat Villa"
    },
    {
      id: 3,
      provider: "Luxury Transport Ltd",
      service: "Airport Transfer",
      date: "2024-01-13",
      amount: "$850",
      status: "Completed",
      rating: 4,
      property: "London Apartment"
    }
  ];

  const tabs = [
    { id: 'providers', label: 'Service Providers', icon: Building2 },
    { id: 'categories', label: 'Categories', icon: Settings },
    { id: 'services', label: 'Recent Services', icon: Calendar }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
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
            <h1 className="text-lg font-semibold text-gray-900">Service Providers</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewProvider(true)}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Provider</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Service Report</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget Analysis</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Rate Provider</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Provider Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Providers:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Contracts:</span>
                  <span className="font-medium">21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Spend:</span>
                  <span className="font-medium">$46,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Rating:</span>
                  <span className="font-medium text-yellow-600">4.8</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Top Categories</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportation:</span>
                  <span className="font-medium">$12,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Catering:</span>
                  <span className="font-medium">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security:</span>
                  <span className="font-medium">$8,500</span>
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
          {activeTab === 'providers' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Service Providers</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Provider</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {serviceProviders.map((provider) => (
                    <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">{provider.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                          {provider.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{provider.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{provider.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Contracts:</span>
                          <span className="font-medium">{provider.contracts}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Monthly Spend:</span>
                          <span className="font-medium">{provider.monthlySpend}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <span className={`font-medium ${getRatingColor(provider.rating)}`}>
                              {provider.rating}
                            </span>
                            <div className="flex">
                              {renderStars(provider.rating)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="text-xs text-gray-600 mb-2">Services:</div>
                        <div className="flex flex-wrap gap-1">
                          {provider.services.slice(0, 2).map((service, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              {service}
                            </span>
                          ))}
                          {provider.services.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              +{provider.services.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Service Categories</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {serviceCategories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                          {category.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Providers:</span>
                          <span className="font-medium">{category.providers}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Spend:</span>
                          <span className="font-medium">{category.totalSpend}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Avg Rating:</span>
                          <div className="flex items-center space-x-1">
                            <span className={`font-medium ${getRatingColor(category.avgRating)}`}>
                              {category.avgRating}
                            </span>
                            <div className="flex">
                              {renderStars(category.avgRating)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Services</h2>
                    <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Book Service</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentServices.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {service.property}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {service.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {service.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className={`font-medium ${getRatingColor(service.rating)}`}>
                                {service.rating}
                              </span>
                              <div className="flex">
                                {renderStars(service.rating)}
                              </div>
                            </div>
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
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderForm;