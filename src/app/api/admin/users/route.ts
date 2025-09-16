import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin is authenticated
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('adminSession');
    
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get search and filter parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const verified = searchParams.get('verified') || '';

    // Build where clause for filtering
    const whereClause: any = {};

    // Search filter
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Email verified filter - now includes OAuth users
    if (verified === 'verified') {
      whereClause.OR = [
        {
          emailVerified: {
            not: null
          }
        },
        {
          accounts: {
            some: {
              type: 'oauth'
            }
          }
        }
      ];
    } else if (verified === 'unverified') {
      whereClause.AND = [
        {
          emailVerified: null
        },
        {
          accounts: {
            none: {
              type: 'oauth'
            }
          }
        }
      ];
    }

    // Fetch users from database with sessions data
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          select: {
            expires: true,
            sessionToken: true
          }
        },
        accounts: {
          select: {
            provider: true,
            type: true
          }
        },
        _count: {
          select: {
            sessions: true,
            accounts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for frontend
    const transformedUsers = users.map((user: typeof users[0]) => {
      // Check for active sessions (not expired)
      const now = new Date();
      const activeSessions = user.sessions.filter((session: { expires: Date; sessionToken: string }) => session.expires > now);
      
      // Check if user is verified (either email verified OR has OAuth account)
      const hasOAuthAccount = user.accounts.some((account: { provider: string; type: string }) => account.type === 'oauth');
      const isVerified = user.emailVerified !== null || hasOAuthAccount;
      
      // Determine status based on active sessions or recent activity
      const hasActiveSessions = activeSessions.length > 0;
      const recentActivity = (now.getTime() - user.updatedAt.getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 days
      const status = hasActiveSessions || recentActivity ? 'active' : 'inactive';

      return {
        id: user.id,
        name: user.name || 'No Name',
        email: user.email,
        image: user.image,
        joinDate: user.createdAt.toISOString(),
        lastActivity: user.updatedAt.toISOString(),
        verified: isVerified,
        status: status as 'active' | 'inactive',
        sessionsCount: activeSessions.length,
        accountsCount: user._count.accounts
      };
    });

    return NextResponse.json({
      users: transformedUsers,
      total: transformedUsers.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if admin is authenticated
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('adminSession');
    
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete user and all related data (accounts, sessions will be deleted due to cascade)
    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if admin is authenticated
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('adminSession');
    
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'verify':
        updateData.emailVerified = new Date();
        break;
      case 'unverify':
        updateData.emailVerified = null;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
