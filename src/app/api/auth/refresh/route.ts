import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import crypto from "crypto";

import { computeDeviceFingerprint } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Find active session in DB by looking up the SHA-256 hash of the Refresh Token
    const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const activeSession = await prisma.session.findUnique({
      where: { refreshToken: hashed },
      include: { user: true }
    });


    if (!activeSession || activeSession.expiresAt < new Date()) {
      if (activeSession) {
        await prisma.session.delete({ where: { id: activeSession.id } });
      }
      return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
    }

    // Fingerprint Validation (UA + Lang + Platform)
    const currentFingerprint = computeDeviceFingerprint(req);
    if (activeSession.deviceFingerprint && activeSession.deviceFingerprint !== currentFingerprint) {
      // Security warning: Fingerprint mismatch! Revoke session
      await prisma.session.delete({ where: { id: activeSession.id } });
      
      const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: activeSession.user.id,
          action: "security_alert",
          details: { 
            message: "Session revoked due to device fingerprint mismatch (potential hijacking)",
            oldFingerprint: activeSession.deviceFingerprint,
            newFingerprint: currentFingerprint,
            ipAddress
          },
          ipAddress
        }
      });

      return NextResponse.json({ error: "Security alert: Device signature changed. Please login again." }, { status: 401 });
    }

    // IP Shift Logging (Log security warning if IP changed, but don't log out)
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (activeSession.ipAddress && activeSession.ipAddress !== ipAddress) {
      await prisma.auditLog.create({
        data: {
          userId: activeSession.user.id,
          action: "security_warning",
          details: { 
            message: "User IP shift detected during token refresh",
            oldIp: activeSession.ipAddress,
            newIp: ipAddress
          },
          ipAddress
        }
      });
      
      // Update session IP
      await prisma.session.update({
        where: { id: activeSession.id },
        data: { ipAddress }
      });
    }

    const newAccessToken = await signAccessToken({
      id: activeSession.user.id,
      username: activeSession.user.username,
      role: activeSession.user.role,
      name: activeSession.user.name,
      avatar: activeSession.user.avatar || "US",
    });

    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Refresh API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
