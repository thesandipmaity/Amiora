You are an expert Next.js + Supabase developer. I need you to implement complete authentication in my existing Next.js (App Router) project using Supabase.

## What to implement:
1. Email + Password Signup (with name)
2. Email + Password Login
3. Google OAuth Signup & Login
4. Email confirmation callback route
5. Google OAuth callback route
6. Middleware for route protection
7. Sign out functionality

## Rules to follow strictly:

### Password Handling
- NEVER store plain text passwords
- Use `supabase.auth.signUp()` for signup — Supabase handles bcrypt hashing internally
- Use `supabase.auth.signInWithPassword()` for login — Supabase compares hash automatically

### Session Management
- Use `@supabase/ssr` package for cookie-based session
- ALWAYS use `supabase.auth.getUser()` on server — NEVER use `getSession()` on server side
- Session is automatically persisted via cookies — no manual token handling needed

### Supabase Client
- Server components, server actions, middleware → use server client (via `cookies()` from `next/headers`)
- Client components → use browser client (`createBrowserClient`)
- Do NOT create new client instances inside components — import from utils

### Server Actions
- All auth functions (signup, login, google, signout) must be Server Actions with `'use server'` directive
- Return `{ error: string }` on failure
- Use `redirect()` from `next/navigation` on success

### Routing
- After email signup → return `{ success: 'Check your email!' }` (don't redirect, email confirmation pending)
- After email login → redirect to `/dashboard`
- After Google login → redirect handled via `/auth/callback` route
- After signout → redirect to `/login`

### Email Confirmation
- Create `app/auth/confirm/route.ts` using `verifyOtp({ token_hash, type })`
- Do NOT use `{{ .ConfirmationURL }}` in Supabase email template
- Use this URL in Supabase email template:
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

### Google OAuth Callback
- Create `app/auth/callback/route.ts` using `exchangeCodeForSession(code)`
- redirectTo option must be: `${process.env.SITE_URL}/auth/callback`

### Middleware
- Create `middleware.ts` at project root
- Refresh session on every request
- Protect `/dashboard` route — redirect to `/login` if not authenticated
- If already authenticated and visiting `/login` → redirect to `/dashboard`
- matcher must exclude: `_next/static`, `_next/image`, `favicon.ico`, `auth`

### Database
- Create a `profiles` table in Supabase with fields: `id`, `email`, `full_name`, `avatar_url`, `provider`, `created_at`
- Add a PostgreSQL trigger `on_auth_user_created` that auto-inserts into `profiles` when a new user signs up
- Enable RLS on profiles table with policies for select, insert, update (auth.uid() = id)

### Environment Variables (already in .env.local)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SITE_URL
```

## Do NOT:
- Do NOT change or restructure any existing folders/files unrelated to auth
- Do NOT install extra packages beyond `@supabase/supabase-js` and `@supabase/ssr`
- Do NOT use `next-auth` or any other auth library
- Do NOT use `useEffect` for session checking — use middleware instead
- Do NOT hardcode any URLs — use `process.env.SITE_URL`
- Do NOT use `getSession()` anywhere on the server

## Files to create (place them wherever fits best in existing project structure):
- Supabase server client utility
- Supabase browser client utility
- Server actions file for all auth functions
- `app/auth/confirm/route.ts`
- `app/auth/callback/route.ts`
- Login/Signup page with both email form and Google button
- Dashboard page showing user profile data
- `middleware.ts` at root

## SQL to run in Supabase SQL Editor (provide this separately as a code block):
- profiles table creation
- RLS policies
- trigger function + trigger

After implementing, tell me:
1. Which files were created/modified
2. What to configure in Supabase Dashboard
3. What to configure in Google Cloud Console
