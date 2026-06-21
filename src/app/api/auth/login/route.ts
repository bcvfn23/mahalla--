import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { computeDeviceFingerprint } from "@/lib/hash";
import { checkRateLimit } from "@/lib/rateLimit";
import crypto from "crypto";
import { logActivity } from "@/lib/audit";



export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Retrieve client IP address
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    // Rate Limiting Check
    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 1. Check IP-only Lockout
    const ipLock = await prisma.ipLockout.findUnique({
      where: { ipAddress }
    });

    if (ipLock && ipLock.lockoutExpires && ipLock.lockoutExpires > new Date()) {
      const minutesRemaining = Math.ceil((ipLock.lockoutExpires.getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json({
        error: "Too many login attempts from this IP. Temporary IP lockout active.",
        message: `Too many login attempts from this IP. Lockout active for ${minutesRemaining} minutes.`
      }, { status: 423 });
    }

    // 2. Check Username + IP combo lockout
    const attempt = await prisma.loginAttempt.findUnique({
      where: {
        username_ipAddress: { username, ipAddress }
      }
    });

    if (attempt && attempt.lockoutExpires && attempt.lockoutExpires > new Date()) {
      const minutesRemaining = Math.ceil((attempt.lockoutExpires.getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json({ 
        error: "Too many login attempts. Account temporarily locked.",
        message: `Too many login attempts. Lockout active for ${minutesRemaining} minutes. Please try again later.`
      }, { status: 423 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      await logActivity(
        null,
        "failed_login_invalid_user",
        { message: `Failed login attempt: Username "${username}" does not exist`, username },
        ipAddress
      );
      await recordFailedAttempt(username, ipAddress, attempt);
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }


    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      await logActivity(
        user.id,
        "failed_login_incorrect_password",
        { message: `Failed login attempt: Incorrect password for username "${username}"`, username },
        ipAddress
      );
      await recordFailedAttempt(username, ipAddress, attempt);
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }


    // Success! Reset attempts counter for username+IP and IP-only
    await prisma.loginAttempt.upsert({
      where: { username_ipAddress: { username, ipAddress } },
      update: { attempts: 0, lockoutCount: 0, lockoutExpires: null },
      create: { username, ipAddress, attempts: 0, lockoutCount: 0, lockoutExpires: null }
    });

    if (ipLock) {
      await prisma.ipLockout.update({
        where: { ipAddress },
        data: { attempts: 0, lockoutExpires: null }
      });
    }

    // Generate tokens
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      avatar: user.avatar || "US",
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Compute Device Fingerprint (User-Agent + Accept-Language + Platform)
    const deviceFingerprint = computeDeviceFingerprint(req);
    const userAgent = req.headers.get("user-agent") || "";

    // Hash the Refresh Token with SHA-256 before saving to the database to ensure fast lookups
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

    // Create JSON-structured Audit Log
    await logActivity(
      user.id,
      "login",
      { 
        message: "User logged in successfully via web client", 
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
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Helper function to track and increment lockout attempts (IP and Combo)
async function recordFailedAttempt(username: string, ipAddress: string, attempt: any) {
  // 1. IP-only lockout check & increment
  const ipLock = await prisma.ipLockout.findUnique({ where: { ipAddress } });
  const currentIpAttempts = (ipLock?.attempts || 0) + 1;
  
  if (currentIpAttempts >= 20) {
    await logActivity(
      null,
      "lockout_ip_triggered",
      { message: `IP Lockout triggered for IP ${ipAddress} after 20 failed attempts` },
      ipAddress
    );
    await prisma.ipLockout.upsert({
      where: { ipAddress },
      update: { attempts: 0, lockoutExpires: new Date(Date.now() + 60 * 60 * 1000) }, // 1 hour lockout
      create: { ipAddress, attempts: 0, lockoutExpires: new Date(Date.now() + 60 * 60 * 1000) }
    });
  } else {

    await prisma.ipLockout.upsert({
      where: { ipAddress },
      update: { attempts: currentIpAttempts },
      create: { ipAddress, attempts: currentIpAttempts }
    });
  }

  // 2. Username + IP combo lockout check & increment (Exponential)
  let currentAttempts = (attempt?.attempts || 0) + 1;
  let lockoutCount = attempt?.lockoutCount || 0;
  let lockoutExpires: Date | null = null;

  if (currentAttempts >= 5) {
    lockoutCount += 1;
    currentAttempts = 0; // reset counter for next lockout cycle
    
    // Exponential backoff durations: 15m, 30m, 1h, 6h, 12h
    let durationMinutes = 15;
    if (lockoutCount === 2) durationMinutes = 30;
    else if (lockoutCount === 3) durationMinutes = 60;
    else if (lockoutCount === 4) durationMinutes = 360; // 6 hours
    else if (lockoutCount >= 5) durationMinutes = 720;  // 12 hours
    
    lockoutExpires = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Fetch user if exists to link user ID to audit log
    const usr = await prisma.user.findUnique({ where: { username } });
    await logActivity(
      usr?.id || null,
      "lockout_user_triggered",
      {
        message: `Account lockout triggered for username "${username}" on IP ${ipAddress} for ${durationMinutes} minutes`,
        username,
        durationMinutes
      },
      ipAddress
    );
  }


  await prisma.loginAttempt.upsert({
    where: {
      username_ipAddress: { username, ipAddress }
    },
    update: {
      attempts: currentAttempts,
      lockoutCount,
      lockoutExpires
    },
    create: {
      username,
      ipAddress,
      attempts: currentAttempts,
      lockoutCount,
      lockoutExpires
    }
  });
}
