import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  await prisma.activityLog.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.setting.deleteMany({});

  console.log('Seeding database...');

  // Seed default API settings
  await prisma.setting.create({
    data: {
      key: 'EXTERNAL_API_URL',
      value: 'https://jsonplaceholder.typicode.com/users'
    }
  });

  await prisma.setting.create({
    data: {
      key: 'EXTERNAL_API_HEADERS',
      value: '{}'
    }
  });

  // Seed ONLY the default Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Kamalpreet Singh',
      email: 'kamalpreet@example.com',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamalpreet',
      passwordHash: '$2b$10$z4otCWYdbxukfFGZELtc.u1wDy6aq4BBuGq25IkuW0wQJhWPAr4GS' // Hashed 'password'
    }
  });

  console.log(`Successfully seeded Admin User: ${adminUser.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Database seeding process completed successfully!');
  })
  .catch(async (e) => {
    console.error('Seeding encountered an error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
