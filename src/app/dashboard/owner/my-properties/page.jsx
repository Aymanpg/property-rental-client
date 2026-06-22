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
        <div className="border border-line rounded-sm overflow-x-auto">
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
                <tr
                  key={property._id}
                  className="border-t border-line"
                >
                  {/* Property Image */}
                  <td className="px-4 py-3">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        style={{
                          width: '60px',
                          height: '60px',
                          minWidth: '60px',
                          maxWidth: '60px',
                          minHeight: '60px',
                          maxHeight: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
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
                    )}
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 text-ink font-medium max-w-[220px] truncate">
                    {property.title}
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3 text-muted">
                    {property.location}
                  </td>

                  {/* Rent */}
                  <td className="px-4 py-3 text-ink">
                    ${property.rent}/{property.rentType}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={statusBadge(property.status)}>
                      {property.status}
                    </span>

                    {property.status === 'rejected' &&
                      property.rejectionFeedback && (
                        <button
                          onClick={() =>
                            setFeedbackModal(
                              property.rejectionFeedback
                            )
                          }
                          title="View rejection feedback"
                          className="ml-2 text-xs hover:opacity-70"
                        >
                          👁️
                        </button>
                      )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/owner/update-property/${property._id}`
                          )
                        }
                        className="text-clay text-xs font-medium hover:underline"
                      >
                        Update
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(property._id)
                        }
                        className="text-red-600 text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 px-6">
          <div className="bg-paper rounded-sm p-6 w-full max-w-md">
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