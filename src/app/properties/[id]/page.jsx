"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import BookingModal from '../../../components/BookingModal'
import ReviewSection from '../../../components/ReviewSection'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const PropertyDetails = () => {
  const { id } = useParams()
  const router = useRouter()
  const { user, dbUser, loading: authLoading } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!id) return
    axios.get(`${apiUrl}/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.log('Error fetching property:', err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    axiosSecure.get(`/favorites/${user.email}`)
      .then(res => {
        const exists = res.data.some(f => f.propertyId === id)
        setIsFavorite(exists)
      })
      .catch(err => console.log('Error checking favorites:', err.message))
  }, [user, id, axiosSecure])

  const handleToggleFavorite = async () => {
    if (!property) return
    try {
      if (isFavorite) {
        const res = await axiosSecure.get(`/favorites/${user.email}`)
        const fav = res.data.find(f => f.propertyId === id)
        if (fav) {
          await axiosSecure.delete(`/favorites/${fav._id}`)
          setIsFavorite(false)
          toast.success('Removed from favorites')
        }
      } else {
        await axiosSecure.post('/favorites', {
          tenantEmail: user.email,
          propertyId: id,
          propertyTitle: property.title,
          propertyLocation: property.location,
          propertyImage: property.images?.[0] || '',
          rent: property.rent,
          rentType: property.rentType
        })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (authLoading || loading) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-muted text-sm">Loading...</div>
  }

  if (!property) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-muted text-sm">Property not found.</div>
  }

  const isTenant = dbUser?.role === 'tenant'

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <Link href="/properties" className="text-sm text-muted hover:text-ink">
        ← Back to properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">

        {/* Left side */}
        <div className="lg:col-span-2">

          {/* Image */}
          <div className="h-96 bg-moss/10 rounded-sm overflow-hidden">
            {property.images?.length > 0 ? (
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                No image available
              </div>
            )}
          </div>

          {property.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-sm overflow-hidden border-2 ${
                    activeImage === idx ? 'border-clay' : 'border-line'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <span className="font-mono text-xs uppercase text-clay">
              {property.propertyType}
            </span>

            <h1 className="font-display italic text-3xl text-ink mt-1">
              {property.title}
            </h1>

            <p className="text-muted mt-1">{property.location}</p>

            <div className="flex flex-wrap gap-4 mt-5 text-sm">
              <span className="px-3 py-1.5 border border-line rounded-sm">
                {property.bedrooms} Bedrooms
              </span>
              <span className="px-3 py-1.5 border border-line rounded-sm">
                {property.bathrooms} Bathrooms
              </span>
              {property.propertySize && (
                <span className="px-3 py-1.5 border border-line rounded-sm">
                  {property.propertySize} sq ft
                </span>
              )}
            </div>

            <h2 className="font-display text-xl mt-8 mb-2">Description</h2>
            <p className="text-sm leading-relaxed text-ink/80">
              {property.description}
            </p>

            {property.amenities?.length > 0 && (
              <>
                <h2 className="font-display text-xl mt-8 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-moss/10 text-sm rounded-sm"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {property.extraFeatures && (
              <>
                <h2 className="font-display text-xl mt-8 mb-2">
                  Extra Features
                </h2>
                <p className="text-sm leading-relaxed text-ink/80">
                  {property.extraFeatures}
                </p>
              </>
            )}

            {/* Reviews - ONLY TENANT */}
            {isTenant && <ReviewSection propertyId={id} />}
          </div>
        </div>

        {/* Right side */}
        <div>
          <div className="border-2 border-ink rounded-sm p-6 sticky top-24">
            <p className="text-3xl font-display">
              ${property.rent}
              <span className="text-base text-muted">/{property.rentType}</span>
            </p>

            {/* Book button */}
            {isTenant && (
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full mt-5 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
              >
                Book Property
              </button>
            )}

            {/* Favorite button */}
            {isTenant && (
              <button
                onClick={handleToggleFavorite}
                className={`w-full mt-3 py-3 border text-sm font-semibold rounded-sm transition-colors ${
                  isFavorite
                    ? 'border-clay text-clay bg-clay/10'
                    : 'border-line text-ink hover:border-ink'
                }`}
              >
                {isFavorite ? '♥ Saved to favorites' : '♡ Add to Favorites'}
              </button>
            )}

            <div className="mt-6 pt-5 border-t text-sm text-muted">
              <p>Listed by</p>
              <p className="text-ink font-medium mt-0.5">
                {property.ownerInfo?.name || 'Property owner'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal - ONLY TENANT */}
      {isTenant && bookingModalOpen && (
        <BookingModal
          property={property}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  )
}

export default PropertyDetails