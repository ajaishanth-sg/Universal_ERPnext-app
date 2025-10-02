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
  Trash2
} from 'lucide-react';

const GenericForm = ({ 
  title, 
  onBack, 
  columns = [], 
  data = [], 
  emptyMessage = "You haven't created any entries yet",
  createButtonText = "Create your first entry",
  addButtonText = "Add Entry"
}) => {
  const [filters, setFilters] = useState({
    assignedTo: '',
    createdBy: '',
    tags: '',
    filterName: ''
  });

  const [tableFilters, setTableFilters] = useState({});
  const [showTags, setShowTags] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
    setTableFilters({});
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
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
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
                  <button 
                    onClick={() => setShowTags(!showTags)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
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
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{addButtonText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Filters */}
        {columns.length > 0 && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {columns.map((column, index) => (
                  <div key={index}>
                    {column.type === 'select' ? (
                      <select
                        value={tableFilters[column.key] || ''}
                        onChange={(e) => handleTableFilterChange(column.key, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{column.placeholder}</option>
                        {column.options?.map((option, optIndex) => (
                          <option key={optIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={column.placeholder}
                        value={tableFilters[column.key] || ''}
                        onChange={(e) => handleTableFilterChange(column.key, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
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
        )}

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {emptyMessage}
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first entry
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {createButtonText}
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column.label}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item[column.key]}
                          </td>
                        ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericForm;
