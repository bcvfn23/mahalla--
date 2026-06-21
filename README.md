# Yoshlar Qalqoni AI (Youth Shield AI) 🛡️

**Yoshlar Qalqoni** is an enterprise-grade digital platform designed for youth social work, incident tracking, and AI-driven analytics in local communities (Mahallas) of Uzbekistan. It helps inspectors, community leaders (Rais), and youth work assistants coordinate efforts, prevent juvenile offenses, and manage public appeals.

This is a full-stack Next.js 16 (Turbopack) application integrated with PostgreSQL (Neon) and Prisma ORM, featuring robust security systems, audit logging, and automated rate limiting.

---

## Key Features

- **📊 Comprehensive Dashboard:** Real-time metrics on youth employment, offenses, active appeals, and community statistics.
- **🛡️ Enterprise Hardening (Phase 2.1):**
  - **Secure Session Management:** HTTPOnly cookies with bcrypt-hashed refresh tokens stored in the database.
  - **IP-Independent Device Fingerprinting:** Prevents session hijacking by analyzing User-Agent, Accept-Language, and Platform headers.
  - **Rate Limiting:** Built-in Token Bucket rate limiting helper to prevent brute-force attacks.
  - **Brute-Force Lockouts:** Automatic IP lockout and exponential account lockouts for failed login attempts.
  - **Soft Deletion:** Safe data removal pattern for profiles, incidents, and appeals.
- **📝 Structured Audit Logs:** Automated logging of critical actions (logins, creates, edits, soft-deletes) with JSON metadata.
- **🏥 Dual-Tiered Health Monitoring:**
  - Public `/api/health` for uptime monitoring.
  - Internal `/api/admin/health` for DB checks, memory metrics, and Sentry configurations.
- **🤖 AI Analytics:** Integrated assistant helper in chat to categorize and analyze youth issues without leaking raw sensitive prompts to audit logs.

---

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router + Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma Client
- **Authentication:** JWT (jose) + bcryptjs
- **Styling:** Tailwind CSS + PostCSS
- **Animations:** Framer Motion
- **Icons & Maps:** Lucide React, React Leaflet (Leaflet maps)
- **Monitoring:** Sentry Next.js SDK

---

## Project Structure

```text
frontend/
├── prisma/
│   ├── schema.prisma       # Prisma DB schema definitions
│   └── seed.js            # Seed script for initial data
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── (auth)/        # Authentication pages
│   │   ├── (dashboard)/   # Core dashboard views (analytics, audit, profiles)
│   │   └── api/           # Serverless API endpoints
│   ├── components/         # Reusable UI component library (sidebar, charts)
│   ├── lib/               # Utility functions, rate limiting, db clients, JWT helpers
│   └── proxy.ts            # Proxy / routing middleware handler
```

---

## Quick Start

### 1. Clone the repository and install dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` root:
```env
DATABASE_URL="postgresql://neondb_owner:npg_...aws.neon.tech/neondb?sslmode=require"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
```

### 3. Sync Database and Seed Initial Data
Run the custom Prisma push & seed script:
```bash
npm run db:push
```
This runs `prisma db push` to synchronize schemas and then executes `prisma/seed.js` to populate mahallas, regions, and default users:
* **Admin:** `admin` / `123`
* **Mahalla Raisi:** `rais` / `123`
* **Uchastkavoy:** `uchastkavoy` / `123`
* **Yetakchi:** `yetakchi` / `123`

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Deployment

This app is configured for production deployment on **Vercel** with **Neon PostgreSQL**.
- The Next.js build script is decoupled from migrations to ensure safe build times:
  `"build": "prisma generate && next build"`
- Set the `DATABASE_URL` in Vercel settings and trigger a redeploy to apply.
