'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye, FaImage, FaUpload, FaFilePdf } from 'react-icons/fa';
import { MdCategory, MdInventory, MdAdd, MdRemove } from 'react-icons/md';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  cardImage: string;
  detailImages: string[];
  shortFeatures: string[];
  specifications?: any;
  reviewsData?: any;
  catalogFile?: string;
  categoryId?: string;
  subcategoryId?: string;
  isActive: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});

  const [newProduct, setNewProduct] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    cardImage: '',
    detailImages: [] as string[],
    shortFeatures: [] as string[],
    specifications: {} as any,
    reviewsData: {} as any,
    catalogFile: '',
    categoryId: '',
    subcategoryId: '',
    isActive: true
  });

  // Fetch products and categories on component mount
  useEffect(() => {
    // Check admin authentication
    const adminSession = Cookies.get('adminSession');
    const adminUser = Cookies.get('adminUser');
    setIsAdmin(adminSession === 'true' && adminUser === 'adeeb');
    
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/navbar');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const uploadFile = async (file: File, type: 'image' | 'pdf'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileUpload = async (file: File, type: 'card' | 'detail' | 'catalog', index?: number) => {
    const uploadKey = `${type}-${index || 0}`;
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const fileType = type === 'catalog' ? 'pdf' : 'image';
      const url = await uploadFile(file, fileType);

      if (type === 'card') {
        setNewProduct(prev => ({ ...prev, cardImage: url }));
      } else if (type === 'detail') {
        setNewProduct(prev => ({
          ...prev,
          detailImages: [...prev.detailImages, url]
        }));
      } else if (type === 'catalog') {
        setNewProduct(prev => ({ ...prev, catalogFile: url }));
      }

      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addFeature = () => {
    setNewProduct(prev => ({
      ...prev,
      shortFeatures: [...prev.shortFeatures, '']
    }));
  };

  const removeFeature = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      shortFeatures: prev.shortFeatures.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      shortFeatures: prev.shortFeatures.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const removeDetailImage = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.categoryId === categoryFilter;
    const matchesSubcategory = subcategoryFilter === '' || product.subcategoryId === subcategoryFilter;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getSubcategoriesForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  };

  const addNewProduct = async () => {
    if (newProduct.name && newProduct.shortDescription && newProduct.cardImage) {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });

        if (response.ok) {
          const data = await response.json();
          setProducts([data.product, ...products]);
          setNewProduct({
            name: '',
            shortDescription: '',
            longDescription: '',
            cardImage: '',
            detailImages: [],
            shortFeatures: [],
            specifications: {},
            reviewsData: {},
            catalogFile: '',
            categoryId: '',
            subcategoryId: '',
            isActive: true
          });
          setShowAddForm(false);
          toast.success('Product created successfully');
        } else {
          toast.error('Failed to create product');
        }
      } catch (error) {
        console.error('Error creating product:', error);
        toast.error('Failed to create product');
      }
    } else {
      toast.error('Please fill in required fields');
    }
  };

  const updateProduct = async () => {
    if (editingProduct && editingProduct.name && editingProduct.shortDescription && editingProduct.cardImage) {
      try {
        const response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(products.map(p => 
            p.id === editingProduct.id ? data.product : p
          ));
          setEditingProduct(null);
          toast.success('Product updated successfully');
        } else {
          toast.error('Failed to update product');
        }
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product');
      }
    } else {
      toast.error('Please fill in required fields');
    }
  };

  const handleEditFileUpload = async (file: File, type: 'card' | 'detail' | 'catalog', index?: number) => {
    if (!editingProduct) return;
    
    const uploadKey = `edit-${type}-${index || 0}`;
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const fileType = type === 'catalog' ? 'pdf' : 'image';
      const url = await uploadFile(file, fileType);

      if (type === 'card') {
        setEditingProduct(prev => prev ? { ...prev, cardImage: url } : null);
      } else if (type === 'detail') {
        setEditingProduct(prev => prev ? {
          ...prev,
          detailImages: [...prev.detailImages, url]
        } : null);
      } else if (type === 'catalog') {
        setEditingProduct(prev => prev ? { ...prev, catalogFile: url } : null);
      }

      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addEditFeature = () => {
    if (!editingProduct) return;
    setEditingProduct(prev => prev ? {
      ...prev,
      shortFeatures: [...prev.shortFeatures, '']
    } : null);
  };

  const removeEditFeature = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct(prev => prev ? {
      ...prev,
      shortFeatures: prev.shortFeatures.filter((_, i) => i !== index)
    } : null);
  };

  const updateEditFeature = (index: number, value: string) => {
    if (!editingProduct) return;
    setEditingProduct(prev => prev ? {
      ...prev,
      shortFeatures: prev.shortFeatures.map((feature, i) => 
        i === index ? value : feature
      )
    } : null);
  };

  const removeEditDetailImage = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct(prev => prev ? {
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index)
    } : null);
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const updateProductStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isActive }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === id ? { ...p, isActive } : p
        ));
        toast.success('Product status updated');
      } else {
        toast.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-1">Manage your LED products inventory</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdInventory className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdCategory className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaEye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => !p.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdCategory className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., LED Strip Light RGB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, categoryId: e.target.value, subcategoryId: '' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  value={newProduct.subcategoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, subcategoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!newProduct.categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {getSubcategoriesForCategory(newProduct.categoryId).map(subcat => (
                    <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <textarea
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  rows={2}
                  placeholder="Brief product description for cards"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                <textarea
                  value={newProduct.longDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
                  rows={4}
                  placeholder="Detailed product description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Card Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Image *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'card');
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {uploadingFiles['card-0'] && <div className="text-sm text-gray-500">Uploading...</div>}
              </div>
              {newProduct.cardImage && (
                <div className="mt-2">
                  <img src={newProduct.cardImage} alt="Card preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>

            {/* Detail Images Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Detail Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => handleFileUpload(file, 'detail'));
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {newProduct.detailImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {newProduct.detailImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt={`Detail ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                      <button
                        onClick={() => removeDetailImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Features</label>
              {newProduct.shortFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <MdRemove />
                  </button>
                </div>
              ))}
              <button
                onClick={addFeature}
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <MdAdd className="mr-1" />
                Add Feature
              </button>
            </div>

            {/* Catalog File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catalog PDF</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'catalog');
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {uploadingFiles['catalog-0'] && <div className="text-sm text-gray-500">Uploading...</div>}
              </div>
              {newProduct.catalogFile && (
                <div className="mt-2 flex items-center space-x-2">
                  <FaFilePdf className="text-red-600" />
                  <a href={newProduct.catalogFile} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    View Catalog
                  </a>
                </div>
              )}
            </div>

            {/* Specifications Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Specifications</label>
              <textarea
                value={JSON.stringify(newProduct.specifications, null, 2)}
                onChange={(e) => {
                  try {
                    const specs = JSON.parse(e.target.value);
                    setNewProduct({ ...newProduct, specifications: specs });
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={6}
                placeholder={`{
  "dimensions": "10cm x 5cm x 2cm",
  "weight": "150g",
  "voltage": "DC 12V",
  "power": "15W",
  "color_temperature": "3000K-6500K",
  "material": "Aluminum"
}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Enter specifications as JSON format</p>
            </div>

            {/* Reviews Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Reviews</label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Average Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newProduct.reviewsData?.averageRating || ''}
                      onChange={(e) => {
                        const rating = parseFloat(e.target.value) || 0;
                        setNewProduct({ 
                          ...newProduct, 
                          reviewsData: { 
                            ...newProduct.reviewsData, 
                            averageRating: rating 
                          } 
                        });
                      }}
                      placeholder="4.5"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Total Reviews</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.reviewsData?.totalReviews || ''}
                      onChange={(e) => {
                        const total = parseInt(e.target.value) || 0;
                        setNewProduct({ 
                          ...newProduct, 
                          reviewsData: { 
                            ...newProduct.reviewsData, 
                            totalReviews: total 
                          } 
                        });
                      }}
                      placeholder="25"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Reviews (JSON Format)</label>
                  <textarea
                    value={JSON.stringify(newProduct.reviewsData?.reviews || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const reviews = JSON.parse(e.target.value);
                        setNewProduct({ 
                          ...newProduct, 
                          reviewsData: { 
                            ...newProduct.reviewsData, 
                            reviews: reviews 
                          } 
                        });
                      } catch {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={6}
                    placeholder={`[
  {
    "name": "John Doe",
    "rating": 5,
    "comment": "Excellent LED light quality!",
    "date": "2024-01-15"
  },
  {
    "name": "Jane Smith", 
    "rating": 4,
    "comment": "Good brightness and easy installation",
    "date": "2024-01-10"
  }
]`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">💡 Add individual reviews as JSON array with name, rating (1-5), comment, and date fields</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addNewProduct}
                disabled={!newProduct.name || !newProduct.shortDescription || !newProduct.cardImage}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                <FaSave className="mr-2" />
                Add Product
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({
                    name: '',
                    shortDescription: '',
                    longDescription: '',
                    cardImage: '',
                    detailImages: [],
                    shortFeatures: [],
                    specifications: {},
                    reviewsData: {},
                    catalogFile: '',
                    categoryId: '',
                    subcategoryId: '',
                    isActive: true
                  });
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Product</h3>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editingProduct.categoryId || ''}
                  onChange={(e) => {
                    setEditingProduct({ ...editingProduct, categoryId: e.target.value, subcategoryId: '' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  value={editingProduct.subcategoryId || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subcategoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!editingProduct.categoryId}
                >
                  <option value="">Select Subcategory</option>
                  {getSubcategoriesForCategory(editingProduct.categoryId || '').map(subcat => (
                    <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <textarea
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
                <textarea
                  value={editingProduct.longDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Card Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Image *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleEditFileUpload(file, 'card');
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadingFiles['edit-card-0'] && <div className="text-sm text-gray-500">Uploading...</div>}
              </div>
              {editingProduct.cardImage && (
                <div className="mt-2">
                  <img src={editingProduct.cardImage} alt="Card preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>

            {/* Detail Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Detail Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => handleEditFileUpload(file, 'detail'));
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {editingProduct.detailImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {editingProduct.detailImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt={`Detail ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                      <button
                        onClick={() => removeEditDetailImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Features</label>
              {editingProduct.shortFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateEditFeature(index, e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeEditFeature(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <MdRemove />
                  </button>
                </div>
              ))}
              <button
                onClick={addEditFeature}
                className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <MdAdd className="mr-1" />
                Add Feature
              </button>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Specifications</label>
              <textarea
                value={JSON.stringify(editingProduct.specifications || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const specs = JSON.parse(e.target.value);
                    setEditingProduct({ ...editingProduct, specifications: specs });
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Reviews */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Reviews (Array)</label>
              <textarea
                value={JSON.stringify(editingProduct.reviewsData || [], null, 2)}
                onChange={(e) => {
                  try {
                    const reviews = JSON.parse(e.target.value);
                    setEditingProduct({ ...editingProduct, reviewsData: reviews });
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Catalog File */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catalog PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleEditFileUpload(file, 'catalog');
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {editingProduct.catalogFile && (
                <div className="mt-2 flex items-center space-x-2">
                  <FaFilePdf className="text-red-600" />
                  <a href={editingProduct.catalogFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Catalog
                  </a>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={updateProduct}
                disabled={!editingProduct.name || !editingProduct.shortDescription || !editingProduct.cardImage}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <FaSave className="mr-2" />
                Update Product
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubcategoryFilter('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subcategory</label>
              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!categoryFilter}
              >
                <option value="">All Subcategories</option>
                {getSubcategoriesForCategory(categoryFilter).map(subcat => (
                  <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.cardImage ? (
                            <img 
                              src={product.cardImage} 
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{product.category?.name || 'No Category'}</div>
                        {product.subcategory && (
                          <div className="text-gray-500 text-xs">{product.subcategory.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.specifications ? (
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {Object.keys(product.specifications).length} specs
                        </span>
                      ) : (
                        <span className="text-gray-400">No specs</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.reviewsData?.totalReviews ? (
                        <div>
                          <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {product.reviewsData.totalReviews} reviews
                          </span>
                          {product.reviewsData.averageRating && (
                            <div className="text-xs text-gray-500 mt-1">
                              ⭐ {product.reviewsData.averageRating}/5
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No reviews</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit Product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => updateProductStatus(product.id, !product.isActive)}
                            className={`text-xs px-2 py-1 rounded ${
                              product.isActive 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {product.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Admin access required</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
