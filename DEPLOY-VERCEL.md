# Deploy demo to Vercel

This app uses **Next.js** and **Prisma + libSQL**. Vercel cannot store a local `dev.db` file, so production uses **[Turso](https://turso.tech)** (free hosted SQLite compatible with your existing adapter).

## 1. Push code to GitHub

If the project is not on GitHub yet:

```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## 2. Create a Turso database

1. Sign up at [turso.tech](https://turso.tech).
2. Install the CLI: [Turso CLI docs](https://docs.turso.tech/cli).
3. Log in and create a database:

```bash
turso auth login
turso db create master-pri-demo
turso db show master-pri-demo --url
turso db tokens create master-pri-demo
```

Save the **URL** (`libsql://...`) and **token**.

## 3. Apply schema and seed (from your PC)

In the project folder, set Turso env vars once (PowerShell):

```powershell
$env:DATABASE_URL="libsql://YOUR-DB-URL"
$env:TURSO_AUTH_TOKEN="YOUR-TOKEN"
npx prisma db push
npm run db:seed
```

Or copy values into a local `.env` and run:

```bash
npm run db:push
npm run db:seed
```

## 4. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. **Import** your GitHub repository.
3. Framework should auto-detect **Next.js** (no custom build command needed).
4. Under **Environment Variables**, add (required **before** the first deploy succeeds):

| Name | Value | Environments |
|------|--------|----------------|
| `DATABASE_URL` | `libsql://...` from Turso | Production, Preview, **Development** |
| `TURSO_AUTH_TOKEN` | token from Turso | Production, Preview, **Development** |
| `ADMIN_PASSWORD` | a strong password for `/admin/login` | Production, Preview, **Development** |

5. Click **Deploy**.

> **Build failed at `prisma generate`?** Redeploy after adding the variables above. The app uses Turso at runtime; `prisma` is in `dependencies` so Vercel can run `postinstall` correctly.

## 5. After deploy

| URL | Purpose |
|-----|---------|
| `https://your-app.vercel.app/` | Customer storefront |
| `https://your-app.vercel.app/admin/login` | Admin (use `ADMIN_PASSWORD`) |

## Troubleshooting

- **Build fails on Prisma** — ensure `postinstall` runs (`prisma generate` is in `package.json`).
- **Database errors in production** — confirm `DATABASE_URL` starts with `libsql://` and `TURSO_AUTH_TOKEN` is set on Vercel.
- **Admin login fails** — set `ADMIN_PASSWORD` on Vercel and redeploy.
- **Empty shop** — run `db:push` and `db:seed` against your Turso database (step 3).

## Optional: deploy from CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add ADMIN_PASSWORD
vercel --prod
```
