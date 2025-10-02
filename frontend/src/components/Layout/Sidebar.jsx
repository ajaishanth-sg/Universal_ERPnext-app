import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Zap,
  Building2,
  Car,
  Home,
  UserCheck,
  Calculator,
  Briefcase,
  MapPin,
  Flag,
  Wrench,
  ChefHat,
  Plane,
  Clock,
  ChevronDown,
} from "lucide-react";
import React, { useState } from 'react';

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Executive Dashboard",
    active: true,
    badge: "New"
  },
  {
    id: "financial",
    icon: Calculator,
    label: "Financial Advisor",
    submenu: [
      { id: "payments", label: "Payments" },
      { id: "treasury", label: "Treasury" },
      { id: "banking", label: "Banking" },
    ],
  },
  {
    id: "accounting",
    icon: FileText,
    label: "Accounting",
    submenu: [
      { id: "chart-of-accounts", label: "Chart of Accounts" },
      { id: "payables", label: "Payables" },
      { id: "receivables", label: "Receivables" },
      { id: "financial-reports", label: "Financial Reports" },
    ],
  },
  // {
  //   id: "operations",
  //   icon: Building2,
  //   label: "Head of Operations",
  //   submenu: [
  //     { id: "spv-company", label: "SPV Company" },
  //     { id: "racing-team", label: "Racing Team" },
  //     { id: "consultants", label: "Consultants" },
  //     { id: "service-providers", label: "Service Providers" },
  //   ],
  // },
  // {
  //   id: "pa-chairman",
  //   icon: UserCheck,
  //   label: "PA to Chairman",
  //   submenu: [
  //     { id: "executive-assistant", label: "Executive Assistant" },
  //     { id: "house-manager-muscat", label: "House Manager (Muscat)" },
  //     { id: "fleet-manager", label: "Fleet Manager" },
  //   ],
  // },
  {
    id: "hr-office",
    icon: Users,
    label: "HR & Office Support",
    submenu: [
      { id: "hr-office", label: "Overview" },
      { id: "employee-management", label: "Employee Management" },
      { id: "leave-management", label: "Leave Management" },
      { id: "travel-desk", label: "Travel Desk" },
      { id: "office-support", label: "Office Support" },
    ],
  },
  {
    id: "house-management",
    icon: Home,
    label: "House Management",
    submenu: [
      { id: "muscat-house", label: "Muscat House" },
      { id: "abroad-house", label: "Abroad House" },
      { id: "maintenance", label: "Maintenance" },
      { id: "purchases", label: "Purchases" },
    ],
  },
  {
    id: "fleet-management",
    icon: Car,
    label: "Fleet Management",
    submenu: [
      { id: "vehicles", label: "Vehicles" },
      { id: "drivers", label: "Drivers" },
      { id: "maintenance", label: "Maintenance" },
      { id: "scheduling", label: "Scheduling" },
    ],
  },
  {
    id: "racing-operations",
    icon: Flag,
    label: "Racing Operations",
    submenu: [
      { id: "team-management", label: "Team Management" },
      { id: "travel-coordination", label: "Travel Coordination" },
      { id: "racing-payments", label: "Payments" },
      { id: "logistics", label: "Logistics" },
    ],
  },
  // {
  //   id: "reports",
  //   icon: FileText,
  //   label: "Reports & Analytics",
  // },
  {
    id: "settings",
    icon: Settings,
    label: "System Settings",
  },
];

function Sidebar({ onNavigate, activeDashboard }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  // FIXED: Handle main item click for items with submenus
  const handleMainItemClick = (item) => {
    if (item.submenu) {
      // Toggle expansion
      toggleExpanded(item.id);
    } else {
      // Just navigate for items without submenus
      handleItemClick(item.id);
    }
  };

  return (
    <div
      className="transition duration-300 ease-in-out w-64 flex flex-col relative z-10"
      style={{
        backgroundColor: "#1E3A5F",
        color: "#FFFFFF",
        height: "100vh",
      }}
    >
      <div
        className="p-6 border-b"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Zap className="w-6 h-6" style={{ color: "#1E3A5F" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
              UniverseERP
            </h1>
            <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
             System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id || activeDashboard === item.id;
          const isExpanded = expandedItems.includes(item.id);

          return (
            <div key={item.id}>
              <button
                onClick={() => handleMainItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group`}
                style={{
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)" }}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: "#FFFFFF",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
                    />
                  )}
                </div>
              </button>

              {item.submenu && isExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleItemClick(subItem.id)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-all duration-200`}
                      style={{
                        backgroundColor: (activeItem === subItem.id || activeDashboard === subItem.id) ? "rgba(255, 255, 255, 0.1)" : "transparent",
                        color: (activeItem === subItem.id || activeDashboard === subItem.id) ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className="p-4 border-t"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="flex items-center space-x-3 p-3 rounded-xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <img
            src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&cs=tinysrgb&w=64&h=64&dpr=2"
            alt="user"
            className="w-10 h-10 rounded-full ring-2"
            style={{ borderColor: "#FFFFFF" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
              Chairman
            </p>
            <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              admin@familyoffice.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;