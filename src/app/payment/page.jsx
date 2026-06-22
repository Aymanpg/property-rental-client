"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StripeProvider from '../../components/StripeProvider'
import PaymentForm from '../../components/PaymentForm'

const Payment = () => {
  const router = useRouter()
  const [bookingDraft, setBookingDraft] = useState(null)

  useEffect(() => {
    const draft = sessionStorage.getItem('bookingDraft')
    if (!draft) {
      router.push('/properties')
      return
    }
    setBookingDraft(JSON.parse(draft))
  }, [router])

  if (!bookingDraft) {
    return <div className="max-w-xl mx-auto px-6 py-20 text-center text-muted text-sm">Loading...</div>
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Secure payment</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-2">Complete your booking</h1>
      <p className="text-muted text-sm mb-8">{bookingDraft.propertyTitle}</p>

      <div className="border border-line rounded-sm p-6 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Move-in date</span>
          <span className="text-ink">{bookingDraft.moveInDate}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">Contact</span>
          <span className="text-ink">{bookingDraft.contactNumber}</span>
        </div>
        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-line">
          <span className="text-muted">Amount due</span>
          <span className="text-ink font-semibold">${bookingDraft.amount}</span>
        </div>
      </div>

      <StripeProvider>
        <PaymentForm bookingDraft={bookingDraft} />
      </StripeProvider>
    </div>
  )
}

export default Payment