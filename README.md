# Glowrora

Testimonial collector and Wall of Love — Next.js (App Router), Clerk, Neon, Drizzle, Cloudflare R2 (media in later sprints).

## Local setup

1. Copy [`.env.example`](.env.example) to `.env.local` and fill **Neon** `DATABASE_URL`, **Clerk** keys, and `CLERK_WEBHOOK_SIGNING_SECRET`.
2. Apply the database schema:

   ```bash
   npm run db:push
   ```

   Or run SQL from [`drizzle/`](drizzle/) against your Neon branch.

3. In the [Clerk Dashboard](https://dashboard.clerk.com), add a webhook endpoint:  
   `https://<your-host>/api/webhooks/clerk`  
   Subscribe to `user.created`, `user.updated`, `user.deleted`.

4. Start the app:

   ```bash
   npm run dev
   ```

## Scripts

| Script            | Purpose                |
| ----------------- | ---------------------- |
| `npm run dev`     | Next.js development    |
| `npm run embed:build` | Build `public/embed/trustify-embed.js` (Vite IIFE widget) |
| `npm run test`    | Vitest — pure helpers (public JSON, R2 URL, Zod public submit) |
| `npm run build`   | Runs `embed:build`, then Next.js production build |
| `npm run db:push` | Push Drizzle schema    |
| `npm run db:generate` | Generate SQL migrations |
| `npm run db:studio`   | Drizzle Studio         |

Product docs live in [`docs/`](docs/).
