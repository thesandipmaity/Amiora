// ─────────────────────────────────────────────────────────────────────────────
// Tag
// Short label applied to products for discovery and filtering.
// color is optional — defaults to a neutral grey in the UI when absent.
// ─────────────────────────────────────────────────────────────────────────────

export interface Tag {
  id: string
  name: string
  /** URL-safe slug, e.g. "new-arrival" */
  slug: string
  /** Hex color string, e.g. "#10B981". Optional — UI falls back to a default. */
  color?: string
  /** Derived at query time — how many products carry this tag */
  productCount?: number
}
