import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
// Executive and Financial Dashboards
import ExecutiveDashboard from './components/Dashboard/ExecutiveDashboard';
import FinancialDashboard from './components/Dashboard/FinancialDashboard';
import AccountingDashboard from './components/Dashboard/AccountingDashboard';
import FinancialReport from './components/Dashboard/FinancialReport';
// Payables and Receivables
import PayablesPage from './components/Dashboard/PayablesPage';
import ReceivablesPage from './components/Dashboard/ReceivablesPage';
// Operations Dashboards
import OperationsDashboard from './components/Dashboard/OperationsDashboard';
import LogisticsDashboard from './components/Dashboard/LogisticsDashboard';
import RacingPaymentsDashboard from './components/Dashboard/RacingPaymentsDashboard';
// HR and Office Support
import HRDashboard from './components/Dashboard/HRDashboard';
// House Management Dashboards
import HouseManagementDashboard from './components/Dashboard/HouseManagementDashboard';
import AbroadHouseDashboard from './components/Dashboard/AbroadHouseDashboard';
import MaintenanceDashboard from './components/Dashboard/MaintenanceDashboard';
import MaintenanceSchedulingDashboard from './components/Dashboard/MaintenanceSchedulingDashboard';
import MuscatHouseDashboard from './components/Dashboard/MuscatHouseDashboard';
// Fleet Management Dashboards
import FleetManagementDashboard from './components/Dashboard/FleetManagementDashboard';
import DriverManagementDashboard from './components/Dashboard/DriverManagementDashboard';
import VehicleManagementDashboard from './components/Dashboard/VehicleManagementDashboard';
// Racing and Team Management Dashboards
import TeamManagementDashboard from './components/Dashboard/TeamManagementDashboard';
import TravelCoordinationDashboard from './components/Dashboard/TravelCoordinationDashboard';
import TravelDeskDashboard from './components/Dashboard/TravelDeskDashboard';

