# Backend Learning Guide for Next.js

## Table of Contents
1. [API Routes Basics](#api-routes-basics)
2. [Authentication with NextAuth](#authentication-with-nextauth)
3. [Database Operations with Prisma](#database-operations-with-prisma)
4. [Advanced Patterns](#advanced-patterns)

---

## API Routes Basics

### Creating an API Route

In Next.js App Router, API routes are defined using `route.ts` files inside the `app/api` directory.

**File: `app/api/hello/route.ts`**
```typescript
import { NextResponse } from 'next/server';

// Handle GET requests
export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

// Handle POST requests
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}

// Other HTTP methods: PUT, PATCH, DELETE, HEAD, OPTIONS
```

### Dynamic Routes

**File: `app/api/users/[id]/route.ts`**
```typescript
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  // Fetch user by ID
  return NextResponse.json({ userId });
}
```

### Query Parameters

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  
  return NextResponse.json({ page, limit });
}
```

### Request Headers

```typescript
export async function GET(request: Request) {
  const token = request.headers.get('authorization');
  const userAgent = request.headers.get('user-agent');
  
  return NextResponse.json({ token, userAgent });
}
```

---

## Authentication with NextAuth

### Understanding NextAuth Flow

1. **User signs in** → NextAuth verifies credentials
2. **Session created** → JWT token generated
3. **Token stored** → In secure HTTP-only cookie
4. **Requests authenticated** → Token validated on each request

### Protecting API Routes

```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // User is authenticated
  return NextResponse.json({ 
    message: 'Protected data',
    user: session.user 
  });
}
```

### Role-Based Access Control

```typescript
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Admin-only logic here
}
```

### Using Auth Helpers

```typescript
import { requireAuth, requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const session = await requireAuth();
    // User is authenticated
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

---

## Database Operations with Prisma

### Basic CRUD Operations

#### Create
```typescript
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
  },
});
```

#### Read
```typescript
// Find one
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' },
});

// Find many
const users = await prisma.user.findMany({
  where: { role: 'user' },
  select: { id: true, name: true, email: true },
});

// Find with relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: '123' },
  include: { posts: true },
});
```

#### Update
```typescript
const updated = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'New Name' },
});
```

#### Delete
```typescript
await prisma.user.delete({
  where: { id: '123' },
});
```

### Advanced Queries

#### Filtering
```typescript
const users = await prisma.user.findMany({
  where: {
    OR: [
      { name: { contains: 'John' } },
      { email: { contains: 'john' } },
    ],
    AND: [
      { role: 'user' },
      { createdAt: { gte: new Date('2024-01-01') } },
    ],
  },
});
```

#### Pagination
```typescript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const users = await prisma.user.findMany({
  skip,
  take: limit,
  orderBy: { createdAt: 'desc' },
});

const total = await prisma.user.count();
```

#### Transactions
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  const profile = await tx.profile.create({ 
    data: { userId: user.id, bio: 'Hello' } 
  });
  return { user, profile };
});
```

---

## Advanced Patterns

### Error Handling

```typescript
import { errorResponse, serverErrorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return errorResponse('Email is required', 400);
    }
    
    const result = await someOperation();
    return successResponse(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return serverErrorResponse();
  }
}
```

### Validation

```typescript
import { validateRequired, validateEmail } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    validateRequired({ name, email, password });
    validateEmail(email);
    validatePassword(password);
    
    // Process valid data
    
  } catch (error) {
    return errorResponse(error.message, 400);
  }
}
```

### Middleware Pattern

```typescript
// lib/middleware.ts
export async function withAuth(
  handler: (req: Request, session: Session) => Promise<Response>
) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return handler(req, session);
  };
}

// Usage in route
export const GET = withAuth(async (req, session) => {
  return NextResponse.json({ user: session.user });
});
```

### File Upload

```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return errorResponse('No file uploaded');
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Save file or process buffer
  
  return successResponse({ filename: file.name });
}
```

### Rate Limiting (Simple)

```typescript
const requests = new Map<string, number[]>();

function rateLimit(ip: string, limit = 10, window = 60000) {
  const now = Date.now();
  const userRequests = requests.get(ip) || [];
  
  // Remove old requests outside window
  const recent = userRequests.filter(time => now - time < window);
  
  if (recent.length >= limit) {
    return false;
  }
  
  recent.push(now);
  requests.set(ip, recent);
  return true;
}

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // Handle request
}
```

---

## Best Practices

1. **Always validate input** - Never trust user data
2. **Use TypeScript** - Catch errors at compile time
3. **Handle errors gracefully** - Return meaningful error messages
4. **Protect sensitive routes** - Always check authentication
5. **Use environment variables** - Never commit secrets
6. **Log important events** - Aid debugging and monitoring
7. **Use transactions** - For operations that must succeed together
8. **Implement pagination** - For large datasets
9. **Cache when possible** - Reduce database load
10. **Test your APIs** - Use tools like Postman or write tests

---

## Common Patterns Cheat Sheet

### Authentication Check
```typescript
const session = await getServerSession(authOptions);
if (!session) return unauthorizedResponse();
```

### Admin Check
```typescript
if (session.user.role !== 'admin') return forbiddenResponse();
```

### Parse JSON Body
```typescript
const body = await parseRequestBody<{ email: string }>(request);
```

### Validate Input
```typescript
validateRequired({ email, password });
validateEmail(email);
```

### Database Query
```typescript
const users = await prisma.user.findMany({
  where: { role: 'user' },
  select: { id: true, name: true },
});
```

### Success Response
```typescript
return successResponse({ data: users });
```

### Error Response
```typescript
return errorResponse('User not found', 404);
```

---

## Next Steps

1. Study the code in `app/api/` directory
2. Test each endpoint using the demo page
3. Modify existing routes to understand the flow
4. Create your own custom API routes
5. Add new database models in `prisma/schema.prisma`
6. Implement additional authentication providers
7. Add comprehensive error handling
8. Write unit tests for your APIs

Happy Learning! 🚀
