# SESSION 11 — CMS Scaffold, Auth & Design System

> **Depends on:** SESSION_02 (API), SESSION_10 (Storefront complete)  
> **Deliverable:** CMS app running with login, sidebar navigation, design system  
> **Estimated Time:** 3–4 hours

---

## Project Init

```bash
npx create-next-app@latest amiora-cms \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
cd amiora-cms
npm install @supabase/supabase-js @supabase/ssr axios swr
npm install lucide-react framer-motion
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast
npm install react-hook-form zod @hookform/resolvers
npm install recharts         # for dashboard charts
npm install @tiptap/react @tiptap/starter-kit  # for blog editor
```

---

## CMS Design System
```
Same AMIORA color tokens but with:
- Darker surfaces (more contrast for data-dense admin)
- Sidebar: --color-deep-teal background
- Content: --color-bg warm white
- Compact typography (--text-sm for most UI, --text-base for content)
```

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ TOP BAR: AMIORA CMS logo | Notifications | User menu │
├─────────────────┬────────────────────────────────────┤
│ SIDEBAR (240px) │ MAIN CONTENT AREA                  │
│ ─────────────── │                                    │
│ Dashboard       │  [Page content here]               │
│ Products        │                                    │
│ Collections     │                                    │
│ Categories      │                                    │
│ Orders          │                                    │
│ Customers       │                                    │
│ Requests        │                                    │
│ Reviews         │                                    │
│ Blogs           │                                    │
│ Testimonials    │                                    │
│ Stores          │                                    │
│ Settings        │                                    │
└─────────────────┴────────────────────────────────────┘
```

---

## CMS Auth
```
- Login page at /login (email + password, admin only)
- Supabase auth: user must have role = 'admin' in user_metadata
- Middleware: redirect all /cms/** routes to /login if not authenticated
- Store session in memory (no localStorage)
```

---

## Tasks for This Session

- [ ] Init CMS Next.js project
- [ ] Set up CMS design system (globals.css)
- [ ] Build Login page
- [ ] Build CMS layout shell (sidebar + topbar + content area)
- [ ] Set up auth middleware
- [ ] Build sidebar navigation with active state
- [ ] Build notification bell (badge + dropdown, WS-powered)
- [ ] Verify auth flow works

---

## Next Session
→ **SESSION_12_CMS_DASHBOARD_PRODUCTS.md** — Sales dashboard, product management

