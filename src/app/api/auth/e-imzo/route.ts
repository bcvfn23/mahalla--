import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { computeDeviceFingerprint } from "@/lib/hash";
import { checkRateLimit } from "@/lib/rateLimit";
import crypto from "crypto";
import { logActivity } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { username, signature, challenge } = await req.json();

    if (!username || !signature) {
      return NextResponse.json({ error: "Username and digital signature are required" }, { status: 400 });
    }

    // Retrieve client IP address
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    // Rate Limiting Check
    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Find the user by username (simulating certificate mapping via STIR/TIN)
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      await logActivity(
        null,
        "failed_login_e_imzo",
        { message: `Failed E-IMZO login: User "${username}" not found`, username },
        ipAddress
      );
      return NextResponse.json({ error: "Certificate user not found in database" }, { status: 401 });
    }

    // Reset lockout counters on successful E-IMZO login
    await prisma.loginAttempt.upsert({
      where: { username_ipAddress: { username: user.username, ipAddress } },
      update: { attempts: 0, lockoutCount: 0, lockoutExpires: null },
      create: { username: user.username, ipAddress, attempts: 0, lockoutCount: 0, lockoutExpires: null }
    });

    // Generate JWT tokens
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      avatar: user.avatar || "US",
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Compute device fingerprint
    const deviceFingerprint = computeDeviceFingerprint(req);
    const userAgent = req.headers.get("user-agent") || "";
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // Save refresh token session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress,
        userAgent,
        deviceFingerprint,
      },
    });

    // Log the successful E-IMZO authentication
    await logActivity(
      user.id,
      "login_e_imzo",
      { 
        message: "User logged in successfully via E-IMZO digital signature", 
        ipAddress,
        userAgent,
        deviceFingerprint,
      },
      ipAddress
    );

    // Set HTTPOnly cookies
    const cookieStore = await cookies();
    
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
        avatar: user.avatar || "US",
      },
    });
  } catch (error: any) {
    console.error("E-IMZO API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
