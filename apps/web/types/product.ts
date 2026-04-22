// ─────────────────────────────────────────────────────────────────────────────
// Product — CMS / catalogue view
//
// This is the enriched product shape used in the admin panel and dynamic pages.
// For the raw Supabase DB row type see packages/types/src/database.ts → Product.
//
// Relationship model:
//   • collectionId  — belongs to ONE collection (or none)
//   • categoryId    — belongs to ONE category (or none)
//   • tags          — array of Tag IDs (many-to-many, stored as string[])
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  /** Display title shown to customers */
  title: string
  /** Price as string to accommodate display formats like "₹12,500" */
  price: string
  /** Primary display image URL */
  image: string
  /** URL-safe slug, e.g. "diamond-solitaire-ring" */
  slug: string
  /** ID of the collection this product belongs to (optional) */
  collectionId?: string
  /** ID of the category this product belongs to (optional) */
  categoryId?: string
  /** Array of Tag IDs assigned to this product */
  tags?: string[]
}
