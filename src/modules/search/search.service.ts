import { prisma } from "@/lib/db";

export class SearchService {
  static async searchYouth(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return await prisma.youthProfile.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ism: { contains: q, mode: "insensitive" } },
          { familiya: { contains: q, mode: "insensitive" } },
          { jshshir: { contains: q } },
          { pasport: { contains: q } },
        ],
      },
      include: { mahalla: true },
    });
  }
}
