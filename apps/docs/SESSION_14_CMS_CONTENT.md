# SESSION 14 — CMS Content: Blogs, Testimonials, Settings

> **Depends on:** SESSION_13  
> **Deliverable:** Blog editor, testimonials manager, store manager, settings panel  
> **Estimated Time:** 3 hours

---

## Blogs (`/blogs`)
```
- List: table of all blogs (title, status, published date, views)
- Editor (/blogs/new, /blogs/[id]/edit):
  - Title, Slug, Excerpt
  - Cover image upload (Cloudinary)
  - Body: TipTap WYSIWYG editor (bold, italic, h2/h3, lists, images, links)
  - Tags (multi-select)
  - Author
  - Published toggle + published_at date picker
```

## Testimonials (`/testimonials`)
```
- Add/Edit: Name, Location, Avatar upload, Quote (textarea), Rating (1-5 stars), Is Featured
- Drag-to-reorder for featured testimonials
```

## Stores (`/stores`)
```
- Add/Edit store: Name, Address, City, State, Pincode, Phone, Email
- Timings: day-by-day JSON (Mon-Sun)
- Location: Lat/Lng input OR Google Maps link
- Store image upload
```

## Settings (`/settings`)
```
- Making Charge % (global default, 8% — editable)
- Gold/Silver price fetch: Manual trigger button + last fetched timestamp
- Price API key config
- Notification preferences (which events trigger WS notification)
```

---

## Tasks for This Session

- [ ] Build Blog list table
- [ ] Build Blog editor with TipTap
- [ ] Build Testimonials manager with drag-reorder
- [ ] Build Stores CRUD form
- [ ] Build Settings panel
- [ ] Manual price refresh button → calls /api/prices/refresh
- [ ] All connected to API

---

## Next Session
→ **SESSION_15_WEBSOCKET_SYNC.md** — Real-time WebSocket sync between CMS and storefront

