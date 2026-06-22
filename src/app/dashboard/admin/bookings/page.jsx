"use client"

import { useState, useEffect } from 'react'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../../components/LoadingSpinner'
const AllBookings = () => {
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/bookings/admin/all')
      .then(res => setBookings(res.data))
      .catch(err => console.log('Error:', err.message))
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-moss/20 text-moss',
      approved: 'bg-clay/15 text-clay',
      rejected: 'bg-red-100 text-red-700',
      paid: 'bg-clay/15 text-clay',
      unpaid: 'bg-moss/20 text-moss'
    }
    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${styles[status] || ''}`
  }

  if (loading) return <LoadingSpinner text="Loading bookings..." />
  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Monitor</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">All Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-muted text-sm">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border border-line rounded-sm p-5 hover:border-ink transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Property Info section এ image যোগ করুন */}
<div>
  <p className="font-mono text-[11px] uppercase tracking-wide text-clay mb-1">Property</p>
  <div className="flex items-center gap-3">
    {booking.propertyImage && (
      <img
        src={booking.propertyImage}
        alt={booking.propertyTitle}
        style={{ width: '50px', height: '50px', minWidth: '50px', objectFit: 'cover', borderRadius: '4px' }}
      />
    )}
    <div>
      <p className="font-medium text-ink">{booking.propertyTitle}</p>
      <p className="text-sm text-muted mt-0.5">{booking.propertyLocation}</p>
      <p className="text-ink font-semibold mt-1">${booking.amount}</p>
    </div>
  </div>
</div>

                {/* Tenant Info */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-clay mb-1">Tenant</p>
                  <p className="font-medium text-ink">{booking.tenantName}</p>
                  <p className="text-sm text-muted">{booking.tenantEmail}</p>
                  <p className="text-sm text-muted mt-1">📞 {booking.contactNumber}</p>
                  <p className="text-sm text-muted">📅 Move-in: {booking.moveInDate}</p>
                </div>

                {/* Owner + Status Info */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-clay mb-1">Owner</p>
                  <p className="font-medium text-ink">{booking.ownerEmail}</p>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className={statusBadge(booking.bookingStatus)}>{booking.bookingStatus}</span>
                    <span className={statusBadge(booking.paymentStatus)}>{booking.paymentStatus}</span>
                  </div>

                  <p className="text-xs text-muted mt-2">
                    Booked: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>

                  {booking.additionalNotes && (
                    <p className="text-xs text-muted mt-1 italic">
                      &quot;{booking.additionalNotes}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllBookings