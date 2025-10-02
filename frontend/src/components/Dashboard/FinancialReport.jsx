import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import GeneralLedgerForm from '../Forms/GeneralLedgerForm';
import CustomerLedgerSummaryForm from '../Forms/CustomerLedgerSummaryForm';

const FinancialReport = ({ onBack }) => {
  const [currentForm, setCurrentForm] = useState(null);

  const handleFormNavigation = (formType) => {
    setCurrentForm(formType);
  };

  const handleBackToFinancialReport = () => {
    setCurrentForm(null);
  };

  // Render forms based on currentForm state
  if (currentForm === 'general-ledger') {
    return <GeneralLedgerForm onBack={handleBackToFinancialReport} />;
  }
 if (currentForm === 'customer-leger-summary') {
    return <GeneralLedgerForm onBack={handleBackToFinancialReport} />;
  }
  const ledgers = [
    { id: 1, name: "General Ledger", form: 'general-ledger' },
    { id: 2, name: "Customer Ledger Summary", form: 'customer-leger-summary'},
    { id: 3, name: "Supplier Ledger Summary", form: null },
  ];

  const financialStatements = [
    { id: 1, name: "Trial Balance", form: null },
    { id: 2, name: "Profit and Loss Statement", form: null },
    { id: 3, name: "Balance Sheet", form: null },
    { id: 4, name: "Cash Flow", form: null },
    { id: 5, name: "Consolidated Financial Statement", form: null },
  ];

  const profitability = [
    { id: 1, name: "Gross Profit", form: null },
    { id: 2, name: "Profitability Analysis", form: null },
    { id: 3, name: "Sales Invoice Trends", form: null },
    { id: 4, name: "Purchase Invoice Trends", form: null },
  ];

  const otherReports = [
    { id: 1, name: "Trial Balance for Party", form: null },
    { id: 2, name: "Payment Period Based On Invoice Date", form: null },
    { id: 3, name: "Sales Partners Commission", form: null },
    { id: 4, name: "Customer Credit Balance", form: null },
    { id: 5, name: "Sales Payment Summary", form: null },
    { id: 6, name: "Address And Contacts", form: null },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button and Page Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
       
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ledgers Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ledgers</h2>
          <ul className="space-y-3">
            {ledgers.map((ledger) => (
              <li
                key={ledger.id}
                onClick={() => ledger.form && handleFormNavigation(ledger.form)}
                className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${!ledger.form ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{ledger.name}</span>
                  {ledger.form && <ArrowUpRight className="w-4 h-4 text-gray-400" />}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial Statements Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Statements</h2>
          <ul className="space-y-3">
            {financialStatements.map((statement) => (
              <li
                key={statement.id}
                className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${!statement.form ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{statement.name}</span>
                  {statement.form && <ArrowUpRight className="w-4 h-4 text-gray-400" />}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Profitability Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profitability</h2>
          <ul className="space-y-3">
            {profitability.map((report) => (
              <li
                key={report.id}
                className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${!report.form ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{report.name}</span>
                  {report.form && <ArrowUpRight className="w-4 h-4 text-gray-400" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Other Reports Section */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherReports.map((report) => (
            <div
              key={report.id}
              className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${!report.form ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{report.name}</span>
                {report.form && <ArrowUpRight className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
