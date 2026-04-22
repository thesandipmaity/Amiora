# SESSION 02 — Backend API Setup (Node.js / Express)

> **Depends on:** SESSION_01 (DB schema complete)  
> **Deliverable:** Working Express API with all route scaffolds, Supabase client, Cloudinary config, gold/silver cron job  
> **Estimated Time:** 3–4 hours

---

## Project Structure

```
amiora-api/
├── src/
│   ├── index.js                  # Entry point
│   ├── config/
│   │   ├── supabase.js           # Supabase admin client
│   │   ├── cloudinary.js         # Cloudinary config
│   │   └── websocket.js          # WS server setup
│   ├── routes/
│   │   ├── products.js
│   │   ├── collections.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── wishlist.js
│   │   ├── reviews.js
│   │   ├── requests.js           # callback, demo, customization
│   │   ├── stores.js
│   │   ├── blogs.js
│   │   ├── prices.js             # Live gold/silver prices
│   │   ├── upload.js             # Cloudinary upload handler
│   │   └── cms/                  # CMS-only protected routes
│   │       ├── dashboard.js
│   │       ├── inventory.js
│   │       └── notifications.js
│   ├── middleware/
│   │   ├── auth.js               # Verify Supabase JWT
│   │   ├── adminOnly.js          # Role check for CMS
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── priceService.js       # Gold/Silver API fetch + store
│   │   ├── pricingEngine.js      # Calculate product price from weight + purity
│   │   └── notificationService.js
│   └── jobs/
│       └── priceCron.js          # node-cron daily price fetch
├── .env
├── package.json
└── README.md
```

---

## Core Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@supabase/supabase-js": "^2.39.0",
    "cloudinary": "^1.41.3",
    "multer": "^1.4.5",
    "multer-storage-cloudinary": "^4.0.0",
    "node-cron": "^3.0.3",
    "ws": "^8.16.0",
    "axios": "^1.6.5",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  }
}
```

---

## Key Files to Write

### `src/config/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role for server-side
)
export default supabase
```

### `src/config/cloudinary.js`
```js
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
export default cloudinary
```

### `src/services/priceService.js`
```
- Fetch gold (999 purity) price per gram in INR from a free API
  Recommended API: metals.live or goldapi.io (free tier)
  Fallback: metals-api.com
- Convert USD/oz → INR/gram using live forex rate (exchangerate-api.com free tier)
- Insert into live_prices table (metal: 'gold_999' and 'silver_999')
- Return latest price or fallback to last stored price
```

### `src/services/pricingEngine.js`
```
PRICING FORMULA:
  pure_price = weight_grams × live_price_per_gram_999
  purity_multiplier = { '18k': 18/24, '14k': 14/24, '9k': 9/24, '92.5': 0.925 }
  base_metal_price = pure_price × purity_multiplier
  making_charge = base_metal_price × (making_charge_pct / 100)
  gem_price = variant.gem_price_override OR 0
  final_price = base_metal_price + making_charge + gem_price
  
  NOTE: making_charge_pct = 8% (default, per product)
  All prices in INR, round to 2 decimal places
```

### `src/jobs/priceCron.js`
```js
import cron from 'node-cron'
import { fetchAndStorePrices } from '../services/priceService.js'

// Run once a day at 9:00 AM IST (3:30 AM UTC)
cron.schedule('30 3 * * *', async () => {
  await fetchAndStorePrices()
  console.log('[PriceCron] Gold & Silver prices updated')
})
```

---

## API Routes Reference

### Products
```
GET  /api/products                    # list with filters (category, collection, metal, purity, sort, page)
GET  /api/products/:slug              # single product with all variants + images + smart pairs
GET  /api/products/:slug/price        # dynamic price calc for a specific variant
GET  /api/products/featured           # is_featured=true
GET  /api/products/new-arrivals       # latest 8
```

### Collections & Categories
```
GET  /api/collections                 # all active collections
GET  /api/collections/:slug           # collection page with its products
GET  /api/categories                  # all active categories
GET  /api/categories/:slug            # category page products
GET  /api/menu/collections            # optimized for mega-menu: name + 4 product names per collection
```

### Orders
```
POST /api/orders                      # create order (auth required)
GET  /api/orders/my                   # user's own orders (auth required)
GET  /api/orders/:id                  # order detail (auth required, own order only)
POST /api/orders/:id/cancel           # cancel if status=pending
```

### Users & Profiles
```
GET  /api/users/me                    # fetch own profile
PUT  /api/users/me                    # update own profile
POST /api/users/me/address            # add address
PUT  /api/users/me/address/:id        # update address
DELETE /api/users/me/address/:id      # remove address
```

### Wishlist
```
GET    /api/wishlist                  # user's wishlist
POST   /api/wishlist                  # add item {product_id, variant_id}
DELETE /api/wishlist/:id              # remove item
```

### Requests
```
POST /api/requests/callback           # create callback request
POST /api/requests/demo               # create demo request (visit store OR home visit)
POST /api/requests/customization      # customization request + image upload
GET  /api/requests/customization/my   # user's own customization requests
```

### Reviews
```
GET  /api/reviews/:productId          # approved reviews for a product
POST /api/reviews                     # submit review (auth + must have ordered)
```

### Stores
```
GET /api/stores                       # all active stores
```

### Prices
```
GET /api/prices/current               # latest gold + silver price
```

### Upload
```
POST /api/upload/product-image        # CMS: upload image to Cloudinary, return URL
POST /api/upload/user-image           # User: upload customization reference image
```

### CMS (Protected — admin JWT required)
```
GET  /api/cms/dashboard/stats         # revenue, orders, top products
GET  /api/cms/orders                  # all orders with filters
PUT  /api/cms/orders/:id/status       # update order status
GET  /api/cms/requests                # all callback/demo/custom requests
PUT  /api/cms/requests/:type/:id      # update request status + reply
GET  /api/cms/notifications           # all unread notifications
PUT  /api/cms/notifications/:id/read

