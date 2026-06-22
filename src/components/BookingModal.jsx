"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast'

const BookingModal = ({ property, onClose }) => {
  const { user, dbUser } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    moveInDate: '',
    contactNumber: '',
    additionalNotes: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContinueToPayment = (e) => {
    e.preventDefault()

    if (!formData.moveInDate || !formData.contactNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    const bookingDraft = {
      propertyId: property._id,
      propertyTitle: property.title,
      propertyLocation: property.location || '',
      propertyImage: property.images?.[0] || '',

      tenantEmail: user.email,
      tenantName: dbUser?.name || user.displayName || '',
      tenantPhoto: dbUser?.photo || user.photoURL || '',

      ownerEmail: property.ownerEmail,

      moveInDate: formData.moveInDate,
      contactNumber: formData.contactNumber,
      additionalNotes: formData.additionalNotes,

      amount: property.rent
    }

    sessionStorage.setItem(
      'bookingDraft',
      JSON.stringify(bookingDraft)
    )

    router.push('/payment')
  }

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 px-6">
      <div className="bg-paper rounded-sm p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display italic text-2xl text-ink">
            Book this property
          </h3>

          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-muted mb-5">
          {property.title}
        </p>

        <form
          onSubmit={handleContinueToPayment}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">
              Move-in Date
            </label>

            <input
              type="date"
              name="moveInDate"
              required
              value={formData.moveInDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">
              Contact Number
            </label>

            <input
              type="tel"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+880 1XXX XXXXXX"
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">
              Additional Notes
            </label>

            <textarea
              name="additionalNotes"
              rows={3}
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Anything the owner should know..."
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
            />
          </div>

          <div className="pt-2 border-t border-line">
            <div className="flex justify-between text-sm mb-4 pt-3">
              <span className="text-muted">
                Booking fee
              </span>

              <span className="text-ink font-semibold">
                ${property.rent}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
            >
              Continue to payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal