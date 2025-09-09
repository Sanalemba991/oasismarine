'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaChevronDown, FaChevronRight, FaFolder, FaFile } from 'react-icons/fa';
import { MdDragIndicator, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SubCategory {
  id: string;
  name: string;
  href: string;
  visible: boolean;
  order: number;
  categoryId: string;
  image?: string;
}

interface NavCategory {
  id: string;
  name: string;
  href: string;
  visible: boolean;
  order: number;
  isCategory: boolean;
  subcategories: SubCategory[];
  expanded?: boolean;
}

export default function NavbarPage() {
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavCategory | null>(null);
  const [editingSubItem, setEditingSubItem] = useState<SubCategory | null>(null);
  const [newItem, setNewItem] = useState({ name: '', href: '', isCategory: false });
  const [newSubItem, setNewSubItem] = useState({ name: '', href: '', categoryId: '', image: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSubForm, setShowAddSubForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<{ [key: string]: boolean }>({});

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/navbar', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setNavCategories(data.categories.map((cat: any) => ({
        ...cat,
        expanded: false
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Upload file function
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

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


  // Handle image upload for new subcategory
  const handleSubcategoryImageUpload = async (file: File) => {
    setUploadingImage(prev => ({ ...prev, newSubcategory: true }));
    try {
      const url = await uploadFile(file);
      setNewSubItem(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(prev => ({ ...prev, newSubcategory: false }));
    }
  };



  // Handle image upload for editing subcategory
  const handleEditSubcategoryImageUpload = async (file: File) => {
    if (!editingSubItem) return;
    setUploadingImage(prev => ({ ...prev, editSubcategory: true }));
    try {
      const url = await uploadFile(file);
      setEditingSubItem(prev => prev ? ({ ...prev, image: url }) : null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(prev => ({ ...prev, editSubcategory: false }));
    }
  };

  // Toggle category expansion
  const toggleExpanded = (id: string) => {
    setNavCategories(cats =>
      cats.map(cat =>
        cat.id === id ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  // Toggle visibility for category
  const toggleVisibility = async (id: string) => {
    try {
      const category = navCategories.find(cat => cat.id === id);
      if (!category) return;

      const response = await fetch('/api/admin/navbar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id,
          visible: !category.visible
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === id ? { ...cat, visible: !cat.visible } : cat
        )
      );

      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Toggle visibility for subcategory
  const toggleSubVisibility = async (categoryId: string, subId: string) => {
    try {
      const category = navCategories.find(cat => cat.id === categoryId);
      const subcategory = category?.subcategories.find(sub => sub.id === subId);
      if (!subcategory) return;

      const response = await fetch('/api/admin/subcategory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: subId,
          visible: !subcategory.visible
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subcategory');
      }

      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === subId ? { ...sub, visible: !sub.visible } : sub
            )
          } : cat
        )
      );

      toast.success('Subcategory updated successfully');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    }
  };

  // Start editing category
  const startEdit = (item: NavCategory) => {
    setEditingItem({ ...item });
  };

  // Start editing subcategory
  const startEditSub = (subItem: SubCategory) => {
    setEditingSubItem({ ...subItem });
  };

  // Save category edit
  const saveEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch('/api/admin/navbar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: editingItem.id,
          name: editingItem.name,
          href: editingItem.href,
          isCategory: editingItem.isCategory,
          visible: editingItem.visible
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const data = await response.json();
      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === editingItem.id ? { ...data.category, expanded: cat.expanded } : cat
        )
      );
      
      // Create/update page if needed
      await createPageForRoute(editingItem.href, editingItem.name);
      
      setEditingItem(null);
      toast.success('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Save subcategory edit
  const saveSubEdit = async () => {
    if (!editingSubItem) return;

    try {
      const response = await fetch('/api/admin/subcategory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: editingSubItem.id,
          name: editingSubItem.name,
          href: editingSubItem.href,
          visible: editingSubItem.visible,
          image: editingSubItem.image
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subcategory');
      }

      const data = await response.json();
      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === editingSubItem.categoryId ? {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === editingSubItem.id ? data.subcategory : sub
            )
          } : cat
        )
      );
      
      // Create/update page if needed
      await createPageForRoute(editingSubItem.href, editingSubItem.name);
      
      setEditingSubItem(null);
      toast.success('Subcategory updated successfully!');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingItem(null);
    setEditingSubItem(null);
  };

  // Delete category
  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category and all its subcategories?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/navbar?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setNavCategories(cats => cats.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Delete subcategory
  const deleteSubItem = async (categoryId: string, subId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subcategory?id=${subId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subcategory');
      }

      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === categoryId ? {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subId)
          } : cat
        )
      );
      toast.success('Subcategory deleted successfully!');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    }
  };

  // Add new category
  const addNewItem = async () => {
    if (!newItem.name || !newItem.href) {
      toast.error('Name and href are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newItem.name,
          href: newItem.href,
          isCategory: newItem.isCategory,
          visible: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const data = await response.json();
      setNavCategories(prev => [...prev, { ...data.category, expanded: false }]);
      
      // Create page for new route
      await createPageForRoute(newItem.href, newItem.name);
      
      setNewItem({ name: '', href: '', isCategory: false });
      setShowAddForm(false);
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  // Add new subcategory
  const addNewSubItem = async () => {
    if (!newSubItem.name || !newSubItem.href || !newSubItem.categoryId) {
      toast.error('Name, href, and category are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newSubItem.name,
          href: newSubItem.href,
          categoryId: newSubItem.categoryId,
          visible: true,
          image: newSubItem.image
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subcategory');
      }

      const data = await response.json();
      setNavCategories(cats =>
        cats.map(cat =>
          cat.id === newSubItem.categoryId ? {
            ...cat,
            subcategories: [...cat.subcategories, data.subcategory],
            expanded: true
          } : cat
        )
      );
      
      // Create page for new route
      await createPageForRoute(newSubItem.href, newSubItem.name);
      
      setNewSubItem({ name: '', href: '', categoryId: '', image: '' });
      setShowAddSubForm(false);
      toast.success('Subcategory added successfully!');
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Failed to create subcategory');
    }
  };

  // Create page for route
  const createPageForRoute = async (href: string, name: string) => {
    try {
      const response = await fetch('/api/admin/create-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ href, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create page');
      }
      
      console.log(`Page created for route: ${href}`);
    } catch (error) {
      console.error('Error creating page:', error);
      toast.warn('Page creation failed, but navigation item was saved.');
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Navbar Management</h1>
              <p className="text-gray-600 mt-1">Configure navigation menu with categories and subcategories</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Category
              </button>
              <button
                onClick={() => setShowAddSubForm(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Subcategory
              </button>
            </div>
          </div>
        </div>

        {/* Add New Category Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Our Services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Path
                </label>
                <input
                  type="text"
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  placeholder="e.g., /services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newItem.isCategory ? 'true' : 'false'}
                  onChange={(e) => setNewItem({ ...newItem, isCategory: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="false">Single Page</option>
                  <option value="true">Category with Subcategories</option>
                </select>
              </div>
            </div>


            <div className="flex space-x-3 mt-4">
              <button
                onClick={addNewItem}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItem({ name: '', href: '', isCategory: false });
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add New Subcategory Form */}
        {showAddSubForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subcategory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  value={newSubItem.categoryId}
                  onChange={(e) => setNewSubItem({ ...newSubItem, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0">Select Category</option>
                  {navCategories.filter(cat => cat.isCategory).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={newSubItem.name}
                  onChange={(e) => setNewSubItem({ ...newSubItem, name: e.target.value })}
                  placeholder="e.g., LED Installation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Path
                </label>
                <input
                  type="text"
                  value={newSubItem.href}
                  onChange={(e) => setNewSubItem({ ...newSubItem, href: e.target.value })}
                  placeholder="e.g., /services/led-installation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subcategory Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSubcategoryImageUpload(file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploadingImage.newSubcategory && <div className="text-sm text-gray-500">Uploading...</div>}
              </div>
              {newSubItem.image && (
                <div className="mt-2">
                  <img src={newSubItem.image} alt="Subcategory preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addNewSubItem}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Add Subcategory
              </button>
              <button
                onClick={() => {
                  setShowAddSubForm(false);
                  setNewSubItem({ name: '', href: '', categoryId: '', image: '' });
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Navigation Categories */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Navigation Structure</h2>
            <p className="text-sm text-gray-600 mt-1">Manage categories and subcategories</p>
          </div>

          <div className="divide-y divide-gray-200">
            {navCategories.map((category) => (
              <div key={category.id}>
                {editingItem && editingItem.id === category.id ? (
                  // Edit Category Mode
                  <div className="p-6 bg-blue-50">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Path
                          </label>
                          <input
                            type="text"
                            value={editingItem.href}
                            onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={editingItem.isCategory ? 'true' : 'false'}
                            onChange={(e) => setEditingItem({ ...editingItem, isCategory: e.target.value === 'true' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="false">Single Page</option>
                            <option value="true">Category with Subcategories</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={saveEdit}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaSave className="mr-2" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Category Mode
                  <div className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <MdDragIndicator className="text-gray-400 cursor-move" />
                        
                        {/* Category Toggle */}
                        {category.isCategory && category.subcategories.length > 0 ? (
                          <button
                            onClick={() => toggleExpanded(category.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {category.expanded ? <FaChevronDown /> : <FaChevronRight />}
                          </button>
                        ) : (
                          <div className="w-6"></div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          {category.isCategory ? <FaFolder className="text-blue-500" /> : <FaFile className="text-green-500" />}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                              {category.name}
                              {category.isCategory && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Category</span>}
                            </h3>
                            <p className="text-sm text-gray-600">{category.href}</p>
                            {category.subcategories.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">{category.subcategories.length} subcategories</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleVisibility(category.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            category.visible
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={category.visible ? 'Hide from navbar' : 'Show in navbar'}
                        >
                          {category.visible ? <MdVisibility /> : <MdVisibilityOff />}
                        </button>
                        
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => deleteItem(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subcategories */}
                {category.expanded && category.subcategories.length > 0 && (
                  <div className="bg-gray-50">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="pl-16 pr-6 py-4 border-l-2 border-blue-200">
                        {editingSubItem && editingSubItem.id === subcategory.id ? (
                          // Edit Subcategory Mode
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Subcategory Name
                                </label>
                                <input
                                  type="text"
                                  value={editingSubItem.name}
                                  onChange={(e) => setEditingSubItem({ ...editingSubItem, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  URL Path
                                </label>
                                <input
                                  type="text"
                                  value={editingSubItem.href}
                                  onChange={(e) => setEditingSubItem({ ...editingSubItem, href: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                            </div>

                            {/* Edit Subcategory Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subcategory Image
                              </label>
                              <div className="flex items-center space-x-4">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleEditSubcategoryImageUpload(file);
                                  }}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                {uploadingImage.editSubcategory && <div className="text-sm text-gray-500">Uploading...</div>}
                              </div>
                              {editingSubItem.image && (
                                <div className="mt-2">
                                  <img src={editingSubItem.image} alt="Subcategory preview" className="h-20 w-20 object-cover rounded" />
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={saveSubEdit}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <FaSave className="mr-2" />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                <FaTimes className="mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Subcategory Mode
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {subcategory.image ? (
                                <img 
                                  src={subcategory.image} 
                                  alt={subcategory.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              ) : (
                                <FaFile className="text-green-500 text-sm" />
                              )}
                              <div>
                                <h4 className="text-md font-medium text-gray-800">{subcategory.name}</h4>
                                <p className="text-sm text-gray-500">{subcategory.href}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleSubVisibility(category.id, subcategory.id)}
                                className={`p-1 rounded transition-colors text-sm ${
                                  subcategory.visible
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-gray-400 hover:bg-gray-50'
                                }`}
                                title={subcategory.visible ? 'Hide from navbar' : 'Show in navbar'}
                              >
                                {subcategory.visible ? <MdVisibility /> : <MdVisibilityOff />}
                              </button>
                              
                              <button
                                onClick={() => startEditSub(subcategory)}
                                className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors text-sm"
                                title="Edit subcategory"
                              >
                                <FaEdit />
                              </button>
                              
                              <button
                                onClick={() => deleteSubItem(category.id, subcategory.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                                title="Delete subcategory"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Preview</h3>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-xl">Oasis Marine Trading</div>
              <div className="hidden md:flex space-x-6">
                {navCategories
                  .filter(category => category.visible)
                  .sort((a, b) => a.order - b.order)
                  .map(category => (
                    <div key={category.id} className="relative group">
                      <a href="#" className="text-white hover:text-purple-200 transition-colors">
                        {category.name}
                      </a>
                      
                      {/* Subcategories Preview */}
                      {category.isCategory && category.subcategories.filter(sub => sub.visible).length > 0 && (
                        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[200px]">
                          {category.subcategories
                            .filter(sub => sub.visible)
                            .map(subcategory => (
                              <a
                                key={subcategory.id}
                                href="#"
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              >
                                {subcategory.name}
                              </a>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is how your navigation will appear on the frontend (hover over categories to see subcategories)
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
