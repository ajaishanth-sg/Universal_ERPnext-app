import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Route,
  Warehouse,
  FileText,
  Download,
  Upload,
  MoreVertical,
  Navigation,
  Car,
  Plane,
  Ship,
  Timer,
  X
} from 'lucide-react';

const LogisticsDashboard = ({ onBack }) => {

  // State for shipments
  const [shipments, setShipments] = useState([]);

  // State for inventory
  const [inventory, setInventory] = useState([]);

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showViewShipment, setShowViewShipment] = useState(false);
  const [showViewInventory, setShowViewInventory] = useState(false);
  const [showEditShipment, setShowEditShipment] = useState(false);
  const [showEditInventory, setShowEditInventory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [shipmentsRes, inventoryRes] = await Promise.all([
          fetch('http://localhost:5000/api/shipments'),
          fetch('http://localhost:5000/api/inventory')
        ]);

        if (shipmentsRes.ok) {
          const shipmentsData = await shipmentsRes.json();
          setShipments(shipmentsData);
        }

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          setInventory(inventoryData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);
  const [newShipment, setNewShipment] = useState({
    title: '',
    type: '',
    origin: '',
    destination: '',
    departureDate: '',
    estimatedArrival: '',
    transportMethod: '',
    carrier: '',
    trackingNumber: '',
    contents: [],
    totalWeight: '',
    totalValue: '',
    insurance: '',
    cost: '',
    priority: '',
    notes: ''
  });
  const [newInventory, setNewInventory] = useState({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    location: '',
    supplier: '',
    partNumber: '',
    unitCost: '',
    expiryDate: '',
    notes: ''
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportIcon = (method) => {
    switch (method) {
      case 'Air Freight':
        return Plane;
      case 'Sea Freight':
        return Ship;
      case 'Ground Transport':
        return Truck;
      case 'Air Express':
        return Plane;
      default:
        return Package;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // CRUD functions
  const handleAddShipment = async () => {
    setLoading(true);
    try {
      const shipment = {
        ...newShipment,
        status: 'Pending',
        createdBy: 'Logistics Manager',
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('http://localhost:5000/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipment),
      });

      if (response.ok) {
        const newShipmentData = await response.json();
        setShipments(prev => [...prev, newShipmentData]);
        setNewShipment({
          title: '',
          type: '',
          origin: '',
          destination: '',
          departureDate: '',
          estimatedArrival: '',
          transportMethod: '',
          carrier: '',
          trackingNumber: '',
          contents: [],
          totalWeight: '',
          totalValue: '',
          insurance: '',
          cost: '',
          priority: '',
          notes: ''
        });
        setShowAddShipment(false);
      } else {
        console.error('Failed to add shipment');
      }
    } catch (error) {
      console.error('Error adding shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async () => {
    setLoading(true);
    try {
      const item = {
        ...newInventory,
        totalValue: parseFloat(newInventory.quantity) * parseFloat(newInventory.unitCost),
        status: parseFloat(newInventory.quantity) === 0 ? 'Out of Stock' :
                parseFloat(newInventory.quantity) <= parseFloat(newInventory.minQuantity) ? 'Low Stock' : 'In Stock'
      };

      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const newInventoryData = await response.json();
        setInventory(prev => [...prev, newInventoryData]);
        setNewInventory({
          name: '',
          category: '',
          quantity: '',
          minQuantity: '',
          maxQuantity: '',
          location: '',
          supplier: '',
          partNumber: '',
          unitCost: '',
          expiryDate: '',
          notes: ''
        });
        setShowAddInventory(false);
      } else {
        console.error('Failed to add inventory item');
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShipment = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/shipments/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setShipments(prev => prev.filter(s => s.id !== id));
        } else {
          console.error('Failed to delete shipment');
        }
      } catch (error) {
        console.error('Error deleting shipment:', error);
      }
    }
  };

  const handleDeleteInventory = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setInventory(prev => prev.filter(i => i.id !== id));
        } else {
          console.error('Failed to delete inventory item');
        }
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleViewShipment = (shipment) => {
    setSelectedItem(shipment);
    setShowViewShipment(true);
  };

  const handleViewInventory = (item) => {
    setSelectedItem(item);
    setShowViewInventory(true);
  };

  const handleEditShipment = (shipment) => {
    setSelectedItem(shipment);
    setNewShipment(shipment);
    setShowEditShipment(true);
  };

  const handleEditInventory = (item) => {
    setSelectedItem(item);
    setNewInventory(item);
    setShowEditInventory(true);
  };

  const handleUpdateShipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/shipments/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShipment),
      });

      if (response.ok) {
        const updatedShipment = await response.json();
        setShipments(prev => prev.map(s => s.id === selectedItem.id ? updatedShipment : s));
        setShowEditShipment(false);
        setSelectedItem(null);
        setNewShipment({
          title: '',
          type: '',
          origin: '',
          destination: '',
          departureDate: '',
          estimatedArrival: '',
          transportMethod: '',
          carrier: '',
          trackingNumber: '',
          contents: [],
          totalWeight: '',
          totalValue: '',
          insurance: '',
          cost: '',
          priority: '',
          notes: ''
        });
      } else {
        console.error('Failed to update shipment');
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async () => {
    setLoading(true);
    try {
      const item = {
        ...newInventory,
        totalValue: parseFloat(newInventory.quantity) * parseFloat(newInventory.unitCost),
        status: parseFloat(newInventory.quantity) === 0 ? 'Out of Stock' :
                parseFloat(newInventory.quantity) <= parseFloat(newInventory.minQuantity) ? 'Low Stock' : 'In Stock'
      };

      const response = await fetch(`http://localhost:5000/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setInventory(prev => prev.map(i => i.id === selectedItem.id ? updatedItem : i));
        setShowEditInventory(false);
        setSelectedItem(null);
        setNewInventory({
          name: '',
          category: '',
          quantity: '',
          minQuantity: '',
          maxQuantity: '',
          location: '',
          supplier: '',
          partNumber: '',
          unitCost: '',
          expiryDate: '',
          notes: ''
        });
      } else {
        console.error('Failed to update inventory item');
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Export shipments and inventory data to CSV
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logistics_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    let csv = 'Type,Title/Name,Status,Origin/Destination,Date,Value,Cost\n';

    // Add shipments
    shipments.forEach(shipment => {
      csv += `Shipment,"${shipment.title}","${shipment.status}","${shipment.origin} → ${shipment.destination}","${shipment.departureDate}",$${shipment.totalValue},$${shipment.cost}\n`;
    });

    // Add inventory
    inventory.forEach(item => {
      csv += `Inventory,"${item.name}","${item.status}","${item.location}","${item.expiryDate || 'N/A'}",$${item.totalValue},$${item.unitCost}\n`;
    });

    return csv;
  };

  // Filtering logic
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesType = filterType === 'all' || shipment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats calculation
  const logisticsStats = [
    {
      title: "Active Shipments",
      value: shipments.filter(s => s.status === 'In Transit' || s.status === 'Pending').length,
      icon: Truck,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Total Inventory Items",
      value: inventory.length,
      icon: Package,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Low Stock Items",
      value: inventory.filter(i => i.status === 'Low Stock').length,
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Total Inventory Value",
      value: `$${inventory.reduce((sum, i) => sum + i.totalValue, 0).toLocaleString()}`,
      icon: Warehouse,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const shipmentTypes = ['all', 'Race Equipment', 'Testing Equipment', 'Emergency Parts', 'Storage Transfer'];

  // Render
  return (
    <div className="p-6 space-y-6 bg-white min-h-full text-black">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <p className="text-gray-600 mt-1">
              Manage shipments, inventory, and logistics operations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddShipment(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shipment</span>
          </button>
          <button
            onClick={() => setShowAddInventory(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logisticsStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search shipments by title, tracking number, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                {shipmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => {
          const TransportIcon = getTransportIcon(shipment.transportMethod);
          return (
            <div key={shipment.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TransportIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {shipment.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {shipment.type} • {shipment.trackingNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">
                      {shipment.origin} → {shipment.destination}
                    </p>
                    <p className="text-sm text-slate-600">
                      {shipment.departureDate} - {shipment.estimatedArrival}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                      {shipment.priority}
                    </span>
                    <div className="relative">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewShipment(shipment)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditShipment(shipment)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit Shipment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShipment(shipment.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete Shipment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Weight:</span>
                  <span className="text-slate-800">{shipment.totalWeight}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Items:</span>
                  <span className="text-slate-800">{shipment.contents.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Carrier:</span>
                  <span className="text-slate-800">{shipment.carrier}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">Cost:</span>
                  <span className="text-slate-800">${shipment.cost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Inventory Management</h2>
          <button
            onClick={() => setShowAddInventory(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInventoryStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.unitCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.totalValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewInventory(item)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditInventory(item)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInventory(item.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete Item"
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

        {inventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first inventory item</p>
            <button
              onClick={() => setShowAddInventory(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Inventory Item
            </button>
          </div>
        )}
      </div>

      {/* Add Shipment Modal */}
      {showAddShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Shipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Shipment Title *
                </label>
                <input
                  type="text"
                  value={newShipment.title}
                  onChange={(e) => setNewShipment({...newShipment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Monaco GP Equipment Transport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type *
                </label>
                <select
                  value={newShipment.type}
                  onChange={(e) => setNewShipment({...newShipment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Race Equipment">Race Equipment</option>
                  <option value="Testing Equipment">Testing Equipment</option>
                  <option value="Emergency Parts">Emergency Parts</option>
                  <option value="Storage Transfer">Storage Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={newShipment.priority}
                  onChange={(e) => setNewShipment({...newShipment, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Origin *
                </label>
                <input
                  type="text"
                  value={newShipment.origin}
                  onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={newShipment.destination}
                  onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  value={newShipment.departureDate}
                  onChange={(e) => setNewShipment({...newShipment, departureDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estimated Arrival *
                </label>
                <input
                  type="date"
                  value={newShipment.estimatedArrival}
                  onChange={(e) => setNewShipment({...newShipment, estimatedArrival: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transport Method
                </label>
                <select
                  value={newShipment.transportMethod}
                  onChange={(e) => setNewShipment({...newShipment, transportMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Ground Transport">Ground Transport</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Air Express">Air Express</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Carrier
                </label>
                <input
                  type="text"
                  value={newShipment.carrier}
                  onChange={(e) => setNewShipment({...newShipment, carrier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., DHL Global Forwarding"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={newShipment.trackingNumber}
                  onChange={(e) => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., DHLMON2024001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Weight
                </label>
                <input
                  type="text"
                  value={newShipment.totalWeight}
                  onChange={(e) => setNewShipment({...newShipment, totalWeight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., 620kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Value ($)
                </label>
                <input
                  type="number"
                  value={newShipment.totalValue}
                  onChange={(e) => setNewShipment({...newShipment, totalValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="155000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Insurance ($)
                </label>
                <input
                  type="number"
                  value={newShipment.insurance}
                  onChange={(e) => setNewShipment({...newShipment, insurance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="155000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cost ($)
                </label>
                <input
                  type="number"
                  value={newShipment.cost}
                  onChange={(e) => setNewShipment({...newShipment, cost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="8500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newShipment.notes}
                  onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  rows={3}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddShipment(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShipment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Modal */}
      {showAddInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Inventory Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newInventory.name}
                  onChange={(e) => setNewInventory({...newInventory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Pirelli Racing Tyres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newInventory.category}
                  onChange={(e) => setNewInventory({...newInventory, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Parts">Parts</option>
                  <option value="Tyres">Tyres</option>
                  <option value="Lubricants">Lubricants</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Engine">Engine</option>
                  <option value="Aerodynamics">Aerodynamics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={newInventory.quantity}
                  onChange={(e) => setNewInventory({...newInventory, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Min Quantity
                </label>
                <input
                  type="number"
                  value={newInventory.minQuantity}
                  onChange={(e) => setNewInventory({...newInventory, minQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Quantity
                </label>
                <input
                  type="number"
                  value={newInventory.maxQuantity}
                  onChange={(e) => setNewInventory({...newInventory, maxQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <select
                  value={newInventory.location}
                  onChange={(e) => setNewInventory({...newInventory, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Satellite Warehouse">Satellite Warehouse</option>
                  <option value="Trackside Storage">Trackside Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={newInventory.supplier}
                  onChange={(e) => setNewInventory({...newInventory, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Pirelli Racing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={newInventory.partNumber}
                  onChange={(e) => setNewInventory({...newInventory, partNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., PRT-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Unit Cost ($)
                </label>
                <input
                  type="number"
                  value={newInventory.unitCost}
                  onChange={(e) => setNewInventory({...newInventory, unitCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="850"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newInventory.expiryDate}
                  onChange={(e) => setNewInventory({...newInventory, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newInventory.notes}
                  onChange={(e) => setNewInventory({...newInventory, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  rows={3}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddInventory(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInventory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Shipment Modal */}
      {showViewShipment && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Shipment Details</h2>
              <button
                onClick={() => setShowViewShipment(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <p className="text-slate-800">{selectedItem.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <p className="text-slate-800">{selectedItem.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)}`}>
                    {selectedItem.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Origin</label>
                  <p className="text-slate-800">{selectedItem.origin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                  <p className="text-slate-800">{selectedItem.destination}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Departure Date</label>
                  <p className="text-slate-800">{selectedItem.departureDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Arrival</label>
                  <p className="text-slate-800">{selectedItem.estimatedArrival}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transport Method</label>
                  <p className="text-slate-800">{selectedItem.transportMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Carrier</label>
                  <p className="text-slate-800">{selectedItem.carrier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                  <p className="text-slate-800">{selectedItem.trackingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Weight</label>
                  <p className="text-slate-800">{selectedItem.totalWeight}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Value</label>
                  <p className="text-slate-800">${selectedItem.totalValue}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cost</label>
                  <p className="text-slate-800">${selectedItem.cost}</p>
                </div>
              </div>

              {selectedItem.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <p className="text-slate-800">{selectedItem.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowViewShipment(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewShipment(false);
                    handleEditShipment(selectedItem);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shipment Modal */}
      {showEditShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Shipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Shipment Title *
                </label>
                <input
                  type="text"
                  value={newShipment.title}
                  onChange={(e) => setNewShipment({...newShipment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Monaco GP Equipment Transport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type *
                </label>
                <select
                  value={newShipment.type}
                  onChange={(e) => setNewShipment({...newShipment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Race Equipment">Race Equipment</option>
                  <option value="Testing Equipment">Testing Equipment</option>
                  <option value="Emergency Parts">Emergency Parts</option>
                  <option value="Storage Transfer">Storage Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={newShipment.priority}
                  onChange={(e) => setNewShipment({...newShipment, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Origin *
                </label>
                <input
                  type="text"
                  value={newShipment.origin}
                  onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={newShipment.destination}
                  onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  value={newShipment.departureDate}
                  onChange={(e) => setNewShipment({...newShipment, departureDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estimated Arrival *
                </label>
                <input
                  type="date"
                  value={newShipment.estimatedArrival}
                  onChange={(e) => setNewShipment({...newShipment, estimatedArrival: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transport Method
                </label>
                <select
                  value={newShipment.transportMethod}
                  onChange={(e) => setNewShipment({...newShipment, transportMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Ground Transport">Ground Transport</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Air Express">Air Express</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Carrier
                </label>
                <input
                  type="text"
                  value={newShipment.carrier}
                  onChange={(e) => setNewShipment({...newShipment, carrier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., DHL Global Forwarding"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={newShipment.trackingNumber}
                  onChange={(e) => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., DHLMON2024001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Weight
                </label>
                <input
                  type="text"
                  value={newShipment.totalWeight}
                  onChange={(e) => setNewShipment({...newShipment, totalWeight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., 620kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Value ($)
                </label>
                <input
                  type="number"
                  value={newShipment.totalValue}
                  onChange={(e) => setNewShipment({...newShipment, totalValue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="155000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cost ($)
                </label>
                <input
                  type="number"
                  value={newShipment.cost}
                  onChange={(e) => setNewShipment({...newShipment, cost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="8500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newShipment.notes}
                  onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  rows={3}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditShipment(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateShipment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Inventory Modal */}
      {showViewInventory && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Inventory Item Details</h2>
              <button
                onClick={() => setShowViewInventory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <p className="text-slate-800">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <p className="text-slate-800">{selectedItem.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <p className="text-slate-800">{selectedItem.quantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getInventoryStatusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Quantity</label>
                  <p className="text-slate-800">{selectedItem.minQuantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Quantity</label>
                  <p className="text-slate-800">{selectedItem.maxQuantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <p className="text-slate-800">{selectedItem.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                  <p className="text-slate-800">{selectedItem.supplier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Part Number</label>
                  <p className="text-slate-800">{selectedItem.partNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Cost</label>
                  <p className="text-slate-800">${selectedItem.unitCost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Value</label>
                  <p className="text-slate-800">${selectedItem.totalValue}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <p className="text-slate-800">{selectedItem.expiryDate || 'N/A'}</p>
                </div>
              </div>

              {selectedItem.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <p className="text-slate-800">{selectedItem.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowViewInventory(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewInventory(false);
                    handleEditInventory(selectedItem);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {showEditInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Inventory Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newInventory.name}
                  onChange={(e) => setNewInventory({...newInventory, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Pirelli Racing Tyres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newInventory.category}
                  onChange={(e) => setNewInventory({...newInventory, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Parts">Parts</option>
                  <option value="Tyres">Tyres</option>
                  <option value="Lubricants">Lubricants</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Engine">Engine</option>
                  <option value="Aerodynamics">Aerodynamics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={newInventory.quantity}
                  onChange={(e) => setNewInventory({...newInventory, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Min Quantity
                </label>
                <input
                  type="number"
                  value={newInventory.minQuantity}
                  onChange={(e) => setNewInventory({...newInventory, minQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Quantity
                </label>
                <input
                  type="number"
                  value={newInventory.maxQuantity}
                  onChange={(e) => setNewInventory({...newInventory, maxQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <select
                  value={newInventory.location}
                  onChange={(e) => setNewInventory({...newInventory, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Satellite Warehouse">Satellite Warehouse</option>
                  <option value="Trackside Storage">Trackside Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={newInventory.supplier}
                  onChange={(e) => setNewInventory({...newInventory, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., Pirelli Racing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={newInventory.partNumber}
                  onChange={(e) => setNewInventory({...newInventory, partNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="e.g., PRT-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Unit Cost ($)
                </label>
                <input
                  type="number"
                  value={newInventory.unitCost}
                  onChange={(e) => setNewInventory({...newInventory, unitCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="850"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newInventory.expiryDate}
                  onChange={(e) => setNewInventory({...newInventory, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newInventory.notes}
                  onChange={(e) => setNewInventory({...newInventory, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  rows={3}
                  placeholder="Additional notes or special requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditInventory(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateInventory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsDashboard;
