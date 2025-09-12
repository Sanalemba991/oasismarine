import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RecentActivity {
  type: string;
  message: string;
  time: string;
}

export async function GET() {
  try {
    console.log('Fetching admin stats...');

    // Get all statistics from database
    const [
      totalNavbarCategories,
      totalNavbarSubcategories,
      totalProducts,
      totalContactDetails,
      totalProductEnquiries,
      totalUsers,
      recentContacts,
      recentUsers,
      recentProducts
    ] = await Promise.all([
      prisma.category.count(),         // <-- FIXED
      prisma.subcategory.count(),      // <-- FIXED
      prisma.product.count(),
      prisma.contactSubmission.count(),
      prisma.contact.count(),
      prisma.user.count(),
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, subject: true, productName: true, createdAt: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, createdAt: true }
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, createdAt: true }
      })
    ]);

    // Calculate trends (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      contactsLast30Days,
      contactsPrevious30Days,
      usersLast30Days,
      usersPrevious30Days
    ] = await Promise.all([
      prisma.contact.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.contact.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } })
    ]);

    const contactsTrend = contactsPrevious30Days > 0 
      ? Math.round(((contactsLast30Days - contactsPrevious30Days) / contactsPrevious30Days) * 100)
      : contactsLast30Days > 0 ? 100 : 0;
    
    const usersTrend = usersPrevious30Days > 0 
      ? Math.round(((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100)
      : usersLast30Days > 0 ? 100 : 0;

    // Combine, sort, then format recent activities
    const allActivities = [
      ...recentUsers.map((user: { name: string | null; createdAt: Date }) => ({
        type: 'user',
        message: `New customer registered: ${user.name ?? 'No Name'}`,
        createdAt: user.createdAt
      })),
      ...recentContacts.map((contact: { productName: string | null; subject: string; createdAt: Date }) => ({
        type: 'order',
        message: `New inquiry: ${contact.productName ?? contact.subject}`,
        createdAt: contact.createdAt
      })),
      ...recentProducts.map((product: { name: string; createdAt: Date }) => ({
        type: 'product',
        message: `New product added: ${product.name}`,
        createdAt: product.createdAt
      }))
    ];

    allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const recentActivities: RecentActivity[] = allActivities.slice(0, 5).map(activity => ({
      type: activity.type,
      message: activity.message,
      time: formatTimeAgo(activity.createdAt)
    }));

    const statsData = {
      stats: {
        navbarCategories: totalNavbarCategories,
        navbarSubcategories: totalNavbarSubcategories,
        totalProducts: totalProducts,
        contactDetails: totalContactDetails,
        productEnquiries: totalProductEnquiries,
        totalUsers: totalUsers,
        totalRevenue: 45280,
        totalOrders: totalContactDetails + totalProductEnquiries,
        pageViews: 12567
      },
      trends: {
        contactsTrend: contactsTrend > 0 ? `+${contactsTrend}%` : `${contactsTrend}%`,
        usersTrend: usersTrend > 0 ? `+${usersTrend}%` : `${usersTrend}%`,
        productsTrend: '+5.2%',
        revenueTrend: '+12.5%'
      },
      chartData: [
        { month: 'Jan', sales: 4200, users: Math.floor(totalUsers * 0.15), orders: Math.floor(totalProductEnquiries * 0.20) },
        { month: 'Feb', sales: 3800, users: Math.floor(totalUsers * 0.12), orders: Math.floor(totalProductEnquiries * 0.18) },
        { month: 'Mar', sales: 5100, users: Math.floor(totalUsers * 0.18), orders: Math.floor(totalProductEnquiries * 0.25) },
        { month: 'Apr', sales: 4600, users: Math.floor(totalUsers * 0.16), orders: Math.floor(totalProductEnquiries * 0.22) },
        { month: 'May', sales: 5800, users: Math.floor(totalUsers * 0.20), orders: Math.floor(totalProductEnquiries * 0.28) },
        { month: 'Jun', sales: 6200, users: Math.floor(totalUsers * 0.22), orders: Math.floor(totalProductEnquiries * 0.30) }
      ],
      recentActivities: recentActivities,
      topProducts: [
        { name: 'Marine Rubber Mats', sales: Math.floor(totalProducts * 0.25), revenue: '$3,750' },
        { name: 'Marine LED Lights', sales: Math.floor(totalProducts * 0.20), revenue: '$1,568' },
        { name: 'Safety Equipment', sales: Math.floor(totalProducts * 0.18), revenue: '$3,492' },
        { name: 'Navigation Tools', sales: Math.floor(totalProducts * 0.15), revenue: '$4,860' },
        { name: 'Marine Accessories', sales: Math.floor(totalProducts * 0.12), revenue: '$1,260' }
      ]
    };

    console.log('Stats data:', statsData);
    return NextResponse.json(statsData);

  } catch (error) {
    console.error('Error fetching stats data:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: 'Failed to fetch stats data', details: errorMessage },
      { status: 500 }
    );
  }
}

// Helper function (no changes needed)
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}