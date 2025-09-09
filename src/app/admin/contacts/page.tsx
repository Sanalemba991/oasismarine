'use client'

import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaEnvelope, FaPhone, FaUser, FaCalendarAlt, FaReply, FaTrash, FaEye } from 'react-icons/fa';
import { MdMarkEmailRead, MdMarkEmailUnread } from 'react-icons/md';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  repliedAt?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      subject: 'LED Strip Installation Quote',
      message: 'Hi, I need a quote for installing LED strips in my home office. The room is approximately 12x10 feet and I would like RGB strips with dimming capability.',
      status: 'new',
      priority: 'high',
      createdAt: '2024-01-25T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1-555-0456',
      subject: 'Bulk Order Inquiry',
      message: 'We are interested in purchasing LED panel lights for our office building. We need approximately 200 units. Can you provide bulk pricing?',
      status: 'read',
      priority: 'medium',
      createdAt: '2024-01-24T14:20:00Z'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1-555-0789',
      subject: 'Product Support',
      message: 'I purchased smart LED bulbs last month and having issues with WiFi connectivity. Can someone help me troubleshoot?',
      status: 'replied',
      priority: 'medium',
      createdAt: '2024-01-23T09:15:00Z',
      repliedAt: '2024-01-23T16:30:00Z'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa.chen@design.com',
      phone: '+1-555-0321',
      subject: 'Partnership Opportunity',
      message: 'Hello, I represent an interior design firm and we are interested in partnering with you for our upcoming commercial projects.',
      status: 'new',
      priority: 'high',
      createdAt: '2024-01-22T11:45:00Z'
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'r.wilson@email.com',
      phone: '+1-555-0654',
      subject: 'Return Request',
      message: 'I need to return some LED floodlights that are not working properly. Order number is #12345.',
      status: 'read',
      priority: 'low',
      createdAt: '2024-01-21T16:20:00Z'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const updateContactStatus = (id: number, status: 'new' | 'read' | 'replied') => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { 
        ...contact, 
        status, 
        repliedAt: status === 'replied' ? new Date().toISOString() : contact.repliedAt 
      } : contact
    ));
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaEnvelope className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MdMarkEmailUnread className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaReply className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaCalendarAlt className="h-6 w-6 text-red-600" />
              </div>
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Contacts</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Messages ({filteredContacts.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer ${
                    selectedContact?.id === contact.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(contact.priority)}`}>
                          {contact.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                      <p className="text-sm font-medium text-gray-900 mb-2">{contact.subject}</p>
                      <p className="text-sm text-gray-600 truncate">{contact.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(contact.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
            </div>

            {selectedContact ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaUser className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                    <p className="text-sm text-gray-600">Contact Person</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaEnvelope className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedContact.email}</p>
                    <p className="text-sm text-gray-600">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaPhone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedContact.phone}</p>
                    <p className="text-sm text-gray-600">Phone Number</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Subject:</p>
                  <p className="text-sm text-gray-600">{selectedContact.subject}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Message:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Received:</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedContact.createdAt)}</p>
                </div>

                {selectedContact.repliedAt && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Replied:</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedContact.repliedAt)}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <select
                      value={selectedContact.status}
                      onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaReply className="mr-2" />
                      Mark Replied
                    </button>
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FaEye className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Select a contact to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
