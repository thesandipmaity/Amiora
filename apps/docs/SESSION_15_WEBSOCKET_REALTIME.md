# SESSION 15 — WebSocket Real-Time Sync

> **Depends on:** SESSION_14  
> **Deliverable:** Live CMS notifications, real-time storefront price updates  
> **Estimated Time:** 2–3 hours

---

## WebSocket Architecture

```
Supabase Realtime (postgres_changes)
         │
         ▼
  Node.js API (WS Server on :5000/ws)
         │
    ┌────┴────┐
    ▼         ▼
  CMS       Storefront
 (Admin)   (Price updates)
```

---

## CMS Real-Time Events
```
New Order       → badge on Orders sidebar item + toast notification
New Custom Req  → badge on Requests sidebar item
New Callback    → badge on Requests sidebar item
New Demo        → badge on Requests sidebar item
New Review      → badge on Reviews sidebar item
Price Updated   → update live price display in Settings
```

## Storefront Real-Time Events
```
Price Updated   → all product pages and shop pages refresh
                  displayed prices (re-fetch /api/prices/current)
                  Show "Prices updated" subtle toast
```

---

## Implementation

### API side (`src/config/websocket.js`)
```js
// Subscribe to Supabase Realtime channels for each table
// On change, broadcast appropriate WS event to connected clients
// CMS clients: receive ALL events
// Storefront clients: receive only 'price_updated' event
// Distinguish client type via WS connection query param: ?client=cms or ?client=store
```

### CMS side
```typescript
// useWebSocket.ts hook:
// Connect to ws://API_URL/ws?client=cms
// On message, dispatch to notification store (Zustand)
// Notification store: { count, items[], addNotification(), markRead() }
```

### Storefront side
```typescript
// usePriceSocket.ts hook:
// Connect to ws://API_URL/ws?client=store
// On 'price_updated' event, invalidate SWR price cache
// All price displays re-render automatically
```

---

## Tasks for This Session

- [ ] Supabase Realtime subscriptions in API server
- [ ] WS server: handle cms vs store client types
- [ ] CMS: useWebSocket hook + notification store
- [ ] CMS: sidebar badges update in real-time
- [ ] CMS: toast for new orders/requests
- [ ] Storefront: usePriceSocket + SWR cache invalidation
- [ ] Test end-to-end: create order → CMS gets notification
- [ ] Test price update flow

---

## Next Session
→ **SESSION_16_QA_SEO_DEPLOY.md** — Final QA, SEO, performance, deployment

