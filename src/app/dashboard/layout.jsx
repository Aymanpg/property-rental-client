"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import useAuth from '../../hooks/useAuth'

const tenantLinks = [
  { href: '/dashboard/tenant/bookings', label: 'My Bookings' },
  { href: '/dashboard/tenant/favorites', label: 'Favorites' },
  { href: '/dashboard/tenant/profile', label: 'Profile' },
]

const ownerLinks = [
  { href: '/dashboard/owner', label: 'Analytics' },
  { href: '/dashboard/owner/add-property', label: 'Add Property' },
  { href: '/dashboard/owner/my-properties', label: 'My Properties' },
  { href: '/dashboard/owner/booking-requests', label: 'Booking Requests' },
]

const adminLinks = [
  { href: '/dashboard/admin/users', label: 'All Users' },
  { href: '/dashboard/admin/properties', label: 'All Properties' },
  { href: '/dashboard/admin/bookings', label: 'All Bookings' },
  { href: '/dashboard/admin/transactions', label: 'Transactions' },
]

const DashboardLayout = ({ children }) => {
  const { user, dbUser, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="font-mono text-sm text-muted">Loading...</span>
      </div>
    )
  }

  const links =
    dbUser?.role === 'admin' ? adminLinks :
    dbUser?.role === 'owner' ? ownerLinks :
    tenantLinks

  return (
    <div className="flex flex-col md:flex-row max-w-7xl w-full mx-auto">

      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center justify-between px-6 py-3 bg-ink text-paper">
        <span className="font-mono text-xs uppercase tracking-widest text-paper/60">
          {dbUser?.role} dashboard
        </span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sm font-medium">
          {sidebarOpen ? 'Close ✕' : 'Menu ☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 bg-ink shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-paper/40 mb-1 hidden md:block">
            {dbUser?.role} dashboard
          </p>
          <h2 className="font-display italic text-xl text-paper mb-5 hidden md:block">Welcome back</h2>

          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-clay text-paper'
                      : 'text-paper/75 hover:bg-paper/10 hover:text-paper'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-5 border-t border-paper/10">
            <Link
              href="/"
              className="block px-4 py-2.5 text-sm font-medium text-paper/60 hover:text-paper transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 bg-paper">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout