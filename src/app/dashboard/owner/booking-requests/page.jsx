"use client"

import { useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const BookingRequests = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = () => {
    if (!user?.email) return
    axiosSecure.get(`/bookings/owner/${user.email}`)
      .then(res => setBookings(res.data))
      .catch(err => console.log('Error fetching bookings:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleStatusChange = async (id, bookingStatus) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/status`, { bookingStatus })
      toast.success(`Booking ${bookingStatus}`)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to update booking')
    }
  }

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-moss/20 text-moss',
      approved: 'bg-clay/15 text-clay',
      rejected: 'bg-red-100 text-red-700'
    }
    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${styles[status]}`
  }

  if (loading) {
    return <p className="text-muted text-sm">Loading booking requests...</p>
  }

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Requests</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">Booking Requests</h1>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm py-16 text-center">
          <p className="text-muted text-sm">No booking requests yet.</p>
        </div>
      ) : (
        <div className="border border-line rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Tenant</th>
                <th className="text-left px-4 py-3 font-medium">Property</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="text-ink font-medium">{booking.tenantName}</p>
                    <p className="text-xs text-muted">{booking.tenantEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted max-w-[180px] truncate">{booking.propertyTitle}</td>
                  <td className="px-4 py-3 text-ink">${booking.amount}</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge(booking.bookingStatus)}>{booking.bookingStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    {booking.bookingStatus === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                          className="px-3 py-1.5 bg-clay text-paper text-xs font-medium rounded-sm hover:bg-clay-dark transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                          className="px-3 py-1.5 border border-line text-xs font-medium rounded-sm hover:border-ink transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BookingRequests