'use client'

import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { FaUsers, FaShoppingCart, FaDollarSign, FaEye, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown, MdAnalytics } from 'react-icons/md';

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

  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: '$45,280',
      change: '+12.5%',
      changeType: 'increase',
      icon: <FaDollarSign className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Orders',
      value: '1,248',
      change: '+8.2%',
      changeType: 'increase',
      icon: <FaShoppingCart className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'New Customers',
      value: '324',
      change: '+15.3%',
      changeType: 'increase',
      icon: <FaUsers className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Page Views',
      value: '12,567',
      change: '-2.4%',
      changeType: 'decrease',
      icon: <FaEye className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const chartData: ChartData[] = [
    { month: 'Jan', sales: 4200, users: 240, orders: 89 },
    { month: 'Feb', sales: 3800, users: 198, orders: 76 },
    { month: 'Mar', sales: 5100, users: 320, orders: 112 },
    { month: 'Apr', sales: 4600, users: 280, orders: 95 },
    { month: 'May', sales: 5800, users: 380, orders: 134 },
    { month: 'Jun', sales: 6200, users: 420, orders: 156 }
  ];

  const topProducts = [
    { name: 'LED Strip Light RGB', sales: 125, revenue: '$3,750' },
    { name: 'Smart LED Bulb', sales: 98, revenue: '$1,568' },
    { name: 'LED Panel Light', sales: 76, revenue: '$3,492' },
    { name: 'Outdoor LED Floodlight', sales: 54, revenue: '$4,860' },
    { name: 'LED Downlight', sales: 42, revenue: '$1,260' }
  ];

  const recentActivity = [
    { type: 'order', message: 'New order #1248 received', time: '2 minutes ago' },
    { type: 'user', message: 'New customer registered: John Doe', time: '15 minutes ago' },
    { type: 'product', message: 'Product "LED Strip RGB" low in stock', time: '1 hour ago' },
    { type: 'order', message: 'Order #1247 shipped', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review received', time: '3 hours ago' }
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
              <p className="text-gray-600 mt-1">Monitor your business performance and trends</p>
            </div>
            <div className="mt-4 sm:mt-0">
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
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <MdTrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-4">
              {chartData.map((data, index) => {
                const maxSales = getMaxValue(chartData, 'sales');
                const width = (data.sales / maxSales) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm font-medium text-gray-900">${data.sales}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Users Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Users</h3>
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {chartData.map((data, index) => {
                const maxUsers = getMaxValue(chartData, 'users');
                const width = (data.users / maxUsers) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">{data.users}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{product.revenue}</p>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 bg-purple-${(index + 1) * 100} rounded-full mr-2`}></div>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'order' ? 'bg-blue-100' :
                      activity.type === 'user' ? 'bg-green-100' :
                      activity.type === 'product' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'order' && <FaShoppingCart className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'user' && <FaUsers className="h-4 w-4 text-green-600" />}
                      {activity.type === 'product' && <MdAnalytics className="h-4 w-4 text-yellow-600" />}
                      {activity.type === 'review' && <FaEye className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">94.5%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">87.2%</div>
              <div className="text-sm text-gray-600">Order Fulfillment Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87.2%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2.3s</div>
              <div className="text-sm text-gray-600">Average Response Time</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold">156%</div>
              <div className="text-sm opacity-90">Growth Rate</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold">$2.4K</div>
              <div className="text-sm opacity-90">Avg. Order Value</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm opacity-90">Customer Rating</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm opacity-90">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
