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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="1,247"
            icon={FaUsers}
            color="#8B5CF6"
            trend="+12% this month"
          />
          <StatCard
            title="Products"
            value="89"
            icon={MdInventory}
            color="#06B6D4"
            trend="+5 new items"
          />
          <StatCard
            title="Contacts"
            value="156"
            icon={MdContacts}
            color="#10B981"
            trend="+8 today"
          />
          <StatCard
            title="Page Views"
            value="12.5K"
            icon={FaEye}
            color="#F59E0B"
            trend="+18% this week"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MdNotifications className="mr-2 text-purple-600" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'user' ? 'bg-purple-500' :
                    activity.type === 'product' ? 'bg-blue-500' :
                    activity.type === 'contact' ? 'bg-green-500' :
                    activity.type === 'order' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-colors group">
                <FaUsers className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-purple-900">Manage Users</p>
              </button>
              
              <button className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors group">
                <MdInventory className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-blue-900">Add Product</p>
              </button>
              
              <button className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 transition-colors group">
                <MdContacts className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-green-900">View Contacts</p>
              </button>
              
              <button className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:bg-orange-100 transition-colors group">
                <FaChartLine className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-orange-900">View Stats</p>
              </button>
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
