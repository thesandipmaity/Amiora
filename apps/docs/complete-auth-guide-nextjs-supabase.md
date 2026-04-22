# Complete Authentication Guide — Next.js + Supabase (App Router)

> Covers: Email/Password Signup & Login + Google OAuth + Password Hashing + Profile Storage

---

## Tech Stack

- **Next.js** (App Router)
- **Supabase** (Auth + PostgreSQL)
- **@supabase/ssr** (Session management via cookies)

---

## Folder Structure

```
├── actions/
│   └── auth.ts                  # All server actions (signup, login, logout, google)
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts         # Google OAuth callback
│   │   └── confirm/
│   │       └── route.ts         # Email confirmation callback
│   ├── dashboard/
│   │   └── page.tsx             # Protected page
│   └── login/
│       └── page.tsx             # Auth page (login + signup)
├── utils/
│   └── supabase/
│       ├── client.ts            # Browser client
│       └── server.ts            # Server client
├── middleware.ts                # Route protection
└── .env.local                   # Environment variables
```

---

## Step 1: Install Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Step 2: Environment Variables

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SITE_URL=http://localhost:3000
```

---

## Step 3: Supabase Client Setup

### `utils/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClientForServer() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) =>
          c.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )
}
```

### `utils/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClientForBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Step 4: Database Setup (Supabase SQL Editor)

### 4.1 — Profiles Table

```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  provider text default 'email',   -- 'email' ya 'google'
  created_at timestamp with time zone default now()
);

-- RLS enable karo
alter table public.profiles enable row level security;

-- Policies
create policy "User can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "User can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "User can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
```

### 4.2 — Auto-Trigger (Signup pe profile auto-create)

> Jab bhi koi user signup kare (email ya Google), yeh trigger automatically
> `profiles` table mein ek row insert kar deta hai.

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)  -- fallback: email ka pehla part
    ),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

> **Password Hashing Note:** Supabase internally **bcrypt** algorithm se
> password hash karta hai — tujhe manually kuch nahi karna. Plain text
> password kabhi store nahi hota `auth.users` mein.

---

## Step 5: All Server Actions

`actions/auth.ts`:

```ts
'use server'
import { createClientForServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ─────────────────────────────────────────
// SIGNUP WITH EMAIL & PASSWORD
// ─────────────────────────────────────────
export async function signupWithEmail(formData: FormData) {
  const supabase = await createClientForServer()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,           // Supabase internally bcrypt se hash karke save karta hai
    options: {
      data: {
        full_name,      // Trigger ke through profiles table mein jaayega
      },
    },
  })

  if (error) return { error: error.message }
  return { success: 'Check your email to confirm your account!' }
}

// ─────────────────────────────────────────
// LOGIN WITH EMAIL & PASSWORD
// ─────────────────────────────────────────
export async function loginWithEmail(formData: FormData) {
  const supabase = await createClientForServer()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,   // Supabase hashed password se compare karta hai automatically
  })

  if (error) return { error: 'Invalid email or password' }

  redirect('/dashboard')
}

// ─────────────────────────────────────────
// SIGNUP / LOGIN WITH GOOGLE
// ─────────────────────────────────────────
export async function signInWithGoogle() {
  const supabase = await createClientForServer()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google OAuth Error:', error.message)
    redirect('/login?error=oauth_failed')
  }

  redirect(data.url!)  // User ko Google login page pe bhejo
}

// ─────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────
export async function signOut() {
  const supabase = await createClientForServer()
  await supabase.auth.signOut()
  redirect('/login')
}
```

---

## Step 6: Email Confirmation Callback

`app/auth/confirm/route.ts`:

```ts
import { createClientForServer } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as any

  if (token_hash && type) {
    const supabase = await createClientForServer()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=confirmation_failed', origin))
}
```

> **Supabase Dashboard → Authentication → Email Templates →**
> "Confirm signup" template mein URL change karo:
>
> ```
> {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
> ```

---

## Step 7: Google OAuth Callback

`app/auth/callback/route.ts`:

```ts
import { createClientForServer } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClientForServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=callback_failed', origin))
}
```

---

## Step 8: Login / Signup Page

`app/login/page.tsx`:

