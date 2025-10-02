import React, { useState } from 'react';
import { 
  ArrowUpRight,
  Info,
  Zap
} from 'lucide-react';
import PaymentEntryForm from '../Forms/PaymentEntryForm';
import PurchaseInvoiceForm from '../Forms/PurchaseInvoiceForm';
import JournalEntryForm from '../Forms/JournalEntryForm';
import AccountsPayableForm from '../Forms/AccountsPayableForm';

const PayablesPage = ({ onBack }) => {
  const [currentForm, setCurrentForm] = useState(null);

  const shortcuts = [
    { name: 'Purchase Invoice', count: 0, form: 'purchase-invoice' },
    { name: 'Payment Entry', count: 0, form: 'payment-entry' },
    { name: 'Journal Entry', count: 0, form: 'journal-entry' },
    { name: 'Accounts Payable', count: 0, form: 'accounts-payable' }
  ];

  const handleFormNavigation = (formType) => {
    setCurrentForm(formType);
  };

  const handleBackToPayables = () => {
    setCurrentForm(null);
  };

  // Render forms based on currentForm state
  if (currentForm === 'payment-entry') {
    return <PaymentEntryForm onBack={handleBackToPayables} />;
  }
  if (currentForm === 'purchase-invoice') {
    return <PurchaseInvoiceForm onBack={handleBackToPayables} />;
  }
  if (currentForm === 'journal-entry') {
    return <JournalEntryForm onBack={handleBackToPayables} />;
  }
  if (currentForm === 'accounts-payable') {
    return <AccountsPayableForm onBack={handleBackToPayables} />;
  }

  const invoicingItems = [
    { name: 'Purchase Invoice' },
    { name: 'Supplier' }
  ];

  const paymentsItems = [
    { name: 'Payment Entry' },
    { name: 'Journal Entry' },
    { name: 'Payment Reconciliation' }
  ];

  const reportsItems = [
    { name: 'Accounts Payable' },
    { name: 'Accounts Payable Summary' },
    { name: 'Purchase Register' },
    { name: 'Item-wise Purchase Register' },
    { name: 'Purchase Order Analysis' },
    { name: 'Received Items To Be Billed' },
    { name: 'Supplier Ledger Summary' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Trial Message */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-gray-600" />
         
        </div>
       
      </div>

      {/* Shortcuts Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shortcuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shortcuts.map((shortcut, index) => (
            <div 
              key={index} 
              onClick={() => handleFormNavigation(shortcut.form)}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700">{shortcut.name}</span>
              <div className="flex items-center space-x-2">
                {shortcut.count > 0 && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {shortcut.count}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports & Masters Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Reports & Masters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invoicing */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Invoicing</h3>
            <div className="space-y-2">
              {invoicingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Payments</h3>
            <div className="space-y-2">
              {paymentsItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Reports</h3>
            <div className="space-y-2">
              {reportsItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayablesPage;