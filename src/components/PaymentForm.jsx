"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import useAxiosSecure from '../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const cardStyle = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: '15px',
      color: '#0F2818',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#dc2626' },
  },
}

const PaymentForm = ({ bookingDraft }) => {
  const stripe = useStripe()
  const elements = useElements()
  const axiosSecure = useAxiosSecure()
  const router = useRouter()

  const [clientSecret, setClientSecret] = useState('')
  const [processing, setProcessing] = useState(false)
  const [cardError, setCardError] = useState('')

  useEffect(() => {
    if (!bookingDraft?.amount) return
    axiosSecure.post('/payments/create-intent', { amount: bookingDraft.amount })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => console.log('Error creating payment intent:', err.message))
  }, [bookingDraft, axiosSecure])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setProcessing(true)
    setCardError('')

    const card = elements.getElement(CardElement)

    const { error: methodError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (methodError) {
      setCardError(methodError.message)
      setProcessing(false)
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: bookingDraft.tenantName,
          email: bookingDraft.tenantEmail,
        },
      },
    })

    if (confirmError) {
      setCardError(confirmError.message)
      setProcessing(false)
      return
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const bookingRes = await axiosSecure.post('/bookings', {
          propertyId: bookingDraft.propertyId,
          propertyTitle: bookingDraft.propertyTitle,
          propertyLocation: bookingDraft.propertyLocation,
          tenantEmail: bookingDraft.tenantEmail,
          tenantName: bookingDraft.tenantName,
          ownerEmail: bookingDraft.ownerEmail,
          moveInDate: bookingDraft.moveInDate,
          contactNumber: bookingDraft.contactNumber,
          additionalNotes: bookingDraft.additionalNotes,
          amount: bookingDraft.amount,
          paymentStatus: 'paid'
        })

        await axiosSecure.post('/payments/save-transaction', {
          transactionId: paymentIntent.id,
          propertyId: bookingDraft.propertyId,
          propertyTitle: bookingDraft.propertyTitle,
          tenantEmail: bookingDraft.tenantEmail,
          tenantName: bookingDraft.tenantName,
          ownerEmail: bookingDraft.ownerEmail,
          ownerName: bookingDraft.ownerEmail,
          amount: bookingDraft.amount,
          bookingId: bookingRes.data._id
        })

        sessionStorage.removeItem('bookingDraft')
        toast.success('Booking confirmed!')
        router.push('/payment/success')
      } catch (error) {
        toast.error('Payment succeeded but booking failed to save. Contact support.')
      }
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-line rounded-sm p-4">
        <CardElement options={cardStyle} />
      </div>

      {cardError && (
        <div className="px-4 py-3 bg-clay/10 border border-clay/30 text-clay text-sm rounded-sm">
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
      >
        {processing ? 'Processing...' : `Pay $${bookingDraft.amount}`}
      </button>

      <p className="text-xs text-muted text-center">
        Test card: 4242 4242 4242 4242, any future date, any CVC
      </p>
    </form>
  )
}

export default PaymentForm