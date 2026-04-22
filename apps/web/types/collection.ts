// ─────────────────────────────────────────────────────────────────────────────
// Collection
// Represents a jewellery collection with optional parent/child hierarchy.
// parentId = null  →  top-level collection (appears directly in nav)
// parentId = <id>  →  child of that collection (sub-menu item)
// ─────────────────────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  name: string
  /** URL-safe slug, auto-generated from name but manually editable */
  slug: string
  parentId: string | null
  description?: string
  /** Cover / thumbnail image URL */
  image?: string
  /** Sort position within siblings (lower = earlier) */
  order: number
  isActive: boolean
  /** Populated when building the nested tree view — not stored in DB */
  children?: Collection[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a human-readable name into a URL-safe slug */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Build a nested tree from a flat array — O(n) */
export function buildCollectionTree(flat: Collection[]): Collection[] {
  const map  = new Map<string, Collection>()
  const roots: Collection[] = []

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

  const sortByOrder = (arr: Collection[]) => {
    arr.sort((a, b) => a.order - b.order)
    arr.forEach((c) => c.children?.length && sortByOrder(c.children))
  }
  sortByOrder(roots)

  return roots
}
