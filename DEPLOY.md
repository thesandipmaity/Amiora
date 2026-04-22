# Netlify Deployment Guide — Amiora Diamonds

## 2 separate Netlify sites banana hai (same GitHub repo se)

---

## SITE 1 — Storefront (amioradiamonds.com)

### Netlify Dashboard Settings:
| Field             | Value                    |
|-------------------|--------------------------|
| Base directory    | `apps/web`               |
| Build command     | *(leave blank)*          |
| Publish directory | `.next`                  |

### Environment Variables (Site → Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL        = https://ifbyzgelotoneozqhomy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJhbGci...PdyWbY
SUPABASE_SERVICE_ROLE_KEY       = eyJhbGci...T5w0
NEXT_PUBLIC_SITE_URL            = https://amioradiamonds.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dqayol6fn
CLOUDINARY_CLOUD_NAME           = dqayol6fn
CLOUDINARY_API_KEY              = 465881383896453
CLOUDINARY_API_SECRET           = i1kohYlAlodMEwWGCelItA4UPdI
NEXT_PUBLIC_RAZORPAY_KEY_ID     = rzp_live_xxxxx
RAZORPAY_KEY_SECRET             = your_live_secret
CMS_PRICING_SECRET              = amiora-cms-secret-2024
GOLD_API_KEY                    = your_goldapi_key
```

---

## SITE 2 — CMS (cms.amioradiamonds.com)

### Netlify Dashboard Settings:
| Field             | Value                    |
|-------------------|--------------------------|
| Base directory    | `apps/cms`               |
| Build command     | *(leave blank)*          |
| Publish directory | `.next`                  |

### Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL        = https://ifbyzgelotoneozqhomy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJhbGci...PdyWbY
SUPABASE_SERVICE_ROLE_KEY       = eyJhbGci...T5w0
NEXT_PUBLIC_SITE_URL            = https://cms.amioradiamonds.com
NEXT_PUBLIC_STOREFRONT_URL      = https://amioradiamonds.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dqayol6fn
CLOUDINARY_CLOUD_NAME           = dqayol6fn
CLOUDINARY_API_KEY              = 465881383896453
CLOUDINARY_API_SECRET           = i1kohYlAlodMEwWGCelItA4UPdI
CMS_PRICING_SECRET              = amiora-cms-secret-2024
```

---

## Supabase Auth URLs Update (IMPORTANT)

Supabase Dashboard → Authentication → URL Configuration:

**Site URL:** `https://amioradiamonds.com`

**Redirect URLs (whitelist):**
```
https://amioradiamonds.com/auth/callback
https://amioradiamonds.com/auth/reset-password
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

---

## Step-by-step (pehli baar):

1. GitHub pe push karo
2. netlify.com → "Add new site" → "Import from Git"
3. Repo select karo
4. **Site 1**: Base dir = `apps/web`, publish = `.next` → Deploy
5. Site 1 ke env vars add karo
6. Phir "Add new site" → same repo
7. **Site 2**: Base dir = `apps/cms`, publish = `.next` → Deploy
8. Site 2 ke env vars add karo
9. Supabase auth URLs update karo (upar dekho)
10. Done ✓
