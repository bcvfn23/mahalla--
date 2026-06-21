import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "yoshlar-qalqoni-super-secret-access-token-key-2026"
);

// Define roles and allowed paths to enforce RBAC
const rolePermissions: Record<string, string[]> = {
  admin: [
    "/dashboard", "/yoshlar", "/xarita", "/faollik", "/huquqbuzarliklar",
    "/patrul", "/rejalar", "/kalendar", "/statistika", "/murojaatlar",
    "/yordam", "/bandlik", "/tanlovlar", "/ai-tahlil", "/integratsiyalar", "/profil",
    "/kundalik"
  ],
  uchastkavoy: [
    "/dashboard", "/yoshlar", "/xarita", "/faollik", "/huquqbuzarliklar",
    "/patrul", "/ai-tahlil", "/profil", "/kundalik"
  ],
  raisi: [
    "/dashboard", "/yoshlar", "/rejalar", "/kalendar", "/statistika",
    "/murojaatlar", "/yordam", "/profil", "/kundalik"
  ],
  yetakchi: [
    "/dashboard", "/yoshlar", "/rejalar", "/kalendar", "/bandlik",
    "/tanlovlar", "/profil", "/kundalik"
  ]
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    // If access token is missing, redirect to login
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    const role = (payload.role as string) || "read_only";

    // Enforce role-based page constraints
    const allowedPaths = rolePermissions[role] || ["/dashboard", "/profil"];
    const isAllowed = allowedPaths.some(
      (allowed) => path === allowed || path.startsWith(allowed + "/")
    );

    if (!isAllowed) {
      // Access denied - redirect to home dashboard
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    // Access token is invalid or expired
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}

// Next.js config routing optimization
export const config = {
  matcher: [
    "/dashboard", "/dashboard/:path*",
    "/yoshlar", "/yoshlar/:path*",
    "/xarita", "/xarita/:path*",
    "/faollik", "/faollik/:path*",
    "/huquqbuzarliklar", "/huquqbuzarliklar/:path*",
    "/patrul", "/patrul/:path*",
    "/rejalar", "/rejalar/:path*",
    "/kalendar", "/kalendar/:path*",
    "/statistika", "/statistika/:path*",
    "/murojaatlar", "/murojaatlar/:path*",
    "/yordam", "/yordam/:path*",
    "/bandlik", "/bandlik/:path*",
    "/tanlovlar", "/tanlovlar/:path*",
    "/ai-tahlil", "/ai-tahlil/:path*",
    "/integratsiyalar", "/integratsiyalar/:path*",
    "/profil", "/profil/:path*",
    "/kundalik", "/kundalik/:path*"
  ]
};
