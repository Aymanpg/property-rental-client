"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useAuth from '../hooks/useAuth'
import NotificationBell from './NotificationBell'

const TagMark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" className="-rotate-12">
    <path d="M3 11.5L11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21 3 11.5Z"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
  </svg>
)

const Navbar = () => {
  const { user, dbUser, logoutUser } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const dashboardPath =
    dbUser?.role === 'admin'
      ? '/dashboard/admin/users'
      : dbUser?.role === 'owner'
      ? '/dashboard/owner'
      : '/dashboard/tenant/bookings'

  const isActive = (path) => pathname === path

  const linkClass = (path) =>
    `relative text-[15px] font-medium transition-colors py-1 ${
      isActive(path)
        ? 'text-ink after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-[2px] after:bg-clay'
        : 'text-muted hover:text-ink'
    }`

  const handleLogout = () => {
    setProfileOpen(false)
    logoutUser()
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b-2 border-ink">
      <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-ink group">
          <span className="text-clay group-hover:rotate-0 transition-transform">
            <TagMark />
          </span>
          <span className="font-display italic text-2xl tracking-tight">
            RentEase
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/properties" className={linkClass('/properties')}>All Properties</Link>

          {!user ? (
            <Link href="/login" className={linkClass('/login')}>Login</Link>
          ) : (
            <Link href={dashboardPath} className={linkClass(dashboardPath)}>Dashboard</Link>
          )}
        </div>

        {/* CTA / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Link
              href="/register"
              className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
            >
              Get started
            </Link>
          ) : (
            <>
              {/* 🔥 NOTIFICATION BELL ADDED HERE */}
              <NotificationBell />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 border border-line rounded-full hover:border-ink/30 transition-colors"
                >
                  {dbUser?.photo || user?.photoURL ? (
                    <img
                      src={dbUser?.photo || user?.photoURL}
                      alt={dbUser?.name || user?.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-clay text-paper flex items-center justify-center text-xs font-semibold">
                      {(dbUser?.name || user?.displayName || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-ink max-w-[100px] truncate">
                    {dbUser?.name || user?.displayName || 'Account'}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-paper border border-line rounded-sm shadow-lg z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-line">
                        <p className="text-sm font-medium text-ink truncate">
                          {dbUser?.name || user?.displayName}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {dbUser?.email || user?.email}
                        </p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-clay/10 text-clay text-[10px] font-mono uppercase tracking-wide rounded-sm">
                          {dbUser?.role || 'tenant'}
                        </span>
                      </div>

                      <Link
                        href={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink hover:bg-moss/10 transition-colors"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-clay hover:bg-moss/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile: bell (always visible) + hamburger */}
<div className="md:hidden flex items-center gap-1">
  {user && <NotificationBell />}

  <button
    className="flex flex-col gap-1.5 p-2"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <span className={`block w-6 h-0.5 bg-ink transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
    <span className={`block w-6 h-0.5 bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
    <span className={`block w-6 h-0.5 bg-ink transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
  </button>
</div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-line px-6 py-5 flex flex-col gap-4 bg-paper">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/properties" onClick={() => setMenuOpen(false)}>All Properties</Link>

          {!user ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm w-fit"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-clay text-paper flex items-center justify-center text-xs font-semibold">
                  {(dbUser?.name || user?.displayName || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{dbUser?.name}</p>
                  <p className="text-xs text-muted">{dbUser?.role}</p>
                </div>
              </div>

              <Link href={dashboardPath} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>

              <button onClick={handleLogout} className="text-left text-sm text-clay">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar