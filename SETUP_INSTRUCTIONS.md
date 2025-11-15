# 🚀 Admin Dashboard Setup - Final Steps

## ✅ What You Just Did
1. ✅ Ran `npx prisma generate`
2. ✅ Ran `npx prisma migrate dev --name add_admin_dashboard`

## 📝 Next Steps

### Step 1: Create Admin User

Run the seed script to create your first admin user:

```bash
# Make sure you're in the backend directory
cd bellebook-backend

# Run the seed script
npm run seed
# OR
npx ts-node prisma/seed-admin.ts
```

**Login Credentials:**
- Email: `admin@bellebook.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password in production!

### Step 2: Configure Frontend Environment

Create/update `bellebook-web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Start the Services

**Terminal 1 - Backend (from bellebook-backend/):**
```bash
npm run start:dev
```

**Terminal 2 - Frontend (from bellebook-web/):**
```bash
npm run dev
```

### Step 4: Access Admin Dashboard

Open your browser:
```
http://localhost:3000/admin
```

## 🎯 What's Working

### Backend (REST API)
✅ All admin services created
- Analytics KPIs and charts
- User management (suspend/reactivate)
- Employee management
- Booking management
- Role request approval/rejection
- Chat system foundation
- Audit logging

✅ All controllers with authentication
✅ Database models migrated
✅ Admin user seed script

### Frontend (Next.js)
✅ Admin layout with sidebar navigation
✅ Overview dashboard with real data
✅ Role requests management
✅ API service layer with axios
✅ Error handling with fallback to mock data
✅ Responsive design

## 🔐 Testing

1. **Login** (you'll need to create a login page or use existing auth)
2. **View Dashboard**: http://localhost:3000/admin
3. **Manage Requests**: http://localhost:3000/admin/requests

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd bellebook-backend
npm install
npx prisma generate
npm run start:dev
```

### Frontend not connecting to backend?
- Check `bellebook-web/.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check backend is running on port 3001
- Check browser console for CORS errors

### CORS Error?
Add to `bellebook-backend/src/main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Database error?
```bash
cd bellebook-backend
npx prisma migrate reset  # ⚠️ This deletes all data!
npx prisma migrate dev
npm run seed
```

## 📊 API Endpoints Available

### Analytics
- `GET /admin/analytics/overview`
- `GET /admin/analytics/bookings-chart?days=30`
- `GET /admin/analytics/services-distribution`

### Role Requests
- `GET /role-requests`
- `PATCH /role-requests/:id/approve`
- `PATCH /role-requests/:id/reject`

### Users
- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/suspend`
- `PATCH /admin/users/:id/reactivate`

### Bookings
- `GET /admin/bookings`
- `GET /admin/bookings/calendar`
- `PATCH /admin/bookings/:id/cancel`

See full API reference in `docs/ADMIN_DASHBOARD_IMPLEMENTATION.md`

## 🎨 Customization

### Change Colors
Edit `bellebook-web/tailwind.config.ts` or use CSS variables

### Add Menu Items
Edit `bellebook-web/app/admin/layout.tsx` - line 36

### Create New Pages
```bash
cd bellebook-web
mkdir app/admin/new-page
# Create app/admin/new-page/page.tsx
```

## 📚 Documentation

- [Full Implementation Details](./docs/ADMIN_DASHBOARD_IMPLEMENTATION.md)
- [Quick Start Guide](./docs/ADMIN_QUICK_START.md)
- [Original Specification](./docs/ADMIN_DASHBOARD_SPEC.md)

## 🔜 TODO: Pages to Build

1. **Users Management** (`/admin/users`)
   - List all users with filters
   - User detail view
   - Suspend/activate actions

2. **Employees Management** (`/admin/employees`)
   - Employee grid/list
   - Edit specialties and schedules
   - Performance metrics

3. **Bookings Calendar** (`/admin/bookings`)
   - FullCalendar integration
   - Drag-and-drop rescheduling
   - Filter by employee/service

4. **Analytics Page** (`/admin/analytics`)
   - Detailed charts with Recharts
   - Revenue reports
   - Export functionality

5. **Chat System** (`/admin/chat`)
   - WebSocket integration
   - Real-time messaging
   - Quick replies

6. **Settings** (`/admin/settings`)
   - Platform configuration
   - Email templates
   - Payment settings

## 🚀 Quick Commands

```bash
# Create admin user
cd bellebook-backend && npm run seed

# Start backend
cd bellebook-backend && npm run start:dev

# Start frontend
cd bellebook-web && npm run dev

# View database
cd bellebook-backend && npx prisma studio

# Reset database (⚠️ deletes all data)
cd bellebook-backend && npx prisma migrate reset
```

---

**You're all set!** 🎉

Start both servers and navigate to http://localhost:3000/admin
