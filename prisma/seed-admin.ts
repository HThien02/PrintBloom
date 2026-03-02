import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@printbloom.com" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash("admin123", 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@printbloom.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN" as any,
      provider: "email",
    },
  });

  console.log("Admin user created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
