# Next.js Backend & Authentication Learning Project

A complete Next.js project demonstrating backend API routes, authentication with NextAuth, and database integration with Prisma.

## 🚀 Features

- ✅ **API Routes** - RESTful endpoints using Next.js App Router
- ✅ **Authentication** - NextAuth with multiple providers (GitHub, Google, Credentials)
- ✅ **Database** - Prisma ORM with SQLite (easily switchable to PostgreSQL/MySQL)
- ✅ **Protected Routes** - Server and client-side authentication guards
- ✅ **User Registration** - Email/password signup with bcrypt
- ✅ **Session Management** - JWT-based sessions
- ✅ **TypeScript** - Full type safety

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts   # NextAuth endpoints
│   │   └── register/route.ts        # User registration
│   ├── hello/route.ts               # Public API example
│   ├── protected/route.ts           # Protected API example
│   └── users/route.ts               # User CRUD operations
├── layout.tsx                       # Root layout with SessionProvider
├── page.tsx                         # Home page with auth demo
└── providers.tsx                    # Client-side providers

lib/
├── auth.ts                          # NextAuth configuration
└── prisma.ts                        # Prisma client instance

prisma/
└── schema.prisma                    # Database schema

types/
└── next-auth.d.ts                   # TypeScript declarations
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local` and update with your values:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"

# GitHub OAuth (optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Google OAuth (optional)
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

**Generate a secret key:**
```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio to view/edit data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Learning Guide

### Understanding API Routes

API routes in Next.js 13+ App Router are created by adding `route.ts` files:

**Example: `app/api/hello/route.ts`**
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello API!' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Authentication Flow

1. **User Registration**: `POST /api/auth/register`
   - Accepts email, password, name
   - Hashes password with bcrypt
   - Stores in database

2. **Sign In**: Use NextAuth providers
   - Credentials (email/password)
   - GitHub OAuth
   - Google OAuth

3. **Protected Routes**: Check session
   ```typescript
   import { getServerSession } from 'next-auth/next';
   import { authOptions } from '@/lib/auth';

   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

### Database Operations

```typescript
import { prisma } from '@/lib/prisma';

// Create
const user = await prisma.user.create({
  data: { name, email, password }
});

// Read
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({ where: { email } });

// Update
await prisma.user.update({
  where: { id },
  data: { name: 'New Name' }
});

// Delete
await prisma.user.delete({ where: { id } });
```

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/hello` | No | Public API test endpoint |
| GET | `/api/protected` | Yes | Protected endpoint example |
| POST | `/api/auth/register` | No | Register new user |
| GET/POST | `/api/auth/[...nextauth]` | Varies | NextAuth endpoints |
| GET | `/api/users` | Yes | List all users |
| POST | `/api/users` | Yes | Create new user |

## 🧪 Testing the APIs

### Test Registration (Command Line)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Hello API
```bash
curl http://localhost:3000/api/hello
```

### Test Protected Endpoint
Use the UI to sign in first, then test protected routes through the browser.

## 🔐 Setting Up OAuth Providers

### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to `.env.local`

## 📖 Key Concepts

### Server vs Client Components

- **Server Components** (default): Can access database directly, run on server
- **Client Components** (`"use client"`): Interactive, use React hooks, run in browser

### Protected API Routes

```typescript
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with authenticated logic
}
```

### Role-Based Access

```typescript
if (session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 🚀 Next Steps

- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add role-based permissions
- [ ] Create admin dashboard
- [ ] Add API rate limiting
- [ ] Implement refresh tokens
- [ ] Add unit tests
- [ ] Deploy to production

## 📚 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

MIT
