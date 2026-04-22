# Cursor Prompt — Amiora User Authentication System

Copy everything below and paste into Cursor:

---

I am building an e-commerce website for AMIORA Diamonds.
Stack: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + MongoDB (Mongoose).

I need to implement a complete User Authentication system with TWO methods:
1. Google OAuth (via NextAuth.js)
2. Email + Password (via NextAuth.js CredentialsProvider + bcrypt)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 1 — INSTALL DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run:
npm install next-auth@beta @auth/mongodb-adapter mongoose bcryptjs
npm install --save-dev @types/bcryptjs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 2 — TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create types/auth.ts:

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string | null;        // null for Google OAuth users
  image: string | null;
  provider: "google" | "credentials";
  emailVerified: Date | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Extend NextAuth session to include role and id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      role: "user" | "admin";
    };
  }
  interface User {
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 3 — MONGODB CONNECTION + USER MODEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/db.ts:
- Singleton MongoDB connection using mongoose
- Reuse connection across hot reloads in dev
- Export connect() function

Create models/User.ts:
Mongoose schema with:
- name: String, required
- email: String, required, unique, lowercase
- password: String, default: null        (null for Google users)
- image: String, default: null
- provider: String, enum: ["google", "credentials"], default: "credentials"
- emailVerified: Date, default: null
- role: String, enum: ["user", "admin"], default: "user"
- timestamps: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 4 — NEXTAUTH CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create lib/auth.ts:

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connect } from "./db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [

    // --- GOOGLE OAUTH ---
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // --- EMAIL + PASSWORD ---
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("No account found. Please sign up first.");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign in — create user if not exists
      if (account?.provider === "google") {
        await connect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            emailVerified: new Date(),
            role: "user",
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
      }
      // If role not in token yet (Google user), fetch from DB
      if (!token.role) {
        await connect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

Create app/api/auth/[...nextauth]/route.ts:
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 5 — SIGNUP API ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create app/api/auth/signup/route.ts:
- POST handler
- Validate: name, email, password (min 8 chars)
- Check if email already exists in DB
  - If exists and provider is "google" → return error: "This email is linked to Google. Please sign in with Google."
  - If exists and provider is "credentials" → return error: "Email already registered."
- Hash password with bcrypt (saltRounds: 12)
- Create user in MongoDB with provider: "credentials"
- Return success: { message: "Account created successfully" }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 6 — UI COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### components/auth/GoogleButton.tsx
"use client" component:
- Button with Google "G" logo SVG (colored: #4285F4, #34A853, #FBBC05, #EA4335)
- Text: "Continue with Google"
- onClick: calls signIn("google", { callbackUrl: "/" })
- Loading state while redirecting
- Full width, white background, border, hover shadow
- Tailwind styled

### components/auth/LoginForm.tsx
"use client" component with react-hook-form or controlled state:
Fields:
- Email (type="email", required)
- Password (type="password", show/hide toggle, required)
- "Forgot password?" link (right aligned, disabled for now)
- Submit button: "Sign In"
- Error message display (red, below form)
- Loading spinner on submit

Logic:
- On submit: call signIn("credentials", { email, password, redirect: false })
- If error → show error message
- If success → router.push("/") or callbackUrl

### components/auth/SignupForm.tsx
"use client" component:
Fields:
- Full Name (required)
- Email (type="email", required)
- Password (type="password", min 8 chars, show/hide toggle)
- Confirm Password (must match)
- Submit button: "Create Account"
- Error / success message display

Logic:
- Client-side validation first
- On submit: POST to /api/auth/signup
- If success → auto signIn with credentials → redirect to "/"
- If error → show error message

### components/auth/AuthCard.tsx
Wrapper component:
- Centered card with white background, rounded-2xl, shadow
- AMIORA logo at top
- Title prop (e.g., "Welcome Back" or "Create Account")
- Subtitle prop
- Google button
- Divider: "─── or ───"
- children (the form)
- Bottom link: "Don't have an account? Sign up" / "Already have an account? Sign in"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 7 — AUTH PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### app/auth/login/page.tsx
- Full page centered layout
- Background: light gray
- Render AuthCard with title="Welcome Back", subtitle="Sign in to your account"
- Inside: GoogleButton + divider + LoginForm
- Bottom: "New to AMIORA? Create account" → /auth/signup

### app/auth/signup/page.tsx
- Same layout
- AuthCard title="Create Account", subtitle="Join AMIORA Diamonds"
- Inside: GoogleButton + divider + SignupForm
- Bottom: "Already have an account? Sign in" → /auth/login

### app/auth/error/page.tsx
- Show error from searchParams
- Map error codes to friendly messages:
  - OAuthSignin / OAuthCallback → "Google sign-in failed. Please try again."
  - CredentialsSignin → "Invalid email or password."
  - Default → "Something went wrong. Please try again."
- "Back to Login" button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 8 — ROUTE PROTECTION (MIDDLEWARE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create middleware.ts at project root:

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect account routes
  if (pathname.startsWith("/account") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes — must be logged in AND role = admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/auth/:path*"],
};

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## STEP 9 — NAVBAR UPDATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update existing Navbar component:
- Import useSession from next-auth/react (or use server-side auth())

If NOT logged in: show "Sign In" button → /auth/login

If logged in: show user avatar/initials dropdown with:
  - User name + email (top of dropdown)
  - "My Orders" → /account/orders
  - "Wishlist" → /account/wishlist
  - "Profile" → /account/profile
  - Divider
  - "Sign Out" button → calls signOut()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ENVIRONMENT VARIABLES NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to .env.local:

# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=    # generate with: openssl rand -base64 32

# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## GOOGLE OAUTH SETUP STEPS (DO MANUALLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to console.cloud.google.com
2. Create new project → "AMIORA Diamonds"
3. APIs & Services → OAuth consent screen
   - User Type: External
   - App name: AMIORA Diamonds
   - Support email: your email
4. APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     http://localhost:3000/api/auth/callback/google
     https://amioradiamonds.com/api/auth/callback/google
5. Copy Client ID and Client Secret → paste in .env.local

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## IMPLEMENTATION ORDER — ONE STEP AT A TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start with STEP 2 only (Types).
Show me the complete file.
Wait for my confirmation before next step.
Do NOT touch any existing code outside of what is specified.
