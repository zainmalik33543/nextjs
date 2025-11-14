import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  forbiddenResponse 
} from '@/lib/api-utils';
import { validateRequired } from '@/lib/validation';

/**
 * GET /api/admin/users
 * List all users with pagination (Admin only)
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.user.role !== 'admin') {
    return forbiddenResponse('Admin access required');
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              sessions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse('Failed to fetch users', 500);
  }
}

/**
 * PATCH /api/admin/users
 * Update user role (Admin only)
 */
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.user.role !== 'admin') {
    return forbiddenResponse('Admin access required');
  }

  try {
    const body = await request.json();
    const { userId, role } = body;

    validateRequired({ userId, role });

    if (!['user', 'admin'].includes(role)) {
      return errorResponse('Invalid role. Must be "user" or "admin"', 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return successResponse({ 
      message: 'User role updated successfully',
      user 
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404);
    }
    
    return errorResponse('Failed to update user', 500);
  }
}

/**
 * DELETE /api/admin/users
 * Delete a user (Admin only)
 */
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.user.role !== 'admin') {
    return forbiddenResponse('Admin access required');
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return errorResponse('Cannot delete your own account', 400);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse({ 
      message: 'User deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404);
    }
    
    return errorResponse('Failed to delete user', 500);
  }
}