function App() {
  const [activeDashboard, setActiveDashboard] = useState('dashboard');

  const bankAccounts = [
    {
      name: "Primary Business Account",
      bank: "HSBC",
      balance: "$1,250,000",
      currency: "USD",
      type: "Business"
    },
    {
      name: "Property Management",
      bank: "Standard Chartered",
      balance: "$450,000",
      currency: "USD",
      type: "Property"
    },
    {
      name: "Investment Portfolio",
      bank: "Goldman Sachs",
      balance: "$650,000",
      currency: "USD",
      type: "Investment"
    },
    {
      name: "Operations Account",
      bank: "Emirates NBD",
      balance: "$100,000",
      currency: "AED",
      type: "Operations"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "payment",
      description: "Racing Team - Monaco Event",
      amount: "$45,000",
      date: "2024-01-15",
      status: "completed",
      account: "Primary Business"
    },
    {
      id: 2,
      type: "transfer",
      description: "Property Maintenance - Muscat",
      amount: "$12,500",
      date: "2024-01-14",
      status: "pending",
      account: "Property Management"
    },
    {
      id: 3,
      type: "payment",
      description: "Fleet Maintenance",
      amount: "$8,200",
      date: "2024-01-13",
      status: "completed",
      account: "Operations"
    },
    {
      id: 4,
      type: "deposit",
      description: "Investment Returns",
      amount: "$25,000",
      date: "2024-01-12",
      status: "completed",
      account: "Investment"
    }
  ];

  const getDashboardName = () => {
    switch (activeDashboard) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'financial':
        return 'Financial Advisor Dashboard';
      case 'payments':
        return 'Payments Dashboard';
      case 'treasury':
        return 'Treasury Dashboard';
      case 'banking':
        return 'Banking Dashboard';
      case 'accounting':
      case 'chart-of-accounts':
      case 'transactions':
      case 'invoices':
      case 'journal-entries':
      case 'reports':
        return 'Accounting Dashboard';
      case 'payables':
        return 'Payables';
      case 'receivables':
        return 'Receivables';
      case 'financial-reports':
        return 'Financial Reports';
      case 'operations':
      case 'spv-company':
      case 'racing-team':
      case 'consultants':
      case 'service-providers':
        return 'Head of Operations Dashboard';
      case 'logistics':
        return 'Logistics Dashboard';
      case 'racing-payments':
        return 'Racing Payments Dashboard';
      case 'pa-chairman':
      case 'executive-assistant':
      case 'hr-office':
      case 'employee-management':
      case 'leave-management':
      case 'office-support':
      case 'travel-desk':
        return 'HR & Office Support Dashboard';
      case 'house-management':
      case 'house-manager-muscat':
      case 'muscat-house':
      case 'abroad-house':
      case 'maintenance':
      case 'purchases':
        return 'House Management Dashboard';
      case 'maintenance-scheduling':
        return 'Maintenance Scheduling Dashboard';
      case 'fleet-management':
        return 'Fleet Management Dashboard';
      case 'fleet-manager':
        return 'Fleet Manager Dashboard';
      case 'vehicles':
        return 'Vehicle Management';
      case 'drivers':
        return 'Driver Management';
      case 'scheduling':
        return 'Maintenance Scheduling';
      case 'racing-operations':
        return 'Racing Operations Dashboard';
      case 'team-management':
        return 'Team Management';
      case 'travel-coordination':
        return 'Travel Coordination';
      default:
        return 'Executive Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (activeDashboard) {
      case 'dashboard':
        return <ExecutiveDashboard onNavigate={setActiveDashboard} />;
      case 'financial':
        return <FinancialDashboard bankAccounts={bankAccounts} recentTransactions={recentTransactions} onNavigate={setActiveDashboard} initialTab='overview' />;
      case 'payments':
        return <FinancialDashboard bankAccounts={bankAccounts} recentTransactions={recentTransactions} onNavigate={setActiveDashboard} initialTab='payments' />;
      case 'treasury':
        return <FinancialDashboard bankAccounts={bankAccounts} recentTransactions={recentTransactions} onNavigate={setActiveDashboard} initialTab='treasury' />;
      case 'banking':
        return <FinancialDashboard bankAccounts={bankAccounts} recentTransactions={recentTransactions} onNavigate={setActiveDashboard} initialTab='banking' />;
      case 'accounting':
      case 'chart-of-accounts':
      case 'transactions':
      case 'invoices':
      case 'journal-entries':
      case 'reports':
        return <AccountingDashboard onNavigate={setActiveDashboard} />;
      case 'payables':
        return <PayablesPage onBack={() => setActiveDashboard('accounting')} />;
      case 'receivables':
        return <ReceivablesPage onBack={() => setActiveDashboard('accounting')} />;
      case 'financial-reports':
        return <FinancialReport onBack={() => setActiveDashboard('accounting')} />;
      case 'operations':
      case 'spv-company':
      case 'racing-team':
      case 'consultants':
      case 'service-providers':
        return <OperationsDashboard />;
      case 'pa-chairman':
      case 'executive-assistant':
      case 'hr-office':
        return <HRDashboard key={activeDashboard} initialTab='overview' />;
      case 'employee-management':
        return <HRDashboard key={activeDashboard} initialTab='employees' />;
      case 'leave-management':
        return <HRDashboard key={activeDashboard} initialTab='leave' />;
      case 'office-support':
        return <HRDashboard key={activeDashboard} initialTab='office-support' />;
      case 'travel-desk':
        return <HRDashboard key={activeDashboard} initialTab='travel' />;
      case 'house-management':
        return <HouseManagementDashboard />;
      case 'muscat-house':
        return <MuscatHouseDashboard onBack={() => setActiveDashboard('house-management')} />;
      case 'abroad-house':
        return <AbroadHouseDashboard onBack={() => setActiveDashboard('house-management')} />;
      case 'maintenance':
        return <MaintenanceDashboard onBack={() => setActiveDashboard('house-management')} />;
      case 'maintenance-scheduling':
        return <MaintenanceSchedulingDashboard onBack={() => setActiveDashboard('house-management')} />;
      // Fleet Management Cases - FIXED
      case 'fleet-management':
        return <FleetManagementDashboard onNavigate={setActiveDashboard} />;
      case 'fleet-manager':
        return <FleetManagementDashboard onNavigate={setActiveDashboard} />;
      case 'vehicles':
        return <VehicleManagementDashboard onBack={() => setActiveDashboard('fleet-management')} />;
      case 'drivers':
        return <DriverManagementDashboard onBack={() => setActiveDashboard('fleet-management')} />;
      case 'scheduling':
        return <MaintenanceSchedulingDashboard onBack={() => setActiveDashboard('fleet-management')} />;
      // Racing Operations Cases - FIXED
      case 'Racing-operations':
        return <TeamManagementDashboard onNavigate={setActiveDashboard} />;
      case 'team-management':
        return <TeamManagementDashboard onBack={() => setActiveDashboard('racing-operations')} />;
         case 'racing-payments':
        return <RacingPaymentsDashboard onBack={() => setActiveDashboard('racing-operations')} />;
      case 'travel-coordination':
        return <TravelCoordinationDashboard onBack={() => setActiveDashboard('racing-operations')} />;
        case 'logistics':
        return <LogisticsDashboard onBack={() => setActiveDashboard('racing-operations')} />;
      case 'travel-desk':
        return <TravelDeskDashboard />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-500">
      <div className="flex h-screen overflow-hidden">
        <Sidebar onNavigate={setActiveDashboard} activeDashboard={activeDashboard} />
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <Header currentDashboard={getDashboardName()} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {renderDashboard()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;