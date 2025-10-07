import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Search,
  DollarSign,
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react';

const PaymentReceiptForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    paymentType: 'Receive',
    postingDate: new Date().toISOString().split('T')[0],
    company: 'cube',
    partyType: 'Customer',
    party: '',
    paymentMethod: 'Cash',
    paymentAccount: '',
    paidTo: '',
    amount: '',
    receivedAmount: '',
    outstandingAmount: '',
    referenceNo: '',
    referenceDate: '',
    costCenter: '',
    remarks: ''
  });

  const [references, setReferences] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    fetchInvoices();
  }, []);

  const fetchCustomers = async () => {
    // Mock API call
    setCustomers([
      'ABC Corp',
      'XYZ Ltd',
      'Tech Solutions',
      'Global Traders',
      'Prime Industries'
    ]);
  };

  const fetchInvoices = async () => {
    // Mock API call
    setInvoices([
      { id: 'INV-2024-001', customer: 'ABC Corp', amount: 150000, outstanding: 100000 },
      { id: 'INV-2024-002', customer: 'XYZ Ltd', amount: 200000, outstanding: 200000 },
      { id: 'INV-2024-003', customer: 'Tech Solutions', amount: 75000, outstanding: 25000 }
    ]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleReferenceChange = (index, field, value) => {
    const updatedReferences = [...references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value
    };
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences(prev => [...prev, {
      referenceType: 'Sales Invoice',
      referenceName: '',
      amount: 0
    }]);
  };

  const removeReference = (index) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.party) newErrors.party = 'Customer is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // Mock API call
        console.log('Submitting payment:', { ...formData, references });
        alert('Payment receipt created successfully!');
        onBack();
      } catch (error) {
        console.error('Error creating payment:', error);
        alert('Error creating payment receipt');
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateTotals = () => {
    const totalAllocated = references.reduce((sum, ref) => sum + (parseFloat(ref.amount) || 0), 0);
    const outstanding = parseFloat(formData.amount || 0) - totalAllocated;
    return { totalAllocated, outstanding };
  };

  const { totalAllocated, outstanding } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Receivables</span>
                <span className="text-gray-400"></span>
                <span className="text-gray-900">Payment Receipt</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-orange-600 font-medium">Not Saved</span>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h1 className="text-lg font-semibold text-gray-900">Payment Receipt</h1>
            </div>
          </div>

          {/* Basic Information */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  value={formData.paymentType}
                  onChange={(e) => handleInputChange('paymentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Receive">Receive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.postingDate}
                  onChange={(e) => handleInputChange('postingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party Type
                </label>
                <select
                  value={formData.partyType}
                  onChange={(e) => handleInputChange('partyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.party}
                  onChange={(e) => handleInputChange('party', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.party ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer, index) => (
                    <option key={index} value={customer}>{customer}</option>
                  ))}
                </select>
                {errors.party && <p className="text-red-500 text-xs mt-1">{errors.party}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentMethod ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference No
                </label>
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Payment reference"
                />
              </div>
            </div>

            {/* Payment Allocation */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Allocation</h3>
                <button
                  onClick={addReference}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Reference</span>
                </button>
              </div>

              {references.length > 0 && (
                <div className="space-y-4">
                  {references.map((reference, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <select
                          value={reference.referenceType}
                          onChange={(e) => handleReferenceChange(index, 'referenceType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Sales Invoice">Sales Invoice</option>
                          <option value="Journal Entry">Journal Entry</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <select
                          value={reference.referenceName}
                          onChange={(e) => handleReferenceChange(index, 'referenceName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Invoice</option>
                          {invoices
                            .filter(inv => inv.customer === formData.party)
                            .map((invoice, idx) => (
                            <option key={idx} value={invoice.id}>
                              {invoice.id} - ₹{invoice.outstanding.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32">
                        <input
                          type="number"
                          value={reference.amount}
                          onChange={(e) => handleReferenceChange(index, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      <button
                        onClick={() => removeReference(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Allocation Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Total Payment Amount</p>
                    <p className="text-lg font-bold text-blue-900">₹{parseFloat(formData.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Allocated Amount</p>
                    <p className="text-lg font-bold text-green-900">₹{totalAllocated.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-600">Unallocated Amount</p>
                    <p className="text-lg font-bold text-orange-900">₹{outstanding.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating Payment...' : 'Create Payment Receipt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptForm;