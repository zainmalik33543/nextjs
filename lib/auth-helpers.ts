import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { NextRequest } from 'next/server';

/**
 * Get the current session from the request
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getCurrentSession();
  return !!session;
}

/**
 * Get authenticated user or null
 */
export async function getAuthenticatedUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string) {
  const session = await getCurrentSession();
  return session?.user?.role === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  return await hasRole('admin');
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Require specific role - throws if user doesn't have role
 */
export async function requireRole(role: string) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error('Forbidden');
  }
  return session;
}

/**
 * Require admin - throws if user is not admin
 */
export async function requireAdmin() {
  return await requireRole('admin');
}
