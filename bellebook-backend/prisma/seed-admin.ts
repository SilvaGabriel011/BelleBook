import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin user...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create or update admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bellebook.com' },
    update: {},
    create: {
      email: 'admin@bellebook.com',
      password: hashedPassword,
      name: 'Admin User',
      displayName: 'Administrator',
      phone: '+55 11 99999-9999',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create or update admin profile
  await prisma.adminProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      permissions: JSON.stringify([
        'VIEW_USERS',
        'EDIT_USERS',
        'DELETE_USERS',
        'SUSPEND_USERS',
        'VIEW_EMPLOYEES',
        'APPROVE_EMPLOYEES',
        'EDIT_EMPLOYEES',
        'VIEW_ALL_BOOKINGS',
        'EDIT_BOOKINGS',
        'CANCEL_BOOKINGS',
        'MANAGE_SERVICES',
        'VIEW_ALL_CHATS',
        'VIEW_ANALYTICS',
        'EXPORT_REPORTS',
        'MANAGE_SETTINGS',
        'MANAGE_ADMINS',
      ]),
      department: 'TI',
      isSuperAdmin: true,
    },
  });

  console.log('✅ Admin profile created');
  console.log('\n📋 Login credentials:');
  console.log('   Email: admin@bellebook.com');
  console.log('   Password: admin123');
  console.log('\n⚠️  IMPORTANT: Change this password in production!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
