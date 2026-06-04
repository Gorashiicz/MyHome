import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

config();

const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: "demo@stavba.cz" },
});
console.log(
  "user:",
  user ? { id: user.id, email: user.email, hasHash: !!user.passwordHash } : null
);
if (user?.passwordHash) {
  console.log(
    "demo1234 valid:",
    await bcrypt.compare("demo1234", user.passwordHash)
  );
}
await prisma.$disconnect();
