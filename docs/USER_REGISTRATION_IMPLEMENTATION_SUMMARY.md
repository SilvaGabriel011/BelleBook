# User Registration & Role Management - Implementation Summary

## ✅ Backend Implementation Complete

### 1. Database Schema (Already Configured)
Location: `bellebook-backend/prisma/schema.prisma`

**Models Updated:**
- ✅ `User` - Added `accountStatus` field (ACTIVE, PENDING_APPROVAL, SUSPENDED, REJECTED)
- ✅ `UserRole` enum (CUSTOMER, EMPLOYEE, ADMIN)
- ✅ `RoleRequest` - Complete model for role change requests
- ✅ `EmployeeProfile` & `AdminProfile` - Specialized profiles

### 2. DTOs Enhanced
**Location: `bellebook-backend/src/auth/dto/register.dto.ts`**
- ✅ Added `displayName` (optional)
- ✅ Made `phone` required with international format validation
- ✅ Updated validation messages in Portuguese

**Location: `bellebook-backend/src/users/dto/create-role-request.dto.ts`**
- ✅ Increased minimum justification length to 50 characters (per spec)
- ✅ Added optional fields for Employee: `experience`, `certifications`, `motivation`
- ✅ Added optional field for Admin: `department`
- ✅ Restricted requestedRole to EMPLOYEE or ADMIN only

### 3. Auth Service Updated
**Location: `bellebook-backend/src/auth/auth.service.ts`**
- ✅ Registration creates users with CUSTOMER role and ACTIVE status by default
- ✅ Returns complete user data including `role`, `accountStatus`, `displayName`, `phone`
- ✅ Login updates `lastLoginAt` timestamp
- ✅ JWT token includes role claim for better authorization

### 4. Users Service Enhanced  
**Location: `bellebook-backend/src/users/users.service.ts`**
- ✅ Create method sets default role (CUSTOMER) and accountStatus (ACTIVE)
- ✅ Added `updateLastLogin` method

### 5. Notifications Service Created
**Location: `bellebook-backend/src/notifications/notifications.service.ts`**

**Email Templates Implemented:**
- ✅ `sendRoleRequestCreated` - Confirms request received (48h SLA)
- ✅ `sendRoleRequestApproved` - Congratulates user with CTA to dashboard
- ✅ `sendRoleRequestRejected` - Explains rejection with reason
- ✅ `notifyAdminsNewRequest` - Alerts admins about pending requests

**Features:**
- Beautifully formatted HTML email templates
- Plain text fallback for all templates
- Portuguese language support
- Role name localization (CUSTOMER→Cliente, EMPLOYEE→Profissional, ADMIN→Administrador)
- Ready for SendGrid/Mailgun integration

**Location: `bellebook-backend/src/notifications/notifications.module.ts`**
- ✅ Module exported for use in other modules

### 6. Role Request Service Enhanced
**Location: `bellebook-backend/src/users/role-request.service.ts`**

