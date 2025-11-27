const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE(MAX(id), 1)) FROM "User";
  `);
  console.log('User ID sequence has been reset to correct value');

  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"Role"', 'id'), COALESCE(MAX(id), 1)) FROM "Role";
  `);
  console.log('Role ID sequence has been reset to correct value');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
