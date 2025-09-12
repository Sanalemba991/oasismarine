'use client'

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { 
  MdPeople, 
  MdInventory, 
  MdContacts, 
  MdTrendingUp,
  MdVisibility,
  MdNotifications
} from 'react-icons/md';
import { FaUsers, FaShoppingCart, FaChartLine, FaEye } from 'react-icons/fa';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  color: string; 
  trend?: string;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <MdTrendingUp className="mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recentActivities = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Product updated', time: '15 minutes ago', type: 'product' },
    { id: 3, action: 'Contact form submitted', time: '1 hour ago', type: 'contact' },
    { id: 4, action: 'New order received', time: '2 hours ago', type: 'order' },
    { id: 5, action: 'System backup completed', time: '3 hours ago', type: 'system' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
              <p className="text-purple-100">
                Manage your Oasis Marine Trading platform from this central control panel
              </p>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Current Time</p>
              <p className="text-xl font-semibold">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-purple-100 text-sm">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

       

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Server Status</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-blue-600">Connected</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Services</p>
              <p className="text-xs text-purple-600">Running</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}