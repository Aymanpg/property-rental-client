"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import useAxiosSecure from '../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const ReviewSection = ({ propertyId }) => {
  const { user, dbUser } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchReviews = () => {
    axios.get(`${apiUrl}/reviews/${propertyId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.log('Error fetching reviews:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (propertyId) fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    try {
      setSubmitting(true)
      await axiosSecure.post('/reviews', {
        propertyId,
        tenantEmail: user.email,
        tenantName: dbUser?.name || user.displayName,
        tenantPhoto: dbUser?.photo || user.photoURL || '',
        rating,
        comment
      })
      toast.success('Review submitted!')
      setComment('')
      setRating(5)
      fetchReviews()
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-10 pt-8 border-t border-line">
      <h2 className="font-display text-xl text-ink mb-5">Reviews ({reviews.length})</h2>

      {user && (
        <form onSubmit={handleSubmitReview} className="border border-line rounded-sm p-5 mb-6">
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-2">Your rating</label>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-clay' : 'text-line'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience..."
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border border-line rounded-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display text-ink">{review.tenantName}</span>
                  <span className="text-xs text-muted">{review.tenantEmail}</span>
                </div>
                <span className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-0.5 text-clay text-sm mb-1.5">
                {Array.from({ length: review.rating }).map((_, idx) => <span key={idx}>★</span>)}
              </div>
              <p className="text-sm text-ink/80">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewSection