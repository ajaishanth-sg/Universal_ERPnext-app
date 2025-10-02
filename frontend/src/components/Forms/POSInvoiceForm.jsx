import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, ArrowLeft, Trash2, Upload, Download, Search, 
  Filter, MoreHorizontal, RefreshCw, FileText, ChevronDown, ChevronRight,
  X, Eye, Edit, Calendar, Settings, Check
} from 'lucide-react';

const ComprehensivePOSInvoiceForm = ({ onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState({
    series: 'ACC-PSINV-YYYY-',
    date: '2025-09-22',
    customer: '',
    postingTime: '09:21:25',
    paymentDueDate: '',
    includePaymentPOS: true,
    isReturn: false,
    isRateAdjustment: false,
    editPostingDateTime: false,
    updateStock: false,
    taxCategory: '',
    shippingRule: '',
    incoterm: '',
    salesTaxTemplate: '',
    applyDiscountOn: 'Grand Total',
    isCashDiscount: false,
    discountPercentage: '',
    discountAmount: '',
    useCompanyRoundOff: false,
    project: '',
    costCenter: '',
    customerPO: '',
    customerPODate: '',
    customerAddress: '',
    shippingAddressName: '',
    placeOfSupply: '',
    companyAddressName: '',
    contactPerson: '',
    companyContactPerson: '',
    territory: '',
    scanBarcode: '',
    terms: '',
    termsDetails: '',
    letterHead: '',
    printHeading: '',
    groupSameItems: false,
    salesPartner: '',
    commissionRate: 0,
    totalCommission: 0,
    fromDate: '',
    toDate: ''
  });

  const [items, setItems] = useState([
    { id: 1, item: '', quantity: 0, rate: 0, amount: 0 }
  ]);

  const [taxCharges, setTaxCharges] = useState([]);
  const [timeSheets, setTimeSheets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [salesTeam, setSalesTeam] = useState([]);

  const [expandedSections, setExpandedSections] = useState({
    accountingDimensions: false,
    customerPODetails: false,
    addressContact: false,
    additionalDiscount: false,
    timeSheetList: false,
    paymentsSection: false,
    termsConditions: false,
    printingSettings: false,
    commission: false,
    salesTeamSection: false,
    subscription: false
  });

  const [errors, setErrors] = useState({});

  const tabs = ['Details', 'Payments', 'Address & Contact', 'Terms', 'More Info'];

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

  const handleItemChange = (index, field, value) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.rate || 0);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      id: prev.length + 1,
      item: '',
      quantity: 0,
      rate: 0,
      amount: 0
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addTaxRow = () => {
    setTaxCharges(prev => [...prev, {
      id: prev.length + 1,
      type: '',
      accountHead: '',
      taxRate: 0,
      amount: 0,
      total: 0
    }]);
  };

  const removeTaxRow = (index) => {
    setTaxCharges(prev => prev.filter((_, i) => i !== index));
  };

  const handleTaxChange = (index, field, value) => {
    setTaxCharges(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addPayment = () => {
    setPayments(prev => [...prev, {
      id: prev.length + 1,
      modeOfPayment: '',
      amount: 0
    }]);
  };

  const removePayment = (index) => {
    setPayments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (index, field, value) => {
    setPayments(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addSalesTeamMember = () => {
    setSalesTeam(prev => [...prev, {
      id: prev.length + 1,
      salesPerson: '',
      contribution: 0,
      contributionToNetTotal: 0,
      commissionRate: 0,
      incentives: 0
    }]);
  };

  const removeSalesTeamMember = (index) => {
    setSalesTeam(prev => prev.filter((_, i) => i !== index));
  };

  const handleSalesTeamChange = (index, field, value) => {
    setSalesTeam(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate totals
  const totalQuantity = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalTaxes = taxCharges.reduce((sum, tax) => sum + (parseFloat(tax.amount) || 0), 0);
  const totalPayments = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  
  const grandTotal = totalAmount + totalTaxes;
  const discountAmount = parseFloat(formData.discountAmount) || 0;
  const discountPercentage = parseFloat(formData.discountPercentage) || 0;
  const calculatedDiscountAmount = discountPercentage ? (grandTotal * discountPercentage / 100) : discountAmount;
  
  const finalGrandTotal = grandTotal - calculatedDiscountAmount;
  const roundedTotal = Math.round(finalGrandTotal * 100) / 100;
  const roundingAdjustment = roundedTotal - finalGrandTotal;
  const outstandingAmount = roundedTotal - totalPayments;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.series) newErrors.series = 'Series is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status = 'Draft') => {
    if (validateForm()) {
      const newInvoice = {
        ...formData,
        id: `POS-INV-${Date.now()}`,
        status,
        lastUpdated: new Date().toLocaleDateString(),
        createdBy: 'Current User',
        items,
        taxCharges,
        payments,
        salesTeam,
        totalQuantity,
        totalAmount,
        totalTaxes,
        grandTotal: roundedTotal,
        outstandingAmount,
        calculatedDiscountAmount
      };
      onSave(newInvoice);
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-8">
      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Series <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.series}
            onChange={(e) => handleInputChange('series', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.series ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="ACC-PSINV-YYYY-">ACC-PSINV-YYYY-</option>
          </select>
          {errors.series && <p className="text-red-500 text-xs mt-1">{errors.series}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Posting Time</label>
          <input
            type="time"
            value={formData.postingTime}
            onChange={(e) => handleInputChange('postingTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.customer}
            onChange={(e) => handleInputChange('customer', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customer ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Select customer"
          />
          {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">POS Profile</label>
          <input
            type="text"
            value={formData.posProfile}
            onChange={(e) => handleInputChange('posProfile', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Due Date</label>
          <input
            type="date"
            value={formData.paymentDueDate}
            onChange={(e) => handleInputChange('paymentDueDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.editPostingDateTime}
            onChange={(e) => handleInputChange('editPostingDateTime', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Edit Posting Date and Time</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includePaymentPOS}
            onChange={(e) => handleInputChange('includePaymentPOS', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include Payment (POS)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isReturn}
            onChange={(e) => handleInputChange('isReturn', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Is Return (Credit Note)</span>
        </label>
      </div>

      {/* Accounting Dimensions */}
      <div>
        <button
          onClick={() => toggleSection('accountingDimensions')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h2 className="text-lg font-medium text-gray-900">Accounting Dimensions</h2>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
            expandedSections.accountingDimensions ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.accountingDimensions && (
          <div className="grid grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cost Center</label>
              <input
                type="text"
                value={formData.costCenter}
                onChange={(e) => handleInputChange('costCenter', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer PO Details */}
      <div>
        <button
          onClick={() => toggleSection('customerPODetails')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h2 className="text-lg font-medium text-gray-900">Customer PO Details</h2>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
            expandedSections.customerPODetails ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.customerPODetails && (
          <div className="grid grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Customer's Purchase Order</label>
              <input
                type="text"
                value={formData.customerPO}
                onChange={(e) => handleInputChange('customerPO', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Customer's Purchase Order Date</label>
              <input
                type="date"
                value={formData.customerPODate}
                onChange={(e) => handleInputChange('customerPODate', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Items Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Scan Barcode</label>
          <input
            type="text"
            value={formData.scanBarcode}
            onChange={(e) => handleInputChange('scanBarcode', e.target.value)}
            placeholder="Scan barcode here"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.updateStock}
              onChange={(e) => handleInputChange('updateStock', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Update Stock</span>
          </label>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate (INR) *</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (INR) *</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Select item"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="₹ 0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={addItem}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Add Row
            </button>
            <button className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              Add Multiple
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Quantity</label>
            <input
              type="number"
              value={totalQuantity}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total (INR)</label>
            <input
              type="text"
              value={`₹ ${totalAmount.toFixed(2)}`}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Sales Taxes and Charges */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Taxes and Charges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sales Taxes and Charges Template</label>
            <input
              type="text"
              value={formData.salesTaxTemplate}
              onChange={(e) => handleInputChange('salesTaxTemplate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select template"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Rule</label>
            <input
              type="text"
              value={formData.shippingRule}
              onChange={(e) => handleInputChange('shippingRule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select shipping rule"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Category</label>
            <input
              type="text"
              value={formData.taxCategory}
              onChange={(e) => handleInputChange('taxCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select tax category"
            />
          </div>
        </div>

        {taxCharges.length === 0 ? (
          <div className="border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No Data</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type *</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Head *</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxCharges.map((charge, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{charge.id}</td>
                    <td className="px-4 py-3">
                      <select 
                        value={charge.type}
                        onChange={(e) => handleTaxChange(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="GST">GST</option>
                        <option value="VAT">VAT</option>
                        <option value="Service Tax">Service Tax</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={charge.accountHead}
                        onChange={(e) => handleTaxChange(index, 'accountHead', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Account"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.taxRate}
                        onChange={(e) => handleTaxChange(index, 'taxRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.amount}
                        onChange={(e) => handleTaxChange(index, 'amount', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.total}
                        onChange={(e) => handleTaxChange(index, 'total', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeTaxRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={addTaxRow}
          className="mt-4 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Add Row
        </button>

        <div className="mt-8 space-y-4">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-900">Total Taxes and Charges (INR)</span>
                <span className="text-sm font-medium">₹ {totalTaxes.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Totals</h3>
        <div className="flex justify-end">
          <div className="w-80 space-y-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-900">Grand Total (INR) *</span>
              <span className="text-lg font-medium">₹ {grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rounding Adjustment (INR)</span>
              <span className="text-sm font-medium">₹ {roundingAdjustment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-lg font-bold text-gray-900">Rounded Total (INR)</span>
              <span className="text-lg font-bold">₹ {roundedTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Outstanding Amount (INR)</span>
              <span className="text-sm font-medium">₹ {outstandingAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Discount */}
      <div>
        <button
          onClick={() => toggleSection('additionalDiscount')}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h2 className="text-lg font-medium text-gray-900">Additional Discount</h2>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
            expandedSections.additionalDiscount ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.additionalDiscount && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Additional Discount On</label>
                <select
                  value={formData.applyDiscountOn}
                  onChange={(e) => handleInputChange('applyDiscountOn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Grand Total">Grand Total</option>
                  <option value="Net Total">Net Total</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Discount Percentage</label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Discount Amount (INR)</label>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Advance Payments</h3>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode of Payment *</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount *</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{payment.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={payment.modeOfPayment}
                      onChange={(e) => handlePaymentChange(index, 'modeOfPayment', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={payment.amount}
                      onChange={(e) => handlePaymentChange(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removePayment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addPayment}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50 mb-4"
        >
          <Plus size={16} />
          Add Row
        </button>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Paid Amount (INR)</label>
            <input
              type="text"
              value={`₹ ${totalPayments.toFixed(2)}`}
              readOnly
              className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Base Change Amount (INR)</label>
            <input
              type="text"
              value="₹ 0.00"
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Change Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Account for Change Amount</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );

  const renderAddressContactTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Customer Address</label>
          <textarea
            value={formData.customerAddress}
            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Shipping Address Name</label>
          <input
            type="text"
            value={formData.shippingAddressName}
            onChange={(e) => handleInputChange('shippingAddressName', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Place of Supply</label>
          <input
            type="text"
            value={formData.placeOfSupply}
            onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company Address Name</label>
          <input
            type="text"
            value={formData.companyAddressName}
            onChange={(e) => handleInputChange('companyAddressName', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Contact Person</label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company Contact Person</label>
          <input
            type="text"
            value={formData.companyContactPerson}
            onChange={(e) => handleInputChange('companyContactPerson', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Territory</label>
          <input
            type="text"
            value={formData.territory}
            onChange={(e) => handleInputChange('territory', e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );

  const renderTermsTab = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium mb-2">Terms</label>
        <input
          type="text"
          value={formData.terms}
          onChange={(e) => handleInputChange('terms', e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Terms and Conditions Details</label>
        <textarea
          value={formData.termsDetails}
          onChange={(e) => handleInputChange('termsDetails', e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2"
          rows="6"
          placeholder="Enter terms and conditions details..."
        />
      </div>
    </div>
  );

  const renderMoreInfoTab = () => (
    <div className="space-y-8">
      {/* Printing Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4">Printing Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Letter Head</label>
            <input
              type="text"
              value={formData.letterHead}
              onChange={(e) => handleInputChange('letterHead', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Print Heading</label>
            <input
              type="text"
              value={formData.printHeading}
              onChange={(e) => handleInputChange('printHeading', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={formData.groupSameItems}
            onChange={(e) => handleInputChange('groupSameItems', e.target.checked)}
          />
          Group same items
        </label>
      </div>

      {/* Commission */}
      <div>
        <h3 className="text-lg font-medium mb-4">Commission</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sales Partner</label>
            <input
              type="text"
              value={formData.salesPartner}
              onChange={(e) => handleInputChange('salesPartner', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={formData.commissionRate}
              onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Commission</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalCommission}
              onChange={(e) => handleInputChange('totalCommission', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Sales Team */}
      <div>
        <h3 className="text-lg font-medium mb-4">Sales Team</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sales Person *</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contribution (%)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contribution to Net Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Incentives</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesTeam.map((member, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{member.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={member.salesPerson}
                      onChange={(e) => handleSalesTeamChange(index, 'salesPerson', e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={member.contribution}
                      onChange={(e) => handleSalesTeamChange(index, 'contribution', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={member.contributionToNetTotal}
                      onChange={(e) => handleSalesTeamChange(index, 'contributionToNetTotal', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={member.commissionRate}
                      onChange={(e) => handleSalesTeamChange(index, 'commissionRate', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={member.incentives}
                      onChange={(e) => handleSalesTeamChange(index, 'incentives', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeSalesTeamMember(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addSalesTeamMember}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-50"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>

      {/* Subscription Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Subscription Section</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">From Date</label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => handleInputChange('fromDate', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To Date</label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => handleInputChange('toDate', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return renderDetailsTab();
      case 'Payments':
        return renderPaymentsTab();
      case 'Address & Contact':
        return renderAddressContactTab();
      case 'Terms':
        return renderTermsTab();
      case 'More Info':
        return renderMoreInfoTab();
      default:
        return renderDetailsTab();
    }
  };

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
                <span className="text-gray-500">Accounting</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">POS Invoice</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">New POS Invoice</span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600 font-medium">Not Saved</span>
                <button 
                  onClick={() => handleSubmit('Draft')}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">New POS Invoice</h1>
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <span>Not Saved</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <span>Get Items From</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
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
                  onClick={() => handleSubmit('Draft')}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleSubmit('Submitted')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save & Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const POSInvoiceSystem = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    customer: '',
    status: '',
    amount: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTableFilterChange = (field, value) => {
    setTableFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setTableFilters({
      id: '',
      customer: '',
      status: '',
      amount: ''
    });
  };

  const handleSaveInvoice = (invoiceData) => {
    setSalesInvoices(prev => [...prev, invoiceData]);
    setShowNewForm(false);
  };

  const handleDeleteInvoice = (invoiceId) => {
    setSalesInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
  };

  const handleEditInvoice = (invoiceId) => {
    alert(`Edit functionality for invoice ${invoiceId} will be implemented here`);
  };

  const handleViewInvoice = (invoiceId) => {
    alert(`View functionality for invoice ${invoiceId} will be implemented here`);
  };

  const filteredInvoices = salesInvoices.filter(invoice => {
    return (
      (!tableFilters.id || invoice.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.customer || invoice.customer.toLowerCase().includes(tableFilters.customer.toLowerCase())) &&
      (!tableFilters.status || invoice.status.toLowerCase().includes(tableFilters.status.toLowerCase())) &&
      (!tableFilters.amount || invoice.grandTotal.toString().includes(tableFilters.amount))
    );
  });

  if (showNewForm) {
    return <ComprehensivePOSInvoiceForm onBack={() => setShowNewForm(false)} onSave={handleSaveInvoice} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChevronDown className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">POS Invoice</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search or type a command (Ctrl + G)"
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <span>List View</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowNewForm(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add POS Invoice</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Filter Sidebar */}
            <div className="w-64 p-6 border-r border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Filter By</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Assigned To</label>
                  <select 
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Created By</label>
                  <select 
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Edit Filters
                </button>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">Tags</label>
                  <select 
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="urgent">Urgent</option>
                    <option value="review">Review</option>
                  </select>
                </div>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Show Tags
                </button>

                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Save Filter
                </button>

                <input
                  type="text"
                  placeholder="Filter Name"
                  value={filters.filterName}
                  onChange={(e) => handleFilterChange('filterName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Table Filters */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="ID"
                    value={tableFilters.id}
                    onChange={(e) => handleTableFilterChange('id', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Customer"
                    value={tableFilters.customer}
                    onChange={(e) => handleTableFilterChange('customer', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={tableFilters.status}
                    onChange={(e) => handleTableFilterChange('status', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={tableFilters.amount}
                    onChange={(e) => handleTableFilterChange('amount', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table Content */}
              <div className="p-6">
                {filteredInvoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      You haven't created a POS Invoice yet
                    </h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first entry</p>
                    <button 
                      onClick={() => setShowNewForm(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create your first POS Invoice
                    </button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            POS Profile
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posting Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInvoices.map((invoice, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                              {invoice.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.customer || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.posProfile || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status === 'Submitted' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {invoice.status === 'Submitted' && <Check className="w-3 h-3 mr-1" />}
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{invoice.grandTotal.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewInvoice(invoice.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditInvoice(invoice.id)}
                                  className="p-1 text-gray-600 hover:text-green-600"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="p-1 text-gray-600 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Showing {filteredInvoices.length} of {salesInvoices.length} invoices
                      </span>
                      <span>
                        Total Amount: ₹{filteredInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSInvoiceSystem;