# 🚀 Backend Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```powershell
cd backend
npm install
```

### Step 2: Setup PostgreSQL

**Option A: Local PostgreSQL**

1. Download PostgreSQL: <https://www.postgresql.org/download/windows/>
2. Install and remember password
3. Create database:

```sql
CREATE DATABASE speakeasy;
```

**Option B: Free Cloud Database (Recommended)**

1. Go to <https://railway.app> or <https://supabase.com>
2. Create free PostgreSQL database
3. Copy connection string

### Step 3: Configure Environment

```powershell
# Copy example file
copy .env.example .env

# Edit .env file with your values
notepad .env
```

Update these values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/speakeasy"
JWT_SECRET="change-this-to-random-string"
GEMINI_API_KEY="AIzaSyCa-0jgT1BQP782yVwAi8OtJ3IjgdLOaR8"
```

### Step 4: Setup Database

```powershell
# Push schema to database
npx prisma db push

# Verify with Prisma Studio
npx prisma studio
```

### Step 5: Start Server

```powershell
npm run dev
```

✅ Server running on <http://localhost:3000>

---

## Test API

### Register User

```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

### Login

```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

Copy the `token` from response!

### Get Profile

```powershell
curl http://localhost:3000/api/users/profile -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

**"Cannot connect to database"**

- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Test connection: `npx prisma db pull`

**"Module not found"**

- Run: `npm install`
- Run: `npx prisma generate`

**"Port 3000 already in use"**

- Change PORT in .env
- Or kill process: `netstat -ano | findstr :3000`

---

## Next Steps

1. ✅ Backend is running
2. Connect frontend to API
3. Replace localStorage with API calls
4. Deploy to Railway/Render

---

## Useful Commands

```powershell
# Development
npm run dev              # Start with auto-reload

# Database
npx prisma studio        # View database
npx prisma migrate dev   # Create migration
npx prisma db push       # Quick schema update

# Production
npm start                # Start server
```

---

## 🎉 You're ready

Backend API is running. Now integrate with frontend! 🚀
