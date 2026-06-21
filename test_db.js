const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log("Initializing Prisma Client...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./prisma/dev.db"
      }
    }
  });

  try {
    console.log("Attempting query...");
    await prisma.user.findFirst();
    console.log("Query completed successfully.");
  } catch (err) {
    console.error("Query failed with error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
