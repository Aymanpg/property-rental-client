"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../../components/LoadingSpinner'

const Favorites = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = () => {
    if (!user?.email) return
    axiosSecure
      .get(`/favorites/${user.email}`)
      .then(res => setFavorites(res.data))
      .catch(err => console.log('Error fetching favorites:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleRemove = async (id) => {
    try {
      await axiosSecure.delete(`/favorites/${id}`)
      toast.success('Removed from favorites')
      fetchFavorites()
    } catch (error) {
      toast.error('Failed to remove')
    }
  }

  const PropertyThumb = ({ fav, size = 50 }) => (
    fav.propertyImage ? (
      <img
        src={fav.propertyImage}
        alt={fav.propertyTitle}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />
    ) : (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          backgroundColor: '#E3E8E5',
          borderRadius: '4px'
        }}
      />
    )
  )

  if (loading) return <LoadingSpinner text="Loading favorites..." />

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">
        — Saved
      </span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">
        Favorites
      </h1>

      {favorites.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm py-16 text-center">
          <p className="text-muted text-sm">
            No favorites yet. Browse properties and save the ones you like.
          </p>
        </div>
      ) : (
        <>
          {/* Table — desktop only (1024px and up) */}
          <div className="hidden lg:block border border-line rounded-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink text-paper">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Property</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Rent</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {favorites.map((fav) => (
                  <tr key={fav._id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PropertyThumb fav={fav} size={50} />

                        <Link
                          href={`/properties/${fav.propertyId}`}
                          className="font-medium text-ink hover:text-clay transition-colors"
                        >
                          {fav.propertyTitle}
                        </Link>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted">{fav.propertyLocation}</td>

                    <td className="px-4 py-3 text-ink">
                      ${fav.rent}/{fav.rentType}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(fav._id)}
                        className="text-red-600 text-xs font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile and tablet (below 1024px) */}
          <div className="lg:hidden space-y-3">
            {favorites.map((fav) => (
              <div key={fav._id} className="border border-line rounded-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <PropertyThumb fav={fav} size={56} />

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/properties/${fav.propertyId}`}
                      className="font-medium text-ink hover:text-clay transition-colors block truncate"
                    >
                      {fav.propertyTitle}
                    </Link>
                    <p className="text-sm text-muted truncate">{fav.propertyLocation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-ink font-semibold">
                    ${fav.rent}/{fav.rentType}
                  </p>

                  <button
                    onClick={() => handleRemove(fav._id)}
                    className="text-red-600 text-xs font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favorites