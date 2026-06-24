"use client"

import { useState, useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../../components/LoadingSpinner'
import { useRouter } from 'next/navigation'

const MyProperties = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const router = useRouter()

  const fetchProperties = () => {
    if (!user?.email) return

    axiosSecure
      .get(`/properties/owner/${user.email}`)
      .then((res) => setProperties(res.data))
      .catch((err) =>
        console.log('Error fetching properties:', err.message)
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      await axiosSecure.delete(`/properties/${id}`)
      toast.success('Property deleted')
      fetchProperties()
    } catch (error) {
      toast.error('Failed to delete property')
    }
  }

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-moss/20 text-moss',
      approved: 'bg-clay/15 text-clay',
      rejected: 'bg-red-100 text-red-700',
    }

    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${styles[status]}`
  }

  const PropertyThumb = ({ property, size = 60 }) => {
    const src = property.images?.[0]
    return src ? (
      <img
        src={src}
        alt={property.title}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          maxWidth: `${size}px`,
          minHeight: `${size}px`,
          maxHeight: `${size}px`,
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
    ) : (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          backgroundColor: '#E3E8E5',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          color: '#5C6B61',
        }}
      >
        No img
      </div>
    )
  }

  const ActionLinks = ({ property }) => (
    <div className="flex gap-3">
      <button
        onClick={() =>
          router.push(`/dashboard/owner/update-property/${property._id}`)
        }
        className="text-clay text-xs font-medium hover:underline"
      >
        Update
      </button>

      <button
        onClick={() => handleDelete(property._id)}
        className="text-red-600 text-xs font-medium hover:underline"
      >
        Delete
      </button>
    </div>
  )

  if (loading) {
    return <LoadingSpinner text="Loading properties..." />
  }

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">
        — Your listings
      </span>

      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">
        My Properties
      </h1>

      {properties.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm py-16 text-center">
          <p className="text-muted text-sm">
            You haven&apos;t listed any properties yet.
          </p>
        </div>
      ) : (
        <>
          {/* Table — desktop only (1024px and up) */}
          <div className="hidden lg:block border border-line rounded-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink text-paper">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Image</th>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Rent</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr key={property._id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <PropertyThumb property={property} size={60} />
                    </td>

                    <td className="px-4 py-3 text-ink font-medium max-w-[220px] truncate">
                      {property.title}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {property.location}
                    </td>

                    <td className="px-4 py-3 text-ink">
                      ${property.rent}/{property.rentType}
                    </td>

                    <td className="px-4 py-3">
                      <span className={statusBadge(property.status)}>
                        {property.status}
                      </span>

                      {property.status === 'rejected' &&
                        property.rejectionFeedback && (
                          <button
                            onClick={() =>
                              setFeedbackModal(property.rejectionFeedback)
                            }
                            title="View rejection feedback"
                            className="ml-2 text-xs hover:opacity-70"
                          >
                            👁️
                          </button>
                        )}
                    </td>

                    <td className="px-4 py-3">
                      <ActionLinks property={property} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile and tablet (below 1024px) */}
          <div className="lg:hidden space-y-3">
            {properties.map((property) => (
              <div key={property._id} className="border border-line rounded-sm p-4">
                <div className="flex items-start gap-3 mb-3">
                  <PropertyThumb property={property} size={56} />

                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium truncate">{property.title}</p>
                    <p className="text-sm text-muted truncate">{property.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-ink font-semibold">
                    ${property.rent}/{property.rentType}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={statusBadge(property.status)}>
                      {property.status}
                    </span>

                    {property.status === 'rejected' &&
                      property.rejectionFeedback && (
                        <button
                          onClick={() =>
                            setFeedbackModal(property.rejectionFeedback)
                          }
                          title="View rejection feedback"
                          className="text-xs hover:opacity-70"
                        >
                          👁️
                        </button>
                      )}
                  </div>
                </div>

                <div className="pt-3 border-t border-line">
                  <ActionLinks property={property} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rejection Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-paper rounded-sm p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl text-ink mb-3">
              Rejection Feedback
            </h3>

            <p className="text-sm text-ink/80 leading-relaxed">
              {feedbackModal}
            </p>

            <button
              onClick={() => setFeedbackModal(null)}
              className="mt-5 px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProperties