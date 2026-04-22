// ─────────────────────────────────────────────────────────────────────────────
// Category
// Hierarchical product category (e.g. Rings → Men's Rings).
// parentId = null  →  root category
// parentId = <id>  →  sub-category
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  /** URL-safe slug, auto-generated from name but manually editable */
  slug: string
  parentId: string | null
  /** Category thumbnail / banner image URL */
  image?: string
  isActive: boolean
  /** Populated when building the nested tree view — not stored in DB */
  children?: Category[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Build a nested tree from a flat array — O(n) */
export function buildCategoryTree(flat: Category[]): Category[] {
  const map  = new Map<string, Category>()
  const roots: Category[] = []

  for (const item of flat) {
    map.set(item.id, { ...item, children: [] })
  }

  for (const item of map.values()) {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(item)
    } else {
      roots.push(item)
    }
  }

  return roots
}
