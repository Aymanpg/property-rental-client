"use client"

import { useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../../components/LoadingSpinner'

const MyBookings = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) return
    axiosSecure
      .get(`/bookings/tenant/${user.email}`)
      .then(res => setBookings(res.data))
      .catch(err => console.log('Error fetching bookings:', err.message))
      .finally(() => setLoading(false))
  }, [user, axiosSecure])

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-moss/20 text-moss',
      approved: 'bg-clay/15 text-clay',
      rejected: 'bg-red-100 text-red-700',
      paid: 'bg-clay/15 text-clay',
      unpaid: 'bg-moss/20 text-moss',
    }

    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${
      styles[status] || ''
    }`
  }

  if (loading) return <LoadingSpinner text="Loading bookings..." />

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">
        — Your trips
      </span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm py-16 text-center">
          <p className="text-muted text-sm">
            You haven&apos;t booked any properties yet.
          </p>
        </div>
      ) : (
        <div className="border border-line rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                {/* ✅ UPDATED COLUMN */}
                <th className="text-left px-4 py-3 font-medium">Property</th>

                <th className="text-left px-4 py-3 font-medium">
                  Booking Date
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Amount Paid
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Booking Status
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  Payment Status
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-line">

                  {/* ✅ UPDATED ROW WITH IMAGE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {booking.propertyImage ? (
                        <img
                          src={booking.propertyImage}
                          alt={booking.propertyTitle}
                          style={{
                            width: '50px',
                            height: '50px',
                            minWidth: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#E3E8E5',
                            borderRadius: '4px'
                          }}
                        />
                      )}

                      <span className="font-medium text-ink">
                        {booking.propertyTitle}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-ink">
                    ${booking.amount}
                  </td>

                  <td className="px-4 py-3">
                    <span className={statusBadge(booking.bookingStatus)}>
                      {booking.bookingStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={statusBadge(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </span>
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

export default MyBookings