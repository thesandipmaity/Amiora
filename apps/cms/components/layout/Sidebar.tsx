'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users, MessageSquare,
  Star, FileText, Quote, MapPin, Settings, ChevronRight, LogOut, Bell,
  TrendingUp, Ticket, HelpCircle
} from 'lucide-react'
import { createBrowserClient } from '@amiora/database'
import { useNotificationStore } from '@/stores/notificationStore'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/products',     label: 'Products',    icon: Package },
  { href: '/collections',  label: 'Collections', icon: Layers },
  { href: '/orders',       label: 'Orders',      icon: ShoppingBag,    badge: 'orders' },
  { href: '/customers',    label: 'Customers',   icon: Users },
  { href: '/requests',     label: 'Requests',    icon: MessageSquare,  badge: 'requests' },
  { href: '/reviews',      label: 'Reviews',     icon: Star,           badge: 'reviews' },
  { href: '/blogs',        label: 'Blogs',       icon: FileText },
  { href: '/testimonials', label: 'Testimonials',icon: Quote },
  { href: '/stores',       label: 'Stores',      icon: MapPin },
  { href: '/coupons',      label: 'Coupons',     icon: Ticket },
  { href: '/faqs',         label: 'FAQs',        icon: HelpCircle },
  { href: '/pricing',      label: 'Pricing',     icon: TrendingUp },
  { href: '/settings',     label: 'Settings',    icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { counts } = useNotificationStore()
  const supabase = createBrowserClient()

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar-bg w-60">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-display font-bold">A</div>
        <div>
          <p className="text-cream font-display text-base leading-tight">AMIORA</p>
          <p className="text-sidebar-text text-[10px] tracking-widest uppercase">Admin CMS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 hide-scrollbar">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const count  = badge ? (counts as Record<string, number>)[badge] ?? 0 : 0
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 transition-all ${
                active
                  ? 'bg-sidebar-active text-cream'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-cream'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-sm flex-1">{label}</span>
              {count > 0 && (
                <span className="bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
              {active && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-cream transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
