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
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

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

  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Smart parse — every backend message has a "Property Title" in quotes.
  // Split into: prefix (action) / quoted property / suffix (who/result)
  const parseMessage = (message) => {
    const match = message.match(/^(.*?)"([^"]+)"(.*)$/s)
    if (!match) return { prefix: message, property: '', suffix: '' }
    return {
      prefix: match[1].trim(),
      property: match[2].trim(),
      suffix: match[3].trim(),
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile backdrop — tap outside to close */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed sm:absolute top-20 sm:top-auto left-3 right-3 sm:left-auto sm:right-0 sm:mt-2 sm:w-[420px] max-h-[75vh] sm:max-h-[480px] rounded-sm shadow-xl z-50 flex flex-col overflow-hidden"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E4E4' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid #E4E4E4' }}
            >
              <span className="font-mono text-xs uppercase tracking-wide text-ink font-semibold">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-clay hover:underline shrink-0"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto p-2 space-y-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted text-center py-6">No notifications yet</p>
              ) : (
                notifications.map((n, index) => {
                  const { prefix, property, suffix } = parseMessage(n.message)
                  return (
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
                      className="flex gap-3 items-start px-3 py-3 rounded-sm transition-colors"
                      style={{
                        backgroundColor: !n.isRead ? '#EAF3EE' : '#FAFAFA',
                        border: `1px solid ${!n.isRead ? '#BFE0CC' : '#E4E4E4'}`,
                      }}
                    >
                      <span
                        className="shrink-0 flex items-center justify-center text-xs font-semibold"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '9999px',
                          backgroundColor: !n.isRead ? '#2F6F4F' : '#D1D5DB',
                          color: !n.isRead ? '#FFFFFF' : '#4B5563',
                        }}
                      >
                        {index + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.isRead ? 'text-ink font-semibold' : 'text-muted'}`}>
                          {prefix}
                        </p>
                        {property && (
                          <p className="text-sm font-bold text-clay truncate mt-0.5">
                            {property}
                          </p>
                        )}
                        {suffix && (
                          <p className="text-xs text-muted truncate mt-0.5">
                            {suffix}
                          </p>
                        )}
                        <p className="text-xs text-muted mt-1.5">
                          {formatRelativeTime(n.createdAt)}
                        </p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationBell