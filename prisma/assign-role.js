const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2] || 'testuser';
  const roleName = process.argv[3] || 'administrator';

  console.log(`Assigning role "${roleName}" to user "${username}"...`);

  const user = await prisma.user.findUnique({
    where: { username },
    include: { roles: true },
  });

  if (!user) {
    console.error(`User "${username}" not found!`);
    process.exit(1);
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });

  if (!role) {
    console.error(`Role "${roleName}" not found!`);
    process.exit(1);
  }

  const hasRole = user.roles.some((r) => r.id === role.id);

  if (hasRole) {
    console.log(`User "${username}" already has role "${roleName}"`);
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { roles: { connect: { id: role.id } } },
    });
    console.log(
      `✓ Successfully assigned role "${roleName}" to user "${username}"`,
    );
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: true },
  });

  console.log(
    `\nUser "${username}" now has roles:`,
    updatedUser.roles.map((r) => r.name).join(', '),
  );
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
