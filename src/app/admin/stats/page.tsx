'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaUsers, FaShoppingCart, FaDollarSign, FaEye, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown, MdAnalytics, MdNavigation, MdCategory } from 'react-icons/md';

interface StatsData {
  stats: {
    navbarCategories: number;
    navbarSubcategories: number;
    totalProducts: number;
    contactDetails: number;
    productEnquiries: number;
    totalUsers: number;
    totalRevenue: number;
    totalOrders: number;
    pageViews: number;
  };
  trends: {
    contactsTrend: string;
    usersTrend: string;
    productsTrend: string;
    revenueTrend: string;
  };
  chartData: Array<{
    month: string;
    sales: number;
    users: number;
    orders: number;
  }>;
  recentActivities: Array<{
    type: string;
    message: string;
    time: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: string;
  }>;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  month: string;
  sales: number;
  users: number;
  orders: number;
}

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      console.log('Fetching stats data from frontend...');
      
      const response = await fetch('/api/admin/stats');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stats data received:', data);
      
      setStatsData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats data:', err);
      setError('Failed to load stats data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-lg">Loading statistics...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 font-semibold">Error: {error}</div>
          <button
            onClick={fetchStatsData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const stats = statsData?.stats;
  const trends = statsData?.trends;

  // Create dynamic stat cards with real data from your database
  const statCards: StatCard[] = [
    {
      title: 'Navbar Categories',
      value: stats?.navbarCategories?.toString() || '0',
      change: '+2.1%',
      changeType: 'increase',
      icon: <MdCategory className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Navbar Subcategories',
      value: stats?.navbarSubcategories?.toString() || '0',
      change: '+5.3%',
      changeType: 'increase',
      icon: <MdNavigation className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toString() || '0',
      change: trends?.productsTrend || '+5.2%',
      changeType: 'increase',
      icon: <FaShoppingCart className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Contact Details',
      value: stats?.contactDetails?.toString() || '0',
      change: trends?.contactsTrend || '+8.1%',
      changeType: 'increase',
      icon: <FaUsers className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Product Enquiries',
      value: stats?.productEnquiries?.toString() || '0',
      change: trends?.contactsTrend || '+12.5%',
      changeType: 'increase',
      icon: <MdAnalytics className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toString() || '0',
      change: trends?.usersTrend || '+15.3%',
      changeType: 'increase',
      icon: <FaUsers className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600'
    },
  ];

  const getMaxValue = (data: ChartData[], key: keyof ChartData) => {
    return Math.max(...data.map(item => item[key] as number));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Statistics</h1>
              <p className="text-gray-600 mt-1">Real-time data from your Oasis Marine database</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={fetchStatsData}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Database Stats Summary - Your 5 Main Requirements */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🗄️ Live Database Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats?.navbarCategories || 0}</div>
              <div className="text-sm opacity-90">Navbar Categories</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats?.navbarSubcategories || 0}</div>
              <div className="text-sm opacity-90">Navbar Subcategories</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <div className="text-sm opacity-90">Total Products</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats?.contactDetails || 0}</div>
              <div className="text-sm opacity-90">Contact Details</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats?.productEnquiries || 0}</div>
              <div className="text-sm opacity-90">Product Enquiries</div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <FaArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <FaArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
