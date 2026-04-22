# SESSION 13 — Orders, Customers & Requests Management

> **Depends on:** SESSION_12  
> **Deliverable:** Order management, customer panel, all request inboxes  
> **Estimated Time:** 3–4 hours

---

## Orders (`/orders`)
```
Table: Order # | Customer | Date | Items | Total | Payment | Status | Actions
Filters: Status, Payment Mode, Date Range
Clicking order → detail modal:
  - Order items with images + variant labels
  - Price breakdown (metal price + making + gem + shipping)
  - Customer info + shipping address or pickup store
  - Status timeline (Pending → Confirmed → Processing → Shipped → Delivered)
  - Update Status dropdown + Save
  - Download Invoice button
```

## Customers (`/customers`)
```
Table: Name | Email | Phone | Total Orders | Total Spent | Joined
Search by name/email/phone
Click → customer detail: profile info + all orders + wishlist count + requests
```

## Requests Inbox (`/requests`)
```
Tabs:
├── Customization (pending first, show product + description + images + reply form)
├── Callbacks (name, phone, preferred time, mark as called)
└── Demo Requests (type, address, preferred date, status update)
```

## Reviews Moderation (`/reviews`)
```
Table: Product | Customer | Rating | Review text | Date | Status (Pending/Approved)
Approve / Reject buttons
```

---

## Tasks for This Session

- [ ] Build Orders table with filters + date range
- [ ] Build Order detail modal with status timeline
- [ ] Build Customers table + detail view
- [ ] Build Requests inbox with 3 tabs
- [ ] Build Reviews moderation table
- [ ] Connect all to API

---

## Next Session
→ **SESSION_14_CMS_CONTENT.md** — Blogs, Testimonials, Settings

