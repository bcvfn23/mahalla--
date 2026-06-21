# Production Deployment Guide 🚀

This document provides step-by-step instructions for deploying and configuring **Yoshlar Qalqoni AI** in a production environment.

---

## 1. Hosting Architecture

The recommended production stack for this project is:
- **Frontend & Serverless APIs:** [Vercel](https://vercel.com)
- **Database:** [Neon PostgreSQL](https://neon.tech) (Serverless PostgreSQL)
- **Error Monitoring:** [Sentry](https://sentry.io)

---

## 2. Environment Variables

Configure these variables in your Vercel Dashboard (Settings -> Environment Variables) or production `.env` file:

| Key | Required | Description | Example / Default |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string with SSL mode. | `postgresql://neondb_owner:...aws.neon.tech/neondb?sslmode=require` |
| `JWT_ACCESS_SECRET` | **Yes** | Secret key used to sign Access Tokens. | (Long random secure string) |
| `JWT_REFRESH_SECRET` | **Yes** | Secret key used to sign Refresh Tokens. | (Long random secure string) |
| `SENTRY_DSN` | No | Sentry endpoint for server/client error reporting. | `https://example-dsn.sentry.io/...` |
| `NODE_ENV` | Automatically set | Execution context (Vercel automatically sets this to `production`). | `production` |

---

## 3. Database Initialization & Seeding

Before triggering a build, make sure to push the schema changes to PostgreSQL.

### Initialize Schema
From your local environment connected to the production `DATABASE_URL`, execute:
```bash
npx prisma db push
```

### Seed Initial Accounts
To seed the database with required geography tables, initial youth profiles, and the default accounts, run:
```bash
node prisma/seed.js
```

> [!WARNING]
> Running the seed script deletes all existing `Attendance`, `YouthProfile`, `Mahalla`, `District`, and `Region` entries to maintain a clean database state. Do **not** run the seed script on an active production database containing live data.

---

## 4. Vercel Configuration & Deployment

### Build Command Settings
Decouple migrations from the build command to prevent deployment failures. On Vercel:
- **Build Command:** `prisma generate && next build`
- **Install Command:** `npm install`
- **Output Directory:** `.next`

### Proxy Middleware Convention
Ensure your routing proxy is defined in `src/proxy.ts` and not the deprecated `src/middleware.ts` to avoid Next.js configuration warnings.

---

## 5. Maintenance & Verification

Once deployed, run the following verification checks:
1. Verify the public health endpoint is returning a healthy response:
   `https://<your-domain>/api/health`
2. Log in using the admin account and check the system diagnostic details page:
   `https://<your-domain>/api/admin/health`
3. Inspect system logs inside Vercel Dashboard to ensure no runtime errors are occurring.
