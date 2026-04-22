# SESSION 07 — Cart & Checkout

> **Depends on:** SESSION_06 (product page, cart store)  
> **Deliverable:** Cart page, Checkout flow (online pay + book & pay in-store), Order confirmation  
> **Estimated Time:** 4 hours

---

## Cart Page (`/cart`)

```
┌─────────────────────────┬──────────────────────┐
│ Cart Items (left/60%)   │ Order Summary (right) │
├─────────────────────────┼──────────────────────┤
│ Each item:              │ Subtotal              │
│ - Image (80×80)         │ Making Charges        │
│ - Name + variant label  │ Shipping              │
│ - Size                  │ Discount (if any)     │
│ - Price                 │ ─────────────────     │
│ - Qty stepper           │ Total                 │
│ - Remove button         │                       │
│ - Move to Wishlist      │ [PROCEED TO CHECKOUT] │
├─────────────────────────┴──────────────────────┤
│ SMART SUGGESTIONS: "You might also like"        │
│ (3–4 suggested products based on cart items)    │
└─────────────────────────────────────────────────┘
```

Smart suggestions: POST /api/products/smart-suggest with cart product IDs

---

## Checkout Flow (`/checkout`)

3-step flow (no page reload between steps):

### Step 1: Delivery Method
```
Choice A: ONLINE ORDER → fill shipping address → proceed to payment
Choice B: BOOK & PICK UP IN STORE → select store → choose date/time → 
          choose payment: Pay Now (online) OR Pay At Store
```

### Step 2: Address / Store Selection
```
IF online order:
  - Select saved address OR add new address
  - Shipping estimate shown

IF book & pick up:
  - List of stores (name, address, timings, map link)
  - Select store
  - Pick preferred pickup date
```

### Step 3: Payment
```
IF paying online:
  - Payment gateway integration (Razorpay recommended for India)
  - Show supported: UPI, Cards, Net Banking, EMI
  - Order confirmed after successful payment

IF pay at store:
  - Booking confirmed immediately
  - Order status = 'booked_for_pickup'
  - Confirmation email sent
```

---

## Order Confirmation Page
```
- Big checkmark animation (Framer Motion)
- Order number: AMR-2025-XXXXX
- Summary: items, total, delivery method
- CTA: "View Order" | "Continue Shopping"
- For pickup: store address + pickup date reminder
```

---

## Smart Suggestions in Cart & Checkout
```
Cart page: 3–4 "You might also like" cards
Checkout page Step 1: "Don't forget to add" 2 product suggestions
Both use: POST /api/products/smart-suggest { product_ids: [...] }
API returns: smart_pairs + complementary products from same collection
```

---

## Tasks for This Session

- [ ] Build Cart page layout with smart suggestions
- [ ] Build Checkout step 1: Delivery Method choice
- [ ] Build Checkout step 2: Address/Store selection
- [ ] Build Checkout step 3: Payment (Razorpay integration)
- [ ] Build Order confirmation page with animation
- [ ] Connect to POST /api/orders on checkout complete
- [ ] Clear cart on successful order
- [ ] Guest checkout: collect email if not logged in
- [ ] Mobile-optimized checkout (single-column stacked)
- [ ] Smart suggestions API integration

---

## Next Session
→ **SESSION_08_USER_PROFILE.md** — User account: profile, orders, wishlist, requests

