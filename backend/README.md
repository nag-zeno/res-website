# 🚀 SpeakEasy Backend API

Backend API for SpeakEasy English Learning Application built with Node.js, Express, and Prisma.

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

---

## 🏗️ Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── sessionController.js
│   │   ├── settingsController.js
│   │   └── aiController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── errorHandler.js   # Global error handler
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── sessions.js
│   │   ├── settings.js
│   │   └── ai.js
│   └── server.js             # Express app
├── .env.example              # Environment variables template
└── package.json
```

---

## 🚀 Quick Start

### **1. Install Dependencies**

```bash
cd backend
npm install
```

### **2. Setup Environment Variables**

```bash
# Copy example env file
copy .env.example .env

# Edit .env and update:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random secret key)
# - GEMINI_API_KEY (your Gemini API key)
```

### **3. Setup Database**

```bash
# Create database tables
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

### **4. Start Server**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

---

## 📡 API Endpoints

### **Authentication**

```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user (requires auth)
POST   /api/auth/logout        # Logout (client-side)
```

### **Users**

```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update profile
GET    /api/users/stats        # Get user statistics
```

### **Sessions**

```
GET    /api/sessions           # Get all sessions
POST   /api/sessions           # Create new session
GET    /api/sessions/:id       # Get session by ID
DELETE /api/sessions/:id       # Delete session
GET    /api/sessions/:id/report # Get session report
```

### **Settings**

```
GET    /api/settings           # Get user settings
PUT    /api/settings           # Update settings
```

### **AI Proxy**

```
POST   /api/ai/chat            # Send message to AI
POST   /api/ai/init-conversation # Initialize conversation
```

---

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### **Register Example:**

```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### **Login Example:**

```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## 💾 Database Schema

### **User**

- id, email, password, name, avatar
- Relations: profile, sessions, settings

### **Profile**

- streak, totalSessions, totalMinutes, level

### **Session**

- topic, duration, messageCount, transcript
- Relations: mistakes, vocabulary, feedback

### **Mistake**

- original, correction, explanation, category

### **Vocabulary**

- word, definition, example, level

### **Feedback**

- scores (overall, fluency, grammar, vocabulary, pronunciation)
- strengths, improvements

### **Settings**

- darkMode, showHints, slowMode, dailyReminder, preferredMode

---

## 🧪 Testing API

### **Using cURL:**

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get profile (with token)
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Using Postman:**

1. Import collection (create one from endpoints above)
2. Set environment variable `{{baseUrl}}` = `http://localhost:3000`
3. After login, save token to `{{token}}`
4. Use `{{token}}` in Authorization header

---

## 🔧 Development

### **Database Commands:**

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### **Useful Scripts:**

```bash
npm run dev          # Start dev server with nodemon
npm start            # Start production server
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

---

## 🚢 Deployment

### **Railway (Recommended)**

1. Create account on [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Add environment variables
6. Run migrations: `npx prisma migrate deploy`

### **Render**

1. Create account on [Render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub
4. Add environment variables
5. Build command: `npm install && npx prisma generate`
6. Start command: `npm start`

---

## 📝 Environment Variables

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-key
CORS_ORIGIN=https://your-frontend.com
```

---

## 🐛 Troubleshooting

**Database connection failed:**

- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Check firewall settings

**JWT errors:**

- Verify JWT_SECRET is set
- Check token format in Authorization header
- Token may be expired (default 7 days)

**Prisma errors:**

- Run `npx prisma generate`
- Check schema.prisma syntax
- Ensure database is migrated

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 🎉 Ready to use

Backend API is now ready. Connect your frontend and start building! 🚀