# Products CRUD (CMS)
GET    /api/cms/products
POST   /api/cms/products
PUT    /api/cms/products/:id
DELETE /api/cms/products/:id
POST   /api/cms/products/:id/images
DELETE /api/cms/products/:id/images/:imageId

# Collections CRUD
GET    /api/cms/collections
POST   /api/cms/collections
PUT    /api/cms/collections/:id
DELETE /api/cms/collections/:id

# Blogs CRUD
GET    /api/cms/blogs
POST   /api/cms/blogs
PUT    /api/cms/blogs/:id
DELETE /api/cms/blogs/:id

# Testimonials CRUD
GET    /api/cms/testimonials
POST   /api/cms/testimonials
PUT    /api/cms/testimonials/:id
DELETE /api/cms/testimonials/:id

# Stores CRUD
GET    /api/cms/stores
POST   /api/cms/stores
PUT    /api/cms/stores/:id
DELETE /api/cms/stores/:id

# Reviews moderation
GET  /api/cms/reviews                 # all reviews (pending + approved)
PUT  /api/cms/reviews/:id/approve
DELETE /api/cms/reviews/:id
```

---

## WebSocket Setup (`src/config/websocket.js`)

```js
// WS events for real-time CMS sync
// Server broadcasts to CMS clients when:
// - new order arrives
// - customization request submitted
// - callback/demo request submitted
// - review submitted (pending approval)

// Events:
// { type: 'new_order', payload: { order_id, order_number, total_amount } }
// { type: 'new_customization', payload: { id, user_name, product_name } }
// { type: 'new_callback', payload: { id, name, phone } }
// { type: 'new_demo', payload: { id, type, name } }
// { type: 'new_review', payload: { id, product_name, rating } }
// { type: 'price_updated', payload: { gold_per_gram, silver_per_gram } }
```

Use Supabase Realtime (listen to `postgres_changes`) to trigger WS broadcasts.

---

## Auth Middleware (`src/middleware/auth.js`)

```js
// Extract Bearer token from Authorization header
// Verify with Supabase: supabase.auth.getUser(token)
// Attach user to req.user
// Return 401 if invalid/expired
```

---

## Tasks for This Session

- [ ] Init Node.js project, install dependencies
- [ ] Set up `.env` with all keys (Supabase SERVICE_ROLE_KEY, Cloudinary, Price API key)
- [ ] Write `supabase.js`, `cloudinary.js` configs
- [ ] Write `priceService.js` — fetch gold & silver prices from free API
- [ ] Write `pricingEngine.js` — formula as described above
- [ ] Set up `priceCron.js` — daily price update at 9 AM IST
- [ ] Scaffold all route files with stub handlers returning `{ success: true }`
- [ ] Write `auth.js` middleware (JWT verification via Supabase)
- [ ] Write `adminOnly.js` middleware (check user role = 'admin' in user_metadata)
- [ ] Set up WebSocket server
- [ ] Test: GET /api/prices/current returns current gold/silver price
- [ ] Test: Auth middleware correctly rejects invalid tokens
- [ ] Deploy to Railway or DigitalOcean App Platform

---

## Next Session
→ **SESSION_03_STOREFRONT_SCAFFOLD.md** — Next.js storefront setup, design system, navigation

