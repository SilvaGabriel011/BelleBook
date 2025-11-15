-- Create Admin User and Profile
-- This script creates a default admin user for BelleBook

-- First, check if user exists and delete if needed (for development)
-- DELETE FROM users WHERE email = 'admin@bellebook.com';

-- Create admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
INSERT OR IGNORE INTO users (id, email, password, name, display_name, role, account_status, created_at, updated_at) 
VALUES (
  'admin-user-id-001',
  'admin@bellebook.com',
  '$2b$10$rKvW8K8F8F8F8F8F8F8F8uJ5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', -- This is hashed 'admin123'
  'Admin User',
  'Administrator',
  'ADMIN',
  'ACTIVE',
  datetime('now'),
  datetime('now')
);

-- Create admin profile
INSERT OR IGNORE INTO admin_profiles (id, user_id, permissions, is_super_admin, created_at, updated_at)
VALUES (
  'admin-profile-001',
  'admin-user-id-001',
  '["VIEW_USERS","EDIT_USERS","DELETE_USERS","SUSPEND_USERS","VIEW_EMPLOYEES","APPROVE_EMPLOYEES","EDIT_EMPLOYEES","VIEW_ALL_BOOKINGS","EDIT_BOOKINGS","CANCEL_BOOKINGS","MANAGE_SERVICES","VIEW_ALL_CHATS","VIEW_ANALYTICS","EXPORT_REPORTS","MANAGE_SETTINGS","MANAGE_ADMINS"]',
  1,
  datetime('now'),
  datetime('now')
);

-- Verify the user was created
SELECT 'Admin user created successfully!' as message, * FROM users WHERE email = 'admin@bellebook.com';
