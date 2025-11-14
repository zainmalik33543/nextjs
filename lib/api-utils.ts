// Utility functions for API responses

import { NextResponse } from 'next/server';

export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized - Please sign in',
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
    },
    { status: 404 }
  );
}

export function serverErrorResponse(message = 'Internal server error') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}
