# RBAC System - Migration Guide

This guide will help you migrate your database to support the new Role-Based Access Control (RBAC) system.

## Prerequisites

- Node.js and npm installed
- Database connection configured in `.env`
- Backup your current database before proceeding

## Step 1: Generate Prisma Client

First, regenerate the Prisma client with the new schema:

```bash
cd bellebook-backend
npx prisma generate
```

This will update the Prisma client with the new `UserRole`, `AccountStatus` enums and the new models.

## Step 2: Create and Run Migration

Create a new migration for the RBAC changes:

```bash
npx prisma migrate dev --name add_rbac_system
```

This will:
- Create the `UserRole` and `AccountStatus` enums
- Add new fields to the `User` model (`role`, `accountStatus`, `displayName`, `timezone`, `lastLoginAt`)
- Create `EmployeeProfile`, `AdminProfile`, and `RoleRequest` tables
- Automatically update your database

## Step 3: Seed Initial Data (Optional)

Create an initial super admin user by running:

```bash
npx prisma db seed
```

Or manually create a super admin in your database console:

```sql
-- First, create or update a user to be admin
UPDATE users SET role = 'ADMIN', accountStatus = 'ACTIVE' WHERE email = 'admin@bellebook.com';

-- Then create an admin profile
INSERT INTO admin_profiles (id, userId, permissions, isSuperAdmin, createdAt, updatedAt)
SELECT 
  lower(hex(randomblob(16))),
  id,
  '["read","write","delete"]',
  1,
  datetime('now'),
  datetime('now')
FROM users WHERE email = 'admin@bellebook.com';
```

## Step 4: Update Existing Users

All existing users will default to `CUSTOMER` role with `ACTIVE` status. If you need to convert existing users:

```sql
-- Convert specific users to EMPLOYEE
UPDATE users SET role = 'EMPLOYEE' WHERE email IN ('employee1@example.com', 'employee2@example.com');

-- Create employee profiles for them
INSERT INTO employee_profiles (id, userId, specialties, workSchedule, createdAt, updatedAt)
SELECT 
  lower(hex(randomblob(16))),
  id,
  '[]',
  '{}',
  datetime('now'),
  datetime('now')
FROM users WHERE role = 'EMPLOYEE' AND id NOT IN (SELECT userId FROM employee_profiles);
```

## Step 5: Restart Your Backend Server

After migration, restart your NestJS server:

```bash
npm run start:dev
```

## Verification

Test the RBAC system by:

1. **Login as a customer** - Should have basic access
2. **Request role change** - POST `/role-requests` with body:
   ```json
   {
     "requestedRole": "EMPLOYEE",
     "reason": "I want to provide services on the platform"
   }
   ```
3. **Login as admin** - Should see pending requests at GET `/role-requests/pending`
4. **Approve request** - PATCH `/role-requests/:id/approve`

## API Endpoints

### For All Authenticated Users:
- `POST /role-requests` - Request a role change
- `GET /role-requests` - View own role requests
- `GET /role-requests/:id` - View specific request

### For Admins Only:
- `GET /role-requests/pending` - View all pending requests
- `PATCH /role-requests/:id/approve` - Approve a request
- `PATCH /role-requests/:id/reject` - Reject a request

## Rollback (If Needed)

If you need to rollback the migration:

```bash
npx prisma migrate resolve --rolled-back add_rbac_system
```

Then restore from your database backup.

## Troubleshooting

### Error: "Module '@prisma/client' has no exported member 'UserRole'"

**Solution**: Run `npx prisma generate` to regenerate the Prisma client.

### Error: "Property 'accountStatus' does not exist on type 'User'"

**Solution**: The Prisma client needs to be regenerated. Run `npx prisma generate` and restart your IDE.

### Migration Fails

**Solution**: 
1. Check your database connection in `.env`
2. Ensure you have write permissions
3. For SQLite, ensure the database file exists and is writable
4. Check the migration logs in `prisma/migrations/`

## Notes

- The RBAC system uses three roles: `CUSTOMER`, `EMPLOYEE`, `ADMIN`
- Account statuses: `ACTIVE`, `PENDING_APPROVAL`, `SUSPENDED`, `REJECTED`
- Only super admins can approve `ADMIN` role requests
- Customers must become `EMPLOYEE` before requesting `ADMIN`
- All role changes are logged and require admin approval

## Next Steps

After successful migration:

1. Update your frontend to use the new auth types from `lib/types/auth.types.ts`
2. Implement role-based UI components
3. Add role checking to your frontend routes
4. Test all permission scenarios
5. Set up monitoring for role change requests
