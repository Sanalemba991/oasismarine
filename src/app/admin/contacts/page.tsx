'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaEnvelope, FaPhone, FaUser, FaCalendarAlt, FaReply, FaTrash, FaEye } from 'react-icons/fa';
import { MdMarkEmailRead, MdMarkEmailUnread } from 'react-icons/md';
import { ExclamationTriangleIcon, EnvelopeIcon, UserIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  userId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  createdAt: string;
  updatedAt: string;
  repliedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts from frontend...')
      const response = await fetch('/api/contacts');
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received contacts:', data)
        setContacts(data);
        setError('');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData)
        setError(`Failed to fetch contacts: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Network error while fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || contact.status === statusFilter;
    const matchesPriority = priorityFilter === '' || contact.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateContactStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      console.log('Updating contact status:', id, 'to:', status);
      
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        fetchContacts(); // Refresh the list
        
        // Update the selected contact state
        if (selectedContact?.id === id) {
          setSelectedContact({
            ...selectedContact,
            status,
            repliedAt: status === 'replied' ? new Date().toISOString() : selectedContact.repliedAt
          });
        }
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Network error while updating contact status');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      console.log('Deleting contact:', id);
      
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        console.log('Delete successful');
        fetchContacts(); // Refresh the list
        setSelectedContact(null); // Clear selection
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert(`Failed to delete contact: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Network error while deleting contact');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchContacts}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer inquiries and support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Contacts
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Messages ({filteredContacts.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {contacts.length === 0 ? 'No contacts found' : 'No contacts match your filters'}
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(contact.priority)}`}>
                            {contact.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                        <p className="text-sm font-medium text-gray-900 mb-1">{contact.subject}</p>
                        <p className="text-xs text-gray-500">{formatDate(contact.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
            </div>

            {selectedContact ? (
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedContact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{formatDate(selectedContact.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {selectedContact.productName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Product Information</h3>
                    <div className="flex items-center space-x-3">
                      {selectedContact.productImage && (
                        <img
                          src={selectedContact.productImage}
                          alt={selectedContact.productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.productName}</p>
                        {selectedContact.productId && (
                          <p className="text-xs text-gray-500">ID: {selectedContact.productId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'read')}
                    disabled={selectedContact.status === 'read'}
                    className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                    disabled={selectedContact.status === 'replied'}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>Select a contact to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
