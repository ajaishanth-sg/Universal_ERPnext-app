import { Filter, Menu, Search, Bell, Settings, ChevronDown, CloudSun, Sun, Cloud, CloudRain, Search as SearchIcon, MapPin, Thermometer, Wind, Droplets, User, HelpCircle, LogOut, UserCog } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';



// Notification Widget Component
function NotificationWidget() {
  const notifications = [
    { id: 1, message: "New payment received", time: "2 min ago" },
    { id: 2, message: "Maintenance scheduled", time: "1 hour ago" },
    { id: 3, message: "Employee onboarding complete", time: "3 hours ago" }
  ];

  return (
    <div className="p-4 rounded-xl shadow-md bg-white w-80 absolute right-0 top-12 z-10">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.map(notif => (
        <div key={notif.id} className="py-2 border-b last:border-b-0">
          <p className="text-sm">{notif.message}</p>
          <p className="text-xs text-gray-500">{notif.time}</p>
        </div>
      ))}
    </div>
  );
}

// Weather Widget Component
function WeatherWidget({ weather, selectedCountry, setSelectedCountry, onCountryChange }) {
  if (!weather) return null;

  const temp = weather.temp;
  const condition = weather.condition;
  const humidity = weather.humidity;
  const windSpeed = weather.windSpeed;
  const location = weather.location;

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Canada',
    'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Netherlands', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Portugal'
  ];

  return (
    <div className="p-4 rounded-xl shadow-md bg-white w-96 absolute right-0 top-12 z-10">
      <h2 className="text-lg font-bold mb-4">Weather Details</h2>

      {/* Current Weather Summary */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <Sun className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-sm font-medium text-gray-900">{location}</p>
          <p className="text-lg font-bold text-gray-800">{temp}°C</p>
          <p className="text-sm text-gray-600">{condition}</p>
        </div>
      </div>

      {/* Detailed Weather Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-sm font-medium">{humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Wind Speed</p>
            <p className="text-sm font-medium">{windSpeed} km/h</p>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">3-Day Forecast</h3>
        <div className="space-y-2">
          {weather.forecast?.slice(0, 3).map((day, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-xs text-gray-600">{day.day}</span>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium">{day.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Country Selection */}
      <div className="border-t pt-3">
        <p className="text-sm font-medium mb-2">Select Country</p>
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            onCountryChange(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="">Select a country...</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Profile Dropdown Component
function ProfileDropdown({ onProfileAction }) {
  const profileOptions = [
    { id: 'profile', label: 'View Profile', icon: User },
    { id: 'settings', label: 'Account Settings', icon: UserCog },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'signout', label: 'Sign Out', icon: LogOut }
  ];

  return (
    <div className="profile-dropdown absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="py-2">
        {profileOptions.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onProfileAction(option.id)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Header Component
function Header({ currentDashboard = 'Executive Dashboard', onToggleSidebar, onNewAction }) {
  const [showWeather, setShowWeather] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch weather data on mount and when country changes
  useEffect(() => {
    const countryToCity = {
      'United States': 'New York',
      'United Kingdom': 'London',
      'Germany': 'Berlin',
      'France': 'Paris',
      'Italy': 'Rome',
      'Spain': 'Madrid',
      'Canada': 'Toronto',
      'Australia': 'Sydney',
      'Japan': 'Tokyo',
      'China': 'Beijing',
      'India': 'New Delhi',
      'Brazil': 'Rio',
      'Mexico': 'Mexico City',
      'Netherlands': 'Amsterdam',
      'Sweden': 'Stockholm',
      'Norway': 'Oslo',
      'Denmark': 'Copenhagen',
      'Finland': 'Helsinki',
      'Switzerland': 'Zurich',
      'Austria': 'Vienna',
      'Belgium': 'Brussels',
      'Portugal': 'Lisbon'
    };

    const fetchWeather = async (location = "New Delhi") => {
      // Mock weather data simulating OpenWeatherMap API response
      const mockWeatherData = {
        'New Delhi': {
          location: 'New Delhi, India',
          temp: 32,
          condition: 'Sunny',
          humidity: 45,
          windSpeed: 15,
          forecast: [
            { day: 'Today', temp: 32 },
            { day: 'Tomorrow', temp: 31 },
            { day: 'Day After', temp: 33 }
          ]
        },
        'London': {
          location: 'London, UK',
          temp: 18,
          condition: 'Cloudy',
          humidity: 65,
          windSpeed: 12,
          forecast: [
            { day: 'Today', temp: 18 },
            { day: 'Tomorrow', temp: 17 },
            { day: 'Day After', temp: 19 }
          ]
        },
        'New York': {
          location: 'New York, USA',
          temp: 22,
          condition: 'Sunny',
          humidity: 50,
          windSpeed: 8,
          forecast: [
            { day: 'Today', temp: 22 },
            { day: 'Tomorrow', temp: 23 },
            { day: 'Day After', temp: 21 }
          ]
        },
        'Tokyo': {
          location: 'Tokyo, Japan',
          temp: 26,
          condition: 'Rainy',
          humidity: 75,
          windSpeed: 20,
          forecast: [
            { day: 'Today', temp: 26 },
            { day: 'Tomorrow', temp: 25 },
            { day: 'Day After', temp: 27 }
          ]
        },
        'Paris': {
          location: 'Paris, France',
          temp: 20,
          condition: 'Partly Cloudy',
          humidity: 55,
          windSpeed: 10,
          forecast: [
            { day: 'Today', temp: 20 },
            { day: 'Tomorrow', temp: 21 },
            { day: 'Day After', temp: 19 }
          ]
        },
        'Berlin': {
          location: 'Berlin, Germany',
          temp: 15,
          condition: 'Cloudy',
          humidity: 60,
          windSpeed: 14,
          forecast: [
            { day: 'Today', temp: 15 },
            { day: 'Tomorrow', temp: 16 },
            { day: 'Day After', temp: 14 }
          ]
        },
        'Rome': {
          location: 'Rome, Italy',
          temp: 24,
          condition: 'Sunny',
          humidity: 50,
          windSpeed: 10,
          forecast: [
            { day: 'Today', temp: 24 },
            { day: 'Tomorrow', temp: 25 },
            { day: 'Day After', temp: 23 }
          ]
        },
        'Madrid': {
          location: 'Madrid, Spain',
          temp: 28,
          condition: 'Sunny',
          humidity: 40,
          windSpeed: 12,
          forecast: [
            { day: 'Today', temp: 28 },
            { day: 'Tomorrow', temp: 29 },
            { day: 'Day After', temp: 27 }
          ]
        },
        'Toronto': {
          location: 'Toronto, Canada',
          temp: 20,
          condition: 'Partly Cloudy',
          humidity: 55,
          windSpeed: 9,
          forecast: [
            { day: 'Today', temp: 20 },
            { day: 'Tomorrow', temp: 19 },
            { day: 'Day After', temp: 21 }
          ]
        },
        'Sydney': {
          location: 'Sydney, Australia',
          temp: 25,
          condition: 'Sunny',
          humidity: 60,
          windSpeed: 18,
          forecast: [
            { day: 'Today', temp: 25 },
            { day: 'Tomorrow', temp: 26 },
            { day: 'Day After', temp: 24 }
          ]
        },
        'Beijing': {
          location: 'Beijing, China',
          temp: 22,
          condition: 'Cloudy',
          humidity: 50,
          windSpeed: 11,
          forecast: [
            { day: 'Today', temp: 22 },
            { day: 'Tomorrow', temp: 21 },
            { day: 'Day After', temp: 23 }
          ]
        },
        'Rio': {
          location: 'Rio, Brazil',
          temp: 30,
          condition: 'Sunny',
          humidity: 70,
          windSpeed: 15,
          forecast: [
            { day: 'Today', temp: 30 },
            { day: 'Tomorrow', temp: 31 },
            { day: 'Day After', temp: 29 }
          ]
        },
        'Mexico City': {
          location: 'Mexico City, Mexico',
          temp: 23,
          condition: 'Partly Cloudy',
          humidity: 45,
          windSpeed: 7,
          forecast: [
            { day: 'Today', temp: 23 },
            { day: 'Tomorrow', temp: 24 },
            { day: 'Day After', temp: 22 }
          ]
        },
        'Amsterdam': {
          location: 'Amsterdam, Netherlands',
          temp: 17,
          condition: 'Rainy',
          humidity: 80,
          windSpeed: 16,
          forecast: [
            { day: 'Today', temp: 17 },
            { day: 'Tomorrow', temp: 16 },
            { day: 'Day After', temp: 18 }
          ]
        },
        'Stockholm': {
          location: 'Stockholm, Sweden',
          temp: 12,
          condition: 'Cloudy',
          humidity: 70,
          windSpeed: 13,
          forecast: [
            { day: 'Today', temp: 12 },
            { day: 'Tomorrow', temp: 13 },
            { day: 'Day After', temp: 11 }
          ]
        },
        'Oslo': {
          location: 'Oslo, Norway',
          temp: 10,
          condition: 'Rainy',
          humidity: 75,
          windSpeed: 11,
          forecast: [
            { day: 'Today', temp: 10 },
            { day: 'Tomorrow', temp: 9 },
            { day: 'Day After', temp: 11 }
          ]
        },
        'Copenhagen': {
          location: 'Copenhagen, Denmark',
          temp: 14,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          forecast: [
            { day: 'Today', temp: 14 },
            { day: 'Tomorrow', temp: 15 },
            { day: 'Day After', temp: 13 }
          ]
        },
        'Helsinki': {
          location: 'Helsinki, Finland',
          temp: 8,
          condition: 'Cloudy',
          humidity: 80,
          windSpeed: 10,
          forecast: [
            { day: 'Today', temp: 8 },
            { day: 'Tomorrow', temp: 9 },
            { day: 'Day After', temp: 7 }
          ]
        },
        'Zurich': {
          location: 'Zurich, Switzerland',
          temp: 16,
          condition: 'Sunny',
          humidity: 55,
          windSpeed: 8,
          forecast: [
            { day: 'Today', temp: 16 },
            { day: 'Tomorrow', temp: 17 },
            { day: 'Day After', temp: 15 }
          ]
        },
        'Vienna': {
          location: 'Vienna, Austria',
          temp: 18,
          condition: 'Partly Cloudy',
          humidity: 50,
          windSpeed: 9,
          forecast: [
            { day: 'Today', temp: 18 },
            { day: 'Tomorrow', temp: 19 },
            { day: 'Day After', temp: 17 }
          ]
        },
        'Brussels': {
          location: 'Brussels, Belgium',
          temp: 19,
          condition: 'Cloudy',
          humidity: 60,
          windSpeed: 11,
          forecast: [
            { day: 'Today', temp: 19 },
            { day: 'Tomorrow', temp: 18 },
            { day: 'Day After', temp: 20 }
          ]
        },
        'Lisbon': {
          location: 'Lisbon, Portugal',
          temp: 26,
          condition: 'Sunny',
          humidity: 45,
          windSpeed: 14,
          forecast: [
            { day: 'Today', temp: 26 },
            { day: 'Tomorrow', temp: 27 },
            { day: 'Day After', temp: 25 }
          ]
        }
      };

      // Simulate API delay
      setTimeout(() => {
        if (mockWeatherData[location]) {
          setWeatherData(mockWeatherData[location]);
        } else {
          // Default to New Delhi for unknown locations
          setWeatherData(mockWeatherData['New Delhi']);
        }
      }, 500);
    };

    const city = countryToCity[selectedCountry] || "New Delhi";
    fetchWeather(city);
  }, [selectedCountry]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handleProfileAction = (action) => {
    setShowProfileDropdown(false);

    switch (action) {
      case 'profile':
        alert('View Profile - Feature coming soon!');
        break;
      case 'settings':
        alert('Account Settings - Feature coming soon!');
        break;
      case 'help':
        alert('Help & Support - You can access help through the chatbot or contact support!');
        break;
      case 'signout':
        if (window.confirm('Are you sure you want to sign out?')) {
          alert('Sign Out - Feature coming soon!');
        }
        break;
      default:
        break;
    }
  };

  // Get user's location on mount (simulated)
  useEffect(() => {
    // Simulate geolocation - in real app, use navigator.geolocation
    setTimeout(() => {
      // Default to New Delhi, but in real app would get actual location
      setWeatherData({
        location: 'New Delhi, India',
        temp: 32,
        condition: 'Sunny',
        humidity: 45,
        windSpeed: 15,
        forecast: [
          { day: 'Today', temp: 32 },
          { day: 'Tomorrow', temp: 31 },
          { day: 'Day After', temp: 33 }
        ]
      });
    }, 1000);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-gray-900">{currentDashboard}</h1>
            <p className="text-gray-600">Welcome back, Chairman! Here's what's happening today</p>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          {/* Weather Display */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          <button
            onClick={() => setShowWeather(!showWeather)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors relative"
          >
            <CloudSun className="h-5 w-5" />
            {weatherData && (
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-sm font-medium">{weatherData.temp}°C</span>
                <span className="text-xs text-gray-500">{weatherData.condition}</span>
              </div>
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full ring-2 ring-blue-500 flex items-center justify-center"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <User className="w-4 h-4" style={{ color: "#1E3A5F" }} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Chairman</p>
                <p className="text-xs text-gray-500">admin@familyoffice.com</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && <ProfileDropdown onProfileAction={handleProfileAction} />}
          </div>
        </div>
      </div>



      {/* Notification Widget */}
      {showNotifications && <NotificationWidget />}

      {/* Weather Widget */}
      {showWeather && (
        <WeatherWidget
          weather={weatherData}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          onCountryChange={handleCountryChange}
        />
      )}
    </div>
  );
}

export default Header;
