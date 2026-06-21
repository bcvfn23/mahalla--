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

// Define public paths that are allowed without authentication
const publicPaths = ["/", "/login", "/terms", "/privacy", "/guide", "/api-docs"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Allow public pages
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // 2. Allow public API paths (like healthcheck)
  if (path === "/api/health") {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    // If access token is missing, redirect or return unauthorized
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    const role = (payload.role as string) || "read_only";

    // For protected API endpoints, verify the token is valid and allow it through
    if (path.startsWith("/api/")) {
      return NextResponse.next();
    }

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
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}

// Next.js config routing optimization
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (auth routes are handled separately or excluded)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, icon.png, next.svg, vercel.svg (public assets)
     * - all other files with extensions (e.g. svg, png, jpg, css, js)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png|icon.png|next.svg|vercel.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};

