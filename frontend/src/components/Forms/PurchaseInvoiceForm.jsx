import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Save,
  ArrowLeft,
  Calendar,
  Settings,
  Check,
  Upload,
  Download
} from 'lucide-react';

const NewPurchaseInvoiceForm = ({ onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState('Details');
  const [formData, setFormData] = useState({
    series: '',
    date: '',
    supplier: '',
    postingTime: '',
    dueDate: '',
    isPaid: false,
    isReturn: false,
    applyTaxWithholding: false,
    isReverseCharge: false,
    editPostingDateTime: false,
    updateStock: false,
    isSubcontracted: false,
    taxCategory: '',
    shippingRule: '',
    incoterm: '',
    purchaseTaxTemplate: '',
    useCompanyRoundOff: false
  });

  const [items, setItems] = useState([
    { id: 1, item: '', acceptedQty: 0, rate: 0, amount: 0 }
  ]);

  const [taxCharges, setTaxCharges] = useState([]);
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
        // Auto-calculate amount when quantity or rate changes
        if (field === 'acceptedQty' || field === 'rate') {
          updatedItem.amount = (updatedItem.acceptedQty || 0) * (updatedItem.rate || 0);
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
      acceptedQty: 0,
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

  // Calculate totals
  const totalQuantity = items.reduce((sum, item) => sum + (parseFloat(item.acceptedQty) || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalTaxesAdded = taxCharges.reduce((sum, tax) => sum + (parseFloat(tax.amount) || 0), 0);
  const grandTotal = totalAmount + totalTaxesAdded;
  const roundedTotal = Math.round(grandTotal * 100) / 100;
  const roundingAdjustment = roundedTotal - grandTotal;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.series) newErrors.series = 'Series is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status = 'Draft') => {
    if (validateForm()) {
      const newInvoice = {
        ...formData,
        id: `PINV-${Date.now()}`,
        status,
        lastUpdated: new Date().toLocaleDateString(),
        createdBy: 'Current User',
        items,
        taxCharges,
        totalQuantity,
        totalAmount,
        totalTaxesAdded,
        grandTotal: roundedTotal
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
              errors.series ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="PINV-.YY.-">PINV-.YY.-</option>
            <option value="PINV-.MM.-">PINV-.MM.-</option>
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
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div className="flex items-center space-x-4 pt-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPaid}
              onChange={(e) => handleInputChange('isPaid', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Is Paid</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.supplier ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Select supplier"
          />
          {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posting Time
          </label>
          <input
            type="time"
            value={formData.postingTime}
            onChange={(e) => handleInputChange('postingTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4 pt-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isReturn}
              onChange={(e) => handleInputChange('isReturn', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Is Return (Debit Note)</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.editPostingDateTime}
              onChange={(e) => handleInputChange('editPostingDateTime', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Edit Posting Date and Time</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4 pt-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.applyTaxWithholding}
              onChange={(e) => handleInputChange('applyTaxWithholding', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Apply Tax Withholding Amount</span>
          </label>
        </div>

        <div className="flex items-center space-x-4 pt-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isReverseCharge}
              onChange={(e) => handleInputChange('isReverseCharge', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Is Reverse Charge</span>
          </label>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Scan Barcode</label>
          <input
            type="text"
            placeholder="Scan barcode here"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isSubcontracted}
              onChange={(e) => handleInputChange('isSubcontracted', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Is Subcontracted</span>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Accepted Qty <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rate (INR) <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (INR) <span className="text-red-500">*</span>
                </th>
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
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Select item"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.acceptedQty}
                      onChange={(e) => handleItemChange(index, 'acceptedQty', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <X className="w-4 h-4" />
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
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
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

      {/* Taxes and Charges */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Taxes and Charges</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Category</label>
            <input
              type="text"
              value={formData.taxCategory}
              onChange={(e) => handleInputChange('taxCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select tax category"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Rule</label>
            <input
              type="text"
              value={formData.shippingRule}
              onChange={(e) => handleInputChange('shippingRule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select shipping rule"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incoterm</label>
            <input
              type="text"
              value={formData.incoterm}
              onChange={(e) => handleInputChange('incoterm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select incoterm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Taxes and Charges Template</label>
          <input
            type="text"
            value={formData.purchaseTaxTemplate}
            onChange={(e) => handleInputChange('purchaseTaxTemplate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select template"
          />
        </div>

        <h4 className="text-md font-medium text-gray-900 mb-4">Purchase Taxes and Charges</h4>
        
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account Head <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxCharges.map((charge, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{charge.id}</td>
                    <td className="px-4 py-3">
                      <select 
                        value={charge.type}
                        onChange={(e) => handleTaxChange(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="GST">GST</option>
                        <option value="VAT">VAT</option>
                        <option value="TDS">TDS</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={charge.accountHead}
                        onChange={(e) => handleTaxChange(index, 'accountHead', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Account"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.taxRate}
                        onChange={(e) => handleTaxChange(index, 'taxRate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.amount}
                        onChange={(e) => handleTaxChange(index, 'amount', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={charge.total}
                        onChange={(e) => handleTaxChange(index, 'total', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeTaxRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
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

        {/* Tax Summary */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxes and Charges Added (INR)</span>
                <span className="text-sm font-medium">₹ {totalTaxesAdded.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxes and Charges Deducted (INR)</span>
                <span className="text-sm font-medium">₹ 0.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-gray-900">Total Taxes and Charges (INR)</span>
                <span className="text-sm font-medium">₹ {totalTaxesAdded.toFixed(2)}</span>
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
              <span className="text-lg font-medium text-gray-900">Grand Total (INR)</span>
              <span className="text-lg font-medium">₹ {grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rounding Adjustment (INR)</span>
              <span className="text-sm font-medium">₹ {roundingAdjustment.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useCompanyRoundOff}
                  onChange={(e) => handleInputChange('useCompanyRoundOff', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-600">Use Company Default Round Off Cost Center</span>
              </label>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-lg font-bold text-gray-900">Rounded Total (INR)</span>
              <span className="text-lg font-bold">₹ {roundedTotal.toFixed(2)}</span>
            </div>
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
        return <div className="p-8 text-center text-gray-500">Payment details section will be implemented here</div>;
      case 'Address & Contact':
        return <div className="p-8 text-center text-gray-500">Address & Contact section will be implemented here</div>;
      case 'Terms':
        return <div className="p-8 text-center text-gray-500">Terms section will be implemented here</div>;
      case 'More Info':
        return <div className="p-8 text-center text-gray-500">More Info section will be implemented here</div>;
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
            {/* Breadcrumb */}
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
                <span className="text-gray-500">Purchase Invoice</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">New Purchase Invoice</span>
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <h1 className="text-lg font-semibold text-gray-900">New Purchase Invoice</h1>
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <span>Not Saved</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
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
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleSubmit('Draft')}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
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

const PurchaseInvoiceForm = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({
    id: '',
    supplier: '',
    status: '',
    amount: ''
  });

  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/purchase-invoices');
        if (response.ok) {
          const data = await response.json();
          setPurchaseInvoices(data);
        }
      } catch (error) {
        console.error('Error loading purchase invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      supplier: '',
      status: '',
      amount: ''
    });
  };

  const handleSavePurchaseInvoice = async (invoiceData) => {
    try {
      const response = await fetch('http://localhost:5000/api/purchase-invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const newInvoice = await response.json();
        setPurchaseInvoices(prev => [...prev, newInvoice]);
        setShowNewForm(false);
      } else {
        console.error('Failed to save purchase invoice');
      }
    } catch (error) {
      console.error('Error saving purchase invoice:', error);
    }
  };

  const handleDeleteInvoice = (invoiceId) => {
    setPurchaseInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
  };

  const handleEditInvoice = (invoiceId) => {
    alert(`Edit functionality for invoice ${invoiceId} will be implemented here`);
  };

  const handleViewInvoice = (invoiceId) => {
    alert(`View functionality for invoice ${invoiceId} will be implemented here`);
  };

  // Filter invoices based on table filters
  const filteredInvoices = purchaseInvoices.filter(invoice => {
    return (
      (!tableFilters.id || invoice.id.toLowerCase().includes(tableFilters.id.toLowerCase())) &&
      (!tableFilters.supplier || invoice.supplier.toLowerCase().includes(tableFilters.supplier.toLowerCase())) &&
      (!tableFilters.status || invoice.status.toLowerCase().includes(tableFilters.status.toLowerCase())) &&
      (!tableFilters.amount || invoice.grandTotal.toString().includes(tableFilters.amount))
    );
  });

  if (showNewForm) {
    return <NewPurchaseInvoiceForm onBack={() => setShowNewForm(false)} onSave={handleSavePurchaseInvoice} />;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Purchase Invoice</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter By</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assigned To</label>
                  <select 
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Created By</label>
                  <select 
                    value={filters.createdBy}
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Edit Filters
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tags</label>
                  <select 
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="urgent">Urgent</option>
                    <option value="review">Review</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Show Tags
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    Save Filter
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Filter Name"
                    value={filters.filterName}
                    onChange={(e) => handleFilterChange('filterName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <span>List View</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Purchase Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ID"
                value={tableFilters.id}
                onChange={(e) => handleTableFilterChange('id', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Supplier"
                value={tableFilters.supplier}
                onChange={(e) => handleTableFilterChange('supplier', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tableFilters.status}
                onChange={(e) => handleTableFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
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
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {purchaseInvoices.length === 0 
                  ? "You haven't created a Purchase Invoice yet"
                  : "No invoices match your filters"
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {purchaseInvoices.length === 0 
                  ? "Get started by creating your first Purchase Invoice"
                  : "Try adjusting your search criteria"
                }
              </p>
              <button 
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {purchaseInvoices.length === 0 
                  ? "Create your first Purchase Invoice"
                  : "Create new Purchase Invoice"
                }
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grand Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.totalQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{invoice.grandTotal.toFixed(2)}
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
                          {invoice.lastUpdated}
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
              </div>
              
              {/* Summary */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {filteredInvoices.length} of {purchaseInvoices.length} invoices
                </span>
                <span>
                  Total Amount: ₹{filteredInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              {[20, 100, 500, 2500].map((count) => (
                <button
                  key={count}
                  onClick={() => setItemsPerPage(count)}
                  className={`px-2 py-1 text-sm rounded ${
                    itemsPerPage === count
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {filteredInvoices.length > 0 && `Page 1 of ${Math.ceil(filteredInvoices.length / itemsPerPage)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoiceForm;