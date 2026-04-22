# SESSION 09 — Customization, Requests & Store Locator

> **Depends on:** SESSION_08  
> **Deliverable:** Customization page, Request modals, Store Locator page  
> **Estimated Time:** 2–3 hours

---

## `/customization` — Customization Page
```
- Hero: "Design Your Dream Piece"
- How it works (3 steps): Submit → We Review → Confirm & Create
- Form:
  - Select base product (optional, dropdown/search)
  - Describe customization (textarea)
  - Upload reference images (up to 5, Cloudinary upload)
  - Contact preference (call / WhatsApp / email)
- POST /api/requests/customization
```

## Request Modals (reusable components)

### Callback Request Modal
```
- Name + Phone + Preferred Time
- POST /api/requests/callback
```

### Demo Request Modal
```
- Type: Visit Store (select store + date) OR Home Visit (select/add address + date + time)
- Products of interest (multi-select tags)
- Notes
- POST /api/requests/demo
```

---

## `/stores` — Store Locator
```
- Search bar: search by city/pincode
- List of stores with:
  - Name, address, phone, timings
  - "Get Directions" button (Google Maps link)
  - "Book Demo Here" button (pre-fills demo modal)
- Optional: embedded Google Maps iframe
```

---

## Tasks for This Session

- [ ] Build `/customization` page with image upload
- [ ] Build Callback modal (used from product page + header)
- [ ] Build Demo Request modal (used from product page + stores page)
- [ ] Build `/stores` page with search + cards + map
- [ ] Connect all forms to API
- [ ] Reusable modal system (Radix Dialog)

---

## Next Session
→ **SESSION_10_STATIC_PAGES.md** — About, Contact, Policies, Blogs