**Features Implemented:**
- ✅ Integrated NotificationsService
- ✅ Validates role progression rules (CUSTOMER can't request ADMIN directly)
- ✅ Prevents duplicate pending requests
- ✅ Updates user `accountStatus` to PENDING_APPROVAL when request created
- ✅ Creates Employee/Admin profiles on approval
- ✅ Sends notifications on request creation, approval, and rejection
- ✅ Super admin check for approving ADMIN role requests
- ✅ Restores ACTIVE status on rejection

**Business Logic:**
- Customer → Employee (allowed)
- Customer → Admin (blocked, must become Employee first)
- Employee → Admin (allowed, requires super admin approval)
- Only 1 pending request at a time

### 7. Account Status Middleware
**Location: `bellebook-backend/src/auth/middleware/account-status.middleware.ts`**
- ✅ Blocks SUSPENDED accounts completely
- ✅ Restricts PENDING_APPROVAL accounts to view profile and role-requests only
- ✅ Prevents access to bookings, services, etc. while pending

### 8. Module Configuration
**Location: `bellebook-backend/src/users/users.module.ts`**
- ✅ NotificationsModule imported
- ✅ All services properly wired

---

## 📋 Frontend Implementation Needed

### 1. Update Registration Page
**File: `bellebook-web/app/(auth)/register/page.tsx`**

**Current State:** Basic single-step registration exists

**Required Changes:**
```typescript
// Update schema to require phone
const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    displayName: z.string().optional(),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone em formato inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });
```

**Post-Registration Flow:**
After successful registration, redirect to `/role-selection` instead of `/home`

### 2. Create Role Selection Page
**File: `bellebook-web/app/(auth)/role-selection/page.tsx`**

**Purpose:** Let new users choose their role

**UI Requirements:**
- 3 cards: Customer, Employee, Admin
- Each card shows:
  - Icon (Sparkles for Customer, Scissors for Employee, Shield for Admin)
  - Role name
  - Description
  - Access level (Immediate for Customer, Requires Approval for others)
  - Color coding (Pink for Customer, Purple for Employee, Blue for Admin)

**Actions:**
- Click Customer → Navigate to `/home` (immediate access)
- Click Employee → Navigate to `/role-request?role=EMPLOYEE`
- Click Admin → Navigate to `/role-request?role=ADMIN`

### 3. Create Role Request Form Page
**File: `bellebook-web/app/(auth)/role-request/page.tsx`**

**Dynamic Form Based on Role:**

**For EMPLOYEE:**
```typescript
{
  requestedRole: 'EMPLOYEE',
  reason: string (min 50 chars),
  experience: string (min 100 chars),
  certifications: string (optional),
  motivation: string (optional)
}
```

**For ADMIN:**
```typescript
{
  requestedRole: 'ADMIN',
  reason: string (min 50 chars),
  department: string (optional, select: "Operações", "Financeiro", "TI", "Marketing")
}
```

**On Submit:**
- POST to `/api/role-requests`
- On success → Navigate to `/pending-approval`

### 4. Create Pending Approval Page
**File: `bellebook-web/app/(auth)/pending-approval/page.tsx`**

**UI Elements:**
- Animated clock icon
- "Solicitação em Análise" heading
- Timeline showing:
  1. ✅ Solicitação enviada
  2. ⏳ Em análise (até 48 horas)
  3. ⏹️ Decisão final
- Estimated analysis time
- Link to support/help
- Logout button

**Data Fetching:**
- GET `/api/role-requests/my-request` to check current status
- Poll every 30 seconds or use real-time updates
- If status changes to APPROVED → Redirect to `/dashboard`
- If status changes to REJECTED → Show rejection reason + option to reapply

### 5. Create Admin Role Management Dashboard
**File: `bellebook-web/app/(admin)/role-requests/page.tsx`**

**Protected Route:** Requires `role: ADMIN`

**Features:**
- List all pending role requests
- Filter by role (EMPLOYEE, ADMIN)
- Sort by date
- View request details modal showing:
  - User info (name, email, account age)
  - Requested role
  - Justification + additional fields
  - Action buttons: Approve / Reject

**Actions:**
- Approve: PATCH `/api/role-requests/:id/approve` with optional notes
- Reject: PATCH `/api/role-requests/:id/reject` with required reason

### 6. Update Auth Store
**File: `bellebook-web/store/auth.store.ts`**

Add `accountStatus` and `role` to user state:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  phone?: string;
  role: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';
  points: number;
}
```

### 7. Create Protected Route Guard
**File: `bellebook-web/lib/guards/AccountStatusGuard.tsx`**

```typescript
export function AccountStatusGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (user?.accountStatus === 'PENDING_APPROVAL') {
      router.push('/pending-approval');
    } else if (user?.accountStatus === 'SUSPENDED') {
      router.push('/account-suspended');
    } else if (user?.accountStatus === 'REJECTED') {
      router.push('/account-rejected');
    }
  }, [user, router]);
  
  if (user?.accountStatus !== 'ACTIVE') {
    return null;
  }
  
  return <>{children}</>;
}
```

Wrap dashboard routes with this guard.

---

## 🚀 Deployment Checklist

### Database
- [ ] Run migration: `npx prisma migrate dev --name add_role_management`
- [ ] Create super admin seed: Update `prisma/seed.ts`
```typescript
await prisma.user.create({
  data: {
    email: 'admin@bellebook.com',
    password: await bcrypt.hash('SuperSecure123!', 10),
    name: 'Super Admin',
    displayName: 'Admin',
    phone: '+5511999999999',
    role: 'ADMIN',
    accountStatus: 'ACTIVE',
    adminProfile: {
      create: {
        permissions: JSON.stringify(['read', 'write', 'delete', 'manage_users']),
        isSuperAdmin: true,
        department: 'TI',
      },
    },
  },
});
```
- [ ] Run seed: `npm run seed`

### Backend
- [ ] Add `FRONTEND_URL` to `.env`
- [ ] Configure email service (SendGrid API key) when ready
- [ ] Install missing dependency if needed: `npm install`
- [ ] Test endpoints with Postman/Insomnia
- [ ] Run backend: `npm run start:dev`

### Frontend
- [ ] Install any missing dependencies: `npm install`
- [ ] Update API base URL in services
- [ ] Build and test locally: `npm run dev`
- [ ] Test full registration → role selection → approval flow

---

## 🧪 Testing Scenarios

### Scenario 1: Customer Registration (Happy Path)
1. Register with valid email, phone, password
2. Select "Customer" role
3. Redirected to home immediately
4. accountStatus = ACTIVE

### Scenario 2: Employee Request (Happy Path)
1. Register as Customer
2. Select "Employee" role
3. Fill justification form (experience 100+ chars, reason 50+ chars)
4. Submit request
5. Redirected to pending approval page
6. accountStatus = PENDING_APPROVAL
7. Cannot access bookings/services (middleware blocks)
8. Admin approves request
9. Email notification received
10. Redirected to dashboard
11. accountStatus = ACTIVE, role = EMPLOYEE

### Scenario 3: Direct Admin Request (Should Fail)
1. Register as Customer
2. Try to select "Admin" role
3. Backend returns error: "Você deve primeiro se tornar EMPLOYEE"

### Scenario 4: Employee → Admin (Requires Super Admin)
1. User with role EMPLOYEE requests ADMIN
2. Regular admin tries to approve → Error
3. Super admin approves → Success

### Scenario 5: Rejection Flow
1. Submit role request
2. Admin rejects with reason
3. Email notification with reason
4. accountStatus restored to ACTIVE
5. Can submit new request later

---

## 📊 Analytics Events to Track

**Location:** Use existing analytics service

```typescript
// On registration
analytics.track('user_registered', {
  role: 'CUSTOMER',
  source: 'web',
});

