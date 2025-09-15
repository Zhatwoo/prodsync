'use client';

import { useState, useEffect } from 'react';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  // Sample data - in real app, this would come from API/database
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Enterprise Software License',
      category: 'Software',
      sku: 'ESL-001',
      description: 'Complete enterprise software solution with full features',
      price: 200000,
      cost: 120000,
      stock: 45,
      minStock: 10,
      maxStock: 100,
      status: 'Available',
      supplier: 'TechCorp Solutions',
      lastRestocked: '2024-01-10',
      totalSold: 155,
      revenue: 31000000,
      image: '💻'
    },
    {
      id: 2,
      name: 'Cloud Infrastructure Package',
      category: 'Cloud Services',
      sku: 'CIP-002',
      description: 'Scalable cloud infrastructure with 24/7 support',
      price: 150000,
      cost: 80000,
      stock: 23,
      minStock: 5,
      maxStock: 50,
      status: 'Available',
      supplier: 'CloudTech Inc.',
      lastRestocked: '2024-01-08',
      totalSold: 89,
      revenue: 13350000,
      image: '☁️'
    },
    {
      id: 3,
      name: 'Manufacturing Software Suite',
      category: 'Software',
      sku: 'MSS-003',
      description: 'Complete manufacturing management software',
      price: 180000,
      cost: 100000,
      stock: 8,
      minStock: 5,
      maxStock: 30,
      status: 'Low Stock',
      supplier: 'ManufacturingPro',
      lastRestocked: '2024-01-05',
      totalSold: 67,
      revenue: 12060000,
      image: '🏭'
    },
    {
      id: 4,
      name: 'Electronic Health Records System',
      category: 'Healthcare',
      sku: 'EHR-004',
      description: 'Comprehensive EHR system for healthcare providers',
      price: 300000,
      cost: 180000,
      stock: 15,
      minStock: 3,
      maxStock: 25,
      status: 'Available',
      supplier: 'HealthTech Solutions',
      lastRestocked: '2024-01-12',
      totalSold: 42,
      revenue: 12600000,
      image: '🏥'
    },
    {
      id: 5,
      name: 'Risk Management Software',
      category: 'Finance',
      sku: 'RMS-005',
      description: 'Advanced risk assessment and management tools',
      price: 150000,
      cost: 90000,
      stock: 0,
      minStock: 2,
      maxStock: 20,
      status: 'Out of Stock',
      supplier: 'FinancePro',
      lastRestocked: '2023-12-20',
      totalSold: 38,
      revenue: 5700000,
      image: '📊'
    },
    {
      id: 6,
      name: 'Quality Control System',
      category: 'Manufacturing',
      sku: 'QCS-006',
      description: 'Automated quality control and testing system',
      price: 140000,
      cost: 85000,
      stock: 12,
      minStock: 5,
      maxStock: 25,
      status: 'Available',
      supplier: 'QualityTech',
      lastRestocked: '2024-01-14',
      totalSold: 28,
      revenue: 3920000,
      image: '🔍'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    sku: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    maxStock: '',
    supplier: '',
    status: 'Available'
  });

  // Categories
  const categories = ['Software', 'Cloud Services', 'Healthcare', 'Finance', 'Manufacturing', 'Hardware'];

  // Statistics
  const getStats = () => {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.status === 'Available').length;
    const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
    const outOfStockProducts = products.filter(p => p.status === 'Out of Stock').length;
    const totalValue = products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
    const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);

    return {
      totalProducts,
      availableProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue: `$${(totalValue / 1000).toFixed(0)}K`,
      totalRevenue: `$${(totalRevenue / 1000000).toFixed(1)}M`
    };
  };

  const stats = getStats();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.sku) {
      setError('Please fill in all required fields');
      return;
    }

    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      cost: parseFloat(newProduct.cost),
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock),
      maxStock: parseInt(newProduct.maxStock),
      lastRestocked: new Date().toISOString().split('T')[0],
      totalSold: 0,
      revenue: 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: '',
      sku: '',
      description: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      maxStock: '',
      supplier: '',
      status: 'Available'
    });
    setShowAddModal(false);
    setError('');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleStockUpdate = (productId, newStock) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const updatedProduct = { ...product, stock: newStock };
        // Update status based on stock level
        if (newStock === 0) {
          updatedProduct.status = 'Out of Stock';
        } else if (newStock <= updatedProduct.minStock) {
          updatedProduct.status = 'Low Stock';
        } else {
          updatedProduct.status = 'Available';
        }
        return updatedProduct;
      }
      return product;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
        {/* Header */}
        <div className="p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage corporate products, track stock levels, and monitor sales performance</p>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Products</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
                <p className="text-blue-200 text-xs">In inventory</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Available</p>
                <p className="text-3xl font-bold">{stats.availableProducts}</p>
                <p className="text-green-200 text-xs">Ready for sale</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Low Stock</p>
                <p className="text-3xl font-bold">{stats.lowStockProducts}</p>
                <p className="text-yellow-200 text-xs">Need restocking</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Value</p>
                <p className="text-3xl font-bold">{stats.totalValue}</p>
                <p className="text-purple-200 text-xs">Inventory value</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'products', name: 'Products', icon: '📦' },
                { id: 'categories', name: 'Categories', icon: '🏷️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Stock Status Distribution */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Stock Status Distribution</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: `${(stats.availableProducts / stats.totalProducts) * 100}%`}}></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{stats.availableProducts}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">Low Stock</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(stats.lowStockProducts / stats.totalProducts) * 100}%`}}></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{stats.lowStockProducts}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">Out of Stock</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: `${(stats.outOfStockProducts / stats.totalProducts) * 100}%`}}></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{stats.outOfStockProducts}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Products by Category</h4>
                    <div className="space-y-3">
                      {categories.map((category) => {
                        const count = products.filter(p => p.category === category).length;
                        const percentage = (count / products.length) * 100;
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{category}</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Available">Available</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-white text-2xl">{product.image}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.sku}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-sm font-semibold">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Stock:</span>
                          <span className="text-sm font-semibold">{product.stock} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Sold:</span>
                          <span className="text-sm font-semibold">{product.totalSold}</span>
                        </div>
                      </div>

                      {/* Stock Level Indicator */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Stock Level</span>
                          <span>{product.stock}/{product.maxStock}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              product.stock === 0 ? 'bg-red-500' :
                              product.stock <= product.minStock ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{width: `${(product.stock / product.maxStock) * 100}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => {
                    const categoryProducts = products.filter(p => p.category === category);
                    const totalValue = categoryProducts.reduce((sum, product) => sum + (product.stock * product.cost), 0);
                    const totalRevenue = categoryProducts.reduce((sum, product) => sum + product.revenue, 0);
                    
                    return (
                      <div key={category} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4">{category}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Products:</span>
                            <span className="text-sm font-semibold">{categoryProducts.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Value:</span>
                            <span className="text-sm font-semibold">{formatCurrency(totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenue:</span>
                            <span className="text-sm font-semibold">{formatCurrency(totalRevenue)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU *</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                    <input
                      type="number"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}


