# 🚀 Quick Reference Card

## Test Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

---

## API Endpoints Quick Reference

### Public Endpoints
```
GET  /api/hello              → Test public API
POST /api/auth/register      → Register new user
POST /api/auth/signin        → Sign in (handled by NextAuth)
```

### Protected Endpoints (Requires Auth)
```
GET  /api/protected          → Test protected endpoint
GET  /api/users              → List all users
POST /api/users              → Create new user
```

### Admin Endpoints (Requires Admin Role)
```
GET    /api/admin/users      → List users with pagination & search
PATCH  /api/admin/users      → Update user role
DELETE /api/admin/users?id=  → Delete user by ID
```

---

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Database
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:seed      # Seed database with test users
npx prisma migrate dev --name migration_name  # Create migration
npx prisma generate  # Generate Prisma Client
```

---

## Testing APIs with cURL

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Test Public API
```bash
curl http://localhost:3000/api/hello
```

### Test Protected API (after signing in via browser)
```bash
curl http://localhost:3000/api/protected \
  -H "Cookie: your-session-cookie"
```

---

## File Structure Quick Guide

```
📂 app/
  ├── 📂 api/                    ← All backend API routes
  │   ├── 📂 auth/
  │   │   ├── 📂 [...nextauth]/  ← NextAuth endpoints
  │   │   └── 📂 register/       ← User registration
  │   ├── 📂 hello/              ← Public API example
  │   ├── 📂 protected/          ← Protected API example
  │   ├── 📂 users/              ← User CRUD
  │   └── 📂 admin/              ← Admin endpoints
  ├── layout.tsx                 ← Root layout (SessionProvider)
  ├── page.tsx                   ← Home page with demo UI
  └── providers.tsx              ← Client providers

📂 lib/                          ← Utility libraries
  ├── auth.ts                    ← NextAuth config
  ├── auth-helpers.ts            ← Auth utility functions
  ├── prisma.ts                  ← Prisma client
  ├── api-utils.ts               ← API response helpers
  └── validation.ts              ← Input validation

📂 prisma/
  ├── schema.prisma              ← Database schema
  └── seed.ts                    ← Database seeder

📂 types/
  └── next-auth.d.ts             ← TypeScript declarations
```

---

## Key Concepts

### Creating API Routes
- File: `app/api/[route]/route.ts`
- Export: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Return: `NextResponse.json(data)`

### Protecting Routes
```typescript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
if (!session) return unauthorizedResponse();
```

### Database Operations
```typescript
import { prisma } from '@/lib/prisma';

const users = await prisma.user.findMany();
const user = await prisma.user.create({ data: {...} });
```

### Client-Side Auth
```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

const { data: session } = useSession();
```

---

## Environment Variables Required

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GITHUB_ID="optional-for-oauth"
GITHUB_SECRET="optional-for-oauth"
```

---

## Troubleshooting

**Issue:** NextAuth not working
- Check `.env.local` has `NEXTAUTH_SECRET`
- Verify `NEXTAUTH_URL` matches your dev URL
- Clear browser cookies

**Issue:** Database errors
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Check `DATABASE_URL` in `.env`

**Issue:** Type errors
- Run `npm install`
- Restart TypeScript server in VS Code
- Check `types/next-auth.d.ts` exists

---

## Learning Path

1. ✅ **Start Here**: Open http://localhost:3000
2. ✅ **Test Public API**: Click "Test /api/hello"
3. ✅ **Sign In**: Use test credentials above
4. ✅ **Test Protected API**: Click "Test /api/protected"
5. ✅ **Read Code**: Start with `app/api/hello/route.ts`
6. ✅ **Read Docs**: Open `LEARNING_GUIDE.md`
7. ✅ **Modify**: Change existing routes
8. ✅ **Create**: Build your own endpoints

---

## Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Prisma Docs**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## Pro Tips

💡 Use Prisma Studio to visualize your database:
```bash
npm run db:studio
```

💡 Check API errors in terminal where `npm run dev` is running

💡 Use VS Code REST Client extension to test APIs without browser

💡 Read `LEARNING_GUIDE.md` for detailed explanations

💡 Study the code in `lib/` for reusable patterns

---

**Happy Learning! 🎉**
