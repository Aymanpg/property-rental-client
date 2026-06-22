"use client"

import Link from 'next/link'

const PaymentSuccess = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 bg-clay/10 text-clay rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
      <h1 className="font-display italic text-3xl text-ink mt-6">Booking confirmed!</h1>
      <p className="text-muted mt-2">Your payment was successful. The owner will review your booking shortly.</p>

      <div className="flex gap-3 justify-center mt-8">
        <Link
          href="/dashboard/tenant/bookings"
          className="px-6 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
        >
          View my bookings
        </Link>
        <Link
          href="/properties"
          className="px-6 py-3 border border-line text-sm font-medium rounded-sm hover:border-ink transition-colors"
        >
          Browse more
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess