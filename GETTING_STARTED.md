# ✅ Getting Started Checklist

Use this checklist to start learning backend development with this project:

## 🎯 Quick Start (5 minutes)

- [ ] Open http://localhost:3000 in your browser
- [ ] Click "Sign In" button
- [ ] Use test credentials:
  - **Admin**: admin@example.com / admin123
  - **User**: user@example.com / user123
- [ ] Click "Test /api/hello" (Public API)
- [ ] Click "Test /api/protected" (Protected API)
- [ ] Sign out and test protected API again (should fail)

## 📚 Learn API Basics (30 minutes)

- [ ] Open `app/api/hello/route.ts` in VS Code
- [ ] Read the code - notice `GET` and `POST` exports
- [ ] Modify the response message
- [ ] Save and refresh browser - see your changes
- [ ] Open `app/page.tsx` to see how the API is called
- [ ] Read `QUICK_REFERENCE.md` for API patterns

## 🔐 Learn Authentication (45 minutes)

- [ ] Open `lib/auth.ts` to see NextAuth configuration
- [ ] Check the three providers: GitHub, Google, Credentials
- [ ] Open `app/api/protected/route.ts`
- [ ] See how `getServerSession` protects the route
- [ ] Try calling `/api/protected` without being signed in
- [ ] Open `app/api/auth/register/route.ts`
- [ ] See how passwords are hashed with bcrypt

## 💾 Learn Database (45 minutes)

- [ ] Run `npm run db:studio` in terminal
- [ ] Browse the User table in Prisma Studio
- [ ] See the two test users created
- [ ] Open `prisma/schema.prisma`
- [ ] Understand the User, Account, Session models
- [ ] Open `app/api/users/route.ts`
- [ ] See how Prisma queries work (`findMany`, `create`)
- [ ] Try adding a new user via the API

## 🛡️ Learn Protected Routes (30 minutes)

- [ ] Open `app/api/admin/users/route.ts`
- [ ] See role-based access control (admin only)
- [ ] Open `lib/auth-helpers.ts`
- [ ] See reusable auth patterns (`requireAuth`, `requireAdmin`)
- [ ] Sign in as regular user
- [ ] Try to access admin endpoint (should fail)
- [ ] Sign in as admin
- [ ] Access admin endpoint (should work)

## 🔧 Practice: Create Your Own API (1 hour)

- [ ] Create `app/api/posts/route.ts`
- [ ] Add a `GET` method that returns fake posts
- [ ] Add a `POST` method to create a post
- [ ] Protect it with authentication
- [ ] Add posts model to `prisma/schema.prisma`
- [ ] Run migration: `npx prisma migrate dev --name add_posts`
- [ ] Update API to use real database
- [ ] Test in browser

## 📖 Deep Dive (2-3 hours)

- [ ] Read `LEARNING_GUIDE.md` completely
- [ ] Study all utility files in `lib/`
- [ ] Implement pagination in your posts API
- [ ] Add search functionality
- [ ] Create an admin-only delete endpoint
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Test with cURL or Postman

## 🚀 Advanced Features (Optional)

- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add file upload endpoint
- [ ] Create rate limiting
- [ ] Add API versioning
- [ ] Write unit tests
- [ ] Add API documentation
- [ ] Deploy to Vercel

## 💡 Tips for Learning

1. **Start small** - Don't try to understand everything at once
2. **Change things** - Modify code and see what breaks
3. **Read errors** - They tell you what's wrong
4. **Use console.log** - Print values to understand flow
5. **Test often** - Make small changes and test immediately
6. **Read docs** - Check Next.js, NextAuth, and Prisma docs
7. **Ask questions** - Search online when stuck

## 🔗 Essential URLs

- **Application**: http://localhost:3000
- **Database GUI**: Run `npm run db:studio`
- **API Docs**: See `QUICK_REFERENCE.md`
- **Learning Guide**: See `LEARNING_GUIDE.md`

## 📂 Files to Study (in order)

1. `app/api/hello/route.ts` - Simplest API
2. `app/page.tsx` - How to call APIs
3. `lib/prisma.ts` - Database client
4. `lib/auth.ts` - Auth configuration
5. `app/api/protected/route.ts` - Protected API
6. `app/api/auth/register/route.ts` - User registration
7. `app/api/users/route.ts` - CRUD operations
8. `app/api/admin/users/route.ts` - Role-based access
9. `lib/auth-helpers.ts` - Reusable patterns
10. `lib/api-utils.ts` - Response helpers
11. `lib/validation.ts` - Input validation

## ⚡ Quick Commands Reference

```bash
# Start dev server
npm run dev

# View database
npm run db:studio

# Reset database
npx prisma migrate reset

# Add test users
npm run db:seed

# Generate types
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name
```

## 🎓 Learning Goals

By the end, you should be able to:

✅ Create new API routes
✅ Protect routes with authentication
✅ Implement role-based access
✅ Query database with Prisma
✅ Validate user input
✅ Handle errors properly
✅ Hash passwords securely
✅ Manage sessions with NextAuth
✅ Create CRUD endpoints
✅ Understand server vs client components

---

**Start with the Quick Start section and work your way down!**

The best way to learn is by doing - modify the code, break things, fix them, and repeat. 🚀
