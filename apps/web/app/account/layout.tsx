import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="section-x py-10 min-h-screen">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <AccountSidebar />
          <main>{children}</main>
        </div>
      </div>
      <Footer />
    </>
  )
}
