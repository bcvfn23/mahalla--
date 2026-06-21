import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/jwt";
import crypto from "crypto";


export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload && payload.id) {
        if (all) {
          // Revoke all sessions for this user
          await prisma.session.deleteMany({
            where: { userId: payload.id },
          });
        } else {
          // Find matching session using fast SHA-256 hash and delete it
          const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
          await prisma.session.deleteMany({
            where: { refreshToken: hashed }
          });

        }
      }
    }

    // Clear the cookies by setting expiration in the past
    cookieStore.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    cookieStore.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
