# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Update Database Schema

```bash
cd bellebook-backend
npx prisma generate
npx prisma migrate dev --name add_admin_dashboard
```

### Step 2: Create an Admin User

Run this SQL in your database:

```sql
-- Update existing user to admin
UPDATE users 
SET role = 'ADMIN', account_status = 'ACTIVE' 
WHERE email = 'admin@bellebook.com';

-- Create admin profile (replace USER_ID with actual user id)
INSERT INTO admin_profiles (id, user_id, permissions, is_super_admin, created_at, updated_at) 
VALUES (
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
  'USER_ID_HERE',
  '["read", "write", "delete"]',
  1,
  datetime('now'),
  datetime('now')
);
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd bellebook-backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd bellebook-web
npm run dev
```

### Step 4: Access Admin Dashboard

Open your browser and navigate to:
```
http://localhost:3000/admin
```

## 📁 Project Structure

```
bellebook-backend/
├── prisma/
│   └── schema.prisma           # ✅ Updated with new models
├── src/
│   ├── admin/
│   │   ├── services/           # ✅ All admin services
│   │   ├── controllers/        # ✅ All admin controllers
│   │   └── admin.module.ts     # ✅ Admin module
│   └── app.module.ts           # ✅ Updated with AdminModule

bellebook-web/
├── app/
│   └── admin/
│       ├── layout.tsx          # ✅ Admin layout with sidebar
│       ├── page.tsx            # ✅ Overview dashboard
│       └── requests/
│           └── page.tsx        # ✅ Role requests management
└── components/
    └── admin/
        ├── StatCard.tsx        # ✅ KPI card component
        └── DataTable.tsx       # ✅ Generic table component
```

## 🎯 What's Working Now

✅ **Backend:**
- All services and controllers created
- Audit logging system
- Role management
- User management
- Booking management
- Chat system foundation
- Analytics calculations

✅ **Frontend:**
- Responsive admin layout
- Overview dashboard with KPIs
- Role requests management
- Reusable components

## 🔧 What Needs Connection

The frontend currently uses **mock data**. To connect to real APIs:

1. Create an API service file:

```typescript
// bellebook-web/services/admin-api.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const adminApi = {
  // Analytics
  getOverview: () => axios.get(`${API_BASE}/admin/analytics/overview`),
  
  // Role Requests
  getRoleRequests: () => axios.get(`${API_BASE}/admin/role-requests`),
  approveRequest: (id: string) => axios.patch(`${API_BASE}/admin/role-requests/${id}/approve`),
  rejectRequest: (id: string, reason: string) => 
    axios.patch(`${API_BASE}/admin/role-requests/${id}/reject`, { reason }),
};
```

2. Update pages to use the API:

```typescript
// In your page component
import { adminApi } from '@/services/admin-api';

useEffect(() => {
  async function loadData() {
    const response = await adminApi.getOverview();
    setData(response.data);
  }
  loadData();
}, []);
```

## 🎨 Customization

### Change Primary Color

Edit `bellebook-web/app/globals.css`:

```css
/* Change pink-600 to your preferred color */
.bg-pink-600 { background-color: #YOUR_COLOR; }
.text-pink-600 { color: #YOUR_COLOR; }
.border-pink-600 { border-color: #YOUR_COLOR; }
```

### Add New Menu Item

Edit `bellebook-web/app/admin/layout.tsx`:

```typescript
const menuItems: AdminMenuItem[] = [
  // ... existing items
  { 
    id: 'reports', 
    label: 'Relatórios', 
    icon: FileText, 
    path: '/admin/reports' 
  },
];
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct in `.env`

### Prisma Generate Fails
```
Error: Unknown field auditLog
```
**Solution:** Run `npx prisma generate` after updating schema.prisma

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process or use a different port:
```bash
npm run dev -- -p 3001
```

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Solution:** Add CORS middleware in backend:
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## 📊 Sample Data for Testing

Create some test data:

```sql
-- Create test users
INSERT INTO users (id, email, password, name, role, account_status) VALUES
  (gen_random_uuid(), 'customer1@test.com', 'hashed_password', 'Test Customer 1', 'CUSTOMER', 'ACTIVE'),
  (gen_random_uuid(), 'customer2@test.com', 'hashed_password', 'Test Customer 2', 'CUSTOMER', 'ACTIVE'),
  (gen_random_uuid(), 'employee1@test.com', 'hashed_password', 'Test Employee 1', 'CUSTOMER', 'ACTIVE');

-- Create a test role request
INSERT INTO role_requests (id, user_id, current_role, requested_role, request_reason, status) 
SELECT 
  gen_random_uuid(),
  id,
  'CUSTOMER',
  'EMPLOYEE',
  'I want to become a service provider',
  'PENDING'
FROM users WHERE email = 'employee1@test.com';
```

## 🎓 Next Steps

1. **Connect Frontend to Backend** - Replace mock data with API calls
2. **Add More Pages** - Users list, Bookings calendar, Analytics
3. **Implement WebSocket** - For real-time chat
4. **Add Tests** - Unit and E2E tests
5. **Deploy** - Vercel (frontend) + Railway (backend)

## 📚 Learn More

- [Full Implementation Guide](./ADMIN_DASHBOARD_IMPLEMENTATION.md)
- [Original Specification](./ADMIN_DASHBOARD_SPEC.md)
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)

## 🆘 Need Help?

Check the full documentation in `ADMIN_DASHBOARD_IMPLEMENTATION.md` for:
- Complete API reference
- Detailed component documentation
- Security best practices
- Performance optimization tips

---

**Happy Coding!** 🚀
