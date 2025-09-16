'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaCalendarAlt, 
  FaReply, 
  FaTrash, 
  FaEye,
  FaFilter,
  FaSearch,
  FaDownload
} from 'react-icons/fa';
import { 
  MdMarkEmailRead, 
  MdMarkEmailUnread,
  MdSubject,
  MdMessage 
} from 'react-icons/md';
import { ExclamationTriangleIcon, EnvelopeIcon, UserIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  source: 'contact_form' | 'product_inquiry';
  createdAt: string;
  updatedAt: string;
  repliedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function ContactDetailsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Fetch contact form submissions
  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  const fetchContactSubmissions = async () => {
    try {
      console.log('Fetching contact submissions...')
      const response = await fetch('/api/contact-submissions');
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received contact submissions:', data)
        setContacts(data);
        setError('');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData)
        setError(`Failed to fetch contact submissions: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      setError('Network error while fetching contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || contact.status === statusFilter;
    const matchesSource = sourceFilter === '' || contact.source === sourceFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const contactDate = new Date(contact.createdAt).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      matchesDate = contactDate === filterDate;
    }
    
    return matchesSearch && matchesStatus && matchesSource && matchesDate;
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

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'contact_form':
        return 'bg-purple-100 text-purple-800';
      case 'product_inquiry':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateContactStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchContactSubmissions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        const response = await fetch(`/api/contact-submissions/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchContactSubmissions(); // Refresh the list
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const exportContacts = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Status', 'Source', 'Date'],
      ...filteredContacts.map(contact => [
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        contact.status,
        contact.source,
        new Date(contact.createdAt).toLocaleString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
                onClick={fetchContactSubmissions}
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage contact form submissions from /contact page
            </p>
          </div>
          <button
            onClick={exportContacts}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MdMarkEmailUnread className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MdMarkEmailRead className="h-8 w-8 text-green-500" />
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
              <FaUser className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contact Form</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.source === 'contact_form').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => 
                    new Date(c.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                Search Submissions
              </label>
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
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
                Filter by Source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                <option value="contact_form">Contact Form</option>
                <option value="product_inquiry">Product Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Submissions ({filteredContacts.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {contacts.length === 0 ? 'No contact submissions found' : 'No submissions match your filters'}
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
                          <span className={`px-2 py-1 text-xs rounded-full ${getSourceColor(contact.source)}`}>
                            {contact.source.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                        <p className="text-sm font-medium text-gray-900 mb-1 truncate">{contact.subject}</p>
                        <p className="text-xs text-gray-500 mb-1 line-clamp-2">{contact.message}</p>
                        <p className="text-xs text-gray-400">{formatDate(contact.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Submission Details</h2>
            </div>

            {selectedContact ? (
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="font-medium">{selectedContact.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:text-blue-800">
                        {selectedContact.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{formatDate(selectedContact.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    <MdSubject className="inline mr-2" />
                    Subject
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedContact.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    <MdMessage className="inline mr-2" />
                    Message
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Technical Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Technical Information</h3>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p><span className="font-medium">Source:</span> {selectedContact.source.replace('_', ' ')}</p>
                    <p><span className="font-medium">Status:</span> {selectedContact.status}</p>
                    {selectedContact.repliedAt && (
                      <p><span className="font-medium">Replied at:</span> {formatDate(selectedContact.repliedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'read')}
                    disabled={selectedContact.status === 'read' || selectedContact.status === 'replied'}
                    className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                    disabled={selectedContact.status === 'replied'}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark as Replied
                  </button>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <FaReply className="inline mr-1" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    <FaTrash className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FaEye className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