```tsx
'use client'
import { loginWithEmail, signupWithEmail, signInWithGoogle } from '@/actions/auth'
import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const result = isLogin
      ? await loginWithEmail(formData)
      : await signupWithEmail(formData)

    setLoading(false)
    if (result?.error) setMessage(result.error)
    if (result?.success) setMessage(result.success)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 border rounded-xl shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? 'Login' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              name="full_name"
              placeholder="Full Name"
              required
              className="border p-2 rounded"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border p-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            minLength={6}
            required
            className="border p-2 rounded"
          />

          {message && (
            <p className={`text-sm ${message.includes('Check') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-1" />
        </div>

        {/* Google Button */}
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border p-2 rounded hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setMessage('') }}
          className="text-sm text-blue-500 text-center"
        >
          {isLogin ? "Account nahi hai? Sign Up karo" : "Already account hai? Login karo"}
        </button>
      </div>
    </div>
  )
}
```

---

## Step 9: Middleware (Route Protection)

`middleware.ts` (root pe):

```ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (c) =>
          c.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  )

  // Always use getUser() — not getSession() on server
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in → redirect to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth).*)'],
}
```

---

## Step 10: Dashboard — User Profile Fetch

`app/dashboard/page.tsx`:

```tsx
import { createClientForServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h1 className="text-xl font-bold">Welcome, {profile?.full_name}! 👋</h1>
          <p className="text-gray-500">{profile?.email}</p>
          <p className="text-xs text-gray-400">Logged in via: {profile?.provider}</p>
        </div>
      </div>

      <form action={signOut}>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  )
}
```

---

## Step 11: Google Cloud Console Setup

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → OAuth Consent Screen**
   - User Type: External
   - Add your Supabase domain in Authorized domains
3. **Credentials → Create OAuth 2.0 Client ID**
   - Type: Web application
   - Authorized redirect URI:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
4. Copy **Client ID** + **Client Secret**
5. Supabase Dashboard → **Authentication → Sign In / Providers → Google**
   - Paste Client ID and Client Secret → Save

---

## Password Hashing — How it Works

```
User enters password (plain text)
        ↓
Supabase Auth receives it over HTTPS
        ↓
bcrypt algorithm se hash generate hota hai
        ↓
Sirf hash auth.users table mein store hota hai
        ↓
Login pe: entered password ko hash karke stored hash se compare kiya jaata hai
        ↓
Match → Session create, Cookie set
```

> ✅ Tu khud kuch nahi karta — Supabase sab handle karta hai.
> ❌ Kabhi bhi plain text password store mat karo apne database mein.

---

## Complete Flow Diagram

```
──────────────── EMAIL SIGNUP ────────────────
Form Submit (name, email, password)
      ↓
supabase.auth.signUp() → password bcrypt hash hua → auth.users mein save
      ↓
Trigger fire → profiles table mein row auto-insert
      ↓
Confirmation email gaya → user link click kare
      ↓
/auth/confirm route → verifyOtp() → session set
      ↓
Redirect → /dashboard

──────────────── EMAIL LOGIN ────────────────
Form Submit (email, password)
      ↓
supabase.auth.signInWithPassword() → hash compare
      ↓
Match → access_token + refresh_token cookie mein save
      ↓
Middleware har request pe session verify karta hai
      ↓
/dashboard accessible

──────────────── GOOGLE SIGNUP/LOGIN ────────────────
Google button click
      ↓
signInWithOAuth() → user ko Google page pe redirect
      ↓
Google login → /auth/callback?code=xxx
      ↓
exchangeCodeForSession(code) → session set
      ↓
Agar naya user hai → Trigger fire → profiles table mein row insert
      ↓
Redirect → /dashboard
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Email not confirmed` | User ne email confirm nahi kiya | Confirmation email resend karo ya Supabase Dashboard se manually confirm karo |
| `Invalid login credentials` | Wrong email/password | Error message dikhao user ko |
| `redirect_uri_mismatch` | Google Console mein wrong callback URL | Supabase ka exact callback URL add karo |
| `User null on server` | `getSession()` use kiya | Always `getUser()` use karo |
| `Profiles row not created` | Trigger nahi laga | SQL Editor mein trigger dobara run karo |
| `Session lost after refresh` | Middleware nahi hai | `middleware.ts` root pe add karo |
| `SMTP rate limit` | Default Supabase email service | Custom SMTP setup karo (Resend recommended) |

---

## Supabase Dashboard Checklist

- [ ] **Authentication → Sign In / Providers → Email** → Enabled
- [ ] **Authentication → Sign In / Providers → Google** → Client ID + Secret added
- [ ] **Authentication → Email Templates → Confirm signup** → token_hash URL updated
- [ ] **Authentication → URL Configuration → Site URL** → correct domain set
- [ ] **Authentication → URL Configuration → Redirect URLs** → localhost + production URL added
- [ ] **SQL Editor** → profiles table + trigger created
- [ ] **Authentication → SMTP Settings** → Custom SMTP configured (for production)
