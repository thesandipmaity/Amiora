# SESSION 08 — User Profile, Orders, Wishlist

> **Depends on:** SESSION_07  
> **Deliverable:** Full user account area  
> **Estimated Time:** 3 hours

---

## Account Pages (all require auth, redirect to login if not)

### `/account` — Profile
```
- Avatar upload + full name, email, phone, DOB, gender
- Saved addresses (add/edit/delete/set default)
- Change password section
- Delete account option
```

### `/account/orders` — Order History
```
- Table/card list of all orders (newest first)
- Each: order number, date, items thumbnail strip, total, status badge
- Status: Pending | Confirmed | Processing | Shipped | Delivered | Cancelled
- Click → order detail modal:
  - All items, price breakdown, shipping address
  - Track order (link or status timeline)
  - Cancel button (if status=pending/confirmed)
  - Write Review buttons (if delivered)
```

### `/account/wishlist` — Wishlist
```
- Grid of saved product cards
- Each has: Remove from Wishlist + Add to Cart
- Empty state: "Your wishlist is empty" + "Start Shopping" CTA
```

### `/account/requests` — My Requests
```
Tabs:
├── Customization Requests:
│   - Each: product image + description + status + admin reply
│   - Status: Pending | Reviewing | Possible | Not Possible
└── Demo / Callback Requests:
    - Each: type + date + status
```

---

## Auth Pages

### Login (`/login`)
- Email + Password
- Google OAuth (Supabase)
- "Forgot Password" link
- "New here? Create Account"

### Register (`/register`)
- Email + Password + Full Name
- Terms checkbox
- Verify email (Supabase email confirmation)

---

## Tasks for This Session

- [ ] Build account layout with sidebar navigation
- [ ] Build Profile page with form + avatar upload
- [ ] Build Address management (CRUD)
- [ ] Build Orders page with order detail modal
- [ ] Build Wishlist page
- [ ] Build Requests page with tabs
- [ ] Build Login page (email + Google OAuth)
- [ ] Build Register page
- [ ] Protect all /account routes (middleware.ts redirect)
- [ ] Connect all to API endpoints

---

## Next Session
→ **SESSION_09_CUSTOMIZATION_REQUESTS.md** — Customization flow, requests, store locator

