import Link from 'next/link'

const SHOP_LINKS = ['Rings','Necklaces','Earrings','Bangles','Bracelets','Pendants','Sets']
const POLICY_LINKS = [
  { label: 'About Us',        href: '/about' },
  { label: 'Blogs',           href: '/blogs' },
  { label: 'Stores',          href: '/stores' },
  { label: 'Customization',   href: '/customization' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Return Policy',   href: '/return-policy' },
  { label: 'Terms of Use',    href: '/terms' },
]

export function Footer() {
  return (
    <footer className="bg-deep-teal text-cream/80">
      {/* Main grid */}
      <div className="section-x py-16 grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand column — full width on mobile */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-3xl text-cream tracking-widest mb-4">AMIORA</p>
          <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
            Handcrafted jewellery with live gold & silver pricing. BIS Hallmarked, certified diamonds,
            free shipping across India.
          </p>
          <div className="mt-6 flex gap-4">
            {['Instagram', 'Pinterest', 'Facebook'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs uppercase tracking-widest text-cream/50 hover:text-cream transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Shop + Company — side by side on mobile, separate columns on lg */}
        <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-8">
          {/* Shop */}
          <div>
            <h4 className="mb-4 text-2xs uppercase tracking-widest2 text-gold">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((item) => (
                <li key={item}>
                  <Link
                    href={`/categories/${item.toLowerCase()}`}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-2xs uppercase tracking-widest2 text-gold">Company</h4>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact — centered on mobile */}
        <div className="sm:col-span-2 lg:col-span-1 text-center lg:text-left">
          <h4 className="mb-4 text-2xs uppercase tracking-widest2 text-gold">Contact</h4>
          <address className="not-italic space-y-3 text-sm text-cream/60">
            <p>+91 98765-43210</p>
            <p>hello@amioradiamonds.com</p>
            <p className="leading-relaxed">
              123 Jewellery District,<br />
              New Delhi — 110001, India
            </p>
          </address>
          <Link
            href="/stores"
            className="mt-4 inline-block text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors"
          >
            Find Our Stores →
          </Link>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 section-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
        <p>© {new Date().getFullYear()} Amiora Diamonds. All rights reserved.</p>
        <p>Designed with ♥ in India · BIS Hallmarked · 100-Day Returns</p>
      </div>
    </footer>
  )
}
