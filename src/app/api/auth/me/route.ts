import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import crypto from "crypto";


export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload) {
        return NextResponse.json({
          success: true,
          user: {
            username: payload.username,
            role: payload.role,
            name: payload.name,
            avatar: payload.avatar || "US",
          },
        });
      }
    }

    // Access token missing or invalid. Try refreshing with refresh token.
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (!refreshPayload || !refreshPayload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find session in DB by looking up the SHA-256 hash of the Refresh Token
    const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await prisma.session.findUnique({
      where: { refreshToken: hashed },
      include: { user: true },
    });


    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Refresh valid! Generate new access token
    const newPayload = {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
      name: session.user.name,
      avatar: session.user.avatar || "US",
    };

    const newAccessToken = await signAccessToken(newPayload);

    // Set new access token cookie
    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    return NextResponse.json({
      success: true,
      user: {
        username: session.user.username,
        role: session.user.role,
        name: session.user.name,
        avatar: session.user.avatar || "US",
      },
    });
  } catch (error: any) {
    console.error("Auth me API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
