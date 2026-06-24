"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import useAxiosSecure from '../hooks/useAxiosSecure'

const NotificationBell = () => {
  const { user, token } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const fetchNotifications = () => {
    if (!user?.email || !token) return
    axiosSecure.get(`/notifications/${user.email}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.log('Error fetching notifications:', err.message))
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    if (!user?.email || !token) return

    try {
      await axiosSecure.patch(`/notifications/${user.email}/read-all`)
      fetchNotifications()
    } catch (error) {
      console.log('Error marking notifications as read:', error.message)
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-moss/10 rounded-sm transition-colors"
        aria-label="Notifications"
      >
        {/* Bell icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-paper border border-line rounded-sm shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="font-mono text-xs uppercase tracking-wide text-ink font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-clay hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link || '/'}
                  onClick={() => {
                    setOpen(false)
                    if (!n.isRead) {
                      axiosSecure.patch(`/notifications/${n._id}/read`)
                        .then(fetchNotifications)
                    }
                  }}
                  className={`block px-4 py-3 border-b border-line hover:bg-moss/5 transition-colors ${
                    !n.isRead ? 'bg-clay/5' : ''
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-ink font-medium' : 'text-muted'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {!n.isRead && (
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
 