// On role request
analytics.track('role_request_created', {
  requestedRole: 'EMPLOYEE',
  userAge: differenceInDays(new Date(), user.createdAt),
});

// On approval/rejection
analytics.track('role_request_approved', {
  requestedRole: 'EMPLOYEE',
  approvalTime: differenceInHours(approvedAt, createdAt),
});

analytics.track('role_request_rejected', {
  requestedRole: 'EMPLOYEE',
  reason: 'insufficient_experience',
});
```

---

## 🔒 Security Considerations

1. **Rate Limiting:** Add `@nestjs/throttler` to prevent role request spam
2. **Email Verification:** Consider adding email verification before allowing role requests
3. **Audit Log:** Log all role changes for compliance
4. **Super Admin Protection:** Ensure only one super admin exists initially
5. **Password Strength:** Enforce strong password policy

---

## 🎨 UI/UX Enhancements

1. **Progress Indicator:** Show steps during registration (1 of 3, 2 of 3, etc.)
2. **Success Animations:** Use Framer Motion for smooth transitions
3. **Real-time Validation:** Show field validation as user types
4. **Mobile Responsive:** Ensure all forms work on mobile
5. **Dark Mode:** Support dark mode for all new pages
6. **Loading States:** Show skeletons while fetching data

---

## 📝 Next Steps

1. **Immediate:** Complete frontend implementation following this guide
2. **Short-term:** Integrate SendGrid for email notifications
3. **Medium-term:** Add email verification step before role requests
4. **Long-term:** Implement advanced admin analytics dashboard

---

**Implementation Status:** ✅ Backend Complete | ⏳ Frontend Pending

**Estimated Frontend Development Time:** 6-8 hours

**Last Updated:** 2025-01-15
