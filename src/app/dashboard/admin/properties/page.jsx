"use client"

import { useState, useEffect } from 'react'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../../components/LoadingSpinner'

const AdminProperties = () => {
  const axiosSecure = useAxiosSecure()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectModal, setRejectModal] = useState(null)
  const [feedback, setFeedback] = useState('')

  const fetchProperties = async () => {
    try {
      const res = await axiosSecure.get('/properties/admin/all')
      setProperties(res.data)
    } catch (error) {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/properties/${id}/status`, { status: 'approved' })
      toast.success('Property approved!')
      fetchProperties()
    } catch (error) {
      toast.error('Failed to approve property')
    }
  }

  const openRejectModal = (id) => {
    setRejectModal(id)
    setFeedback('')
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error('Please provide rejection feedback')
      return
    }
    try {
      await axiosSecure.patch(`/properties/${rejectModal}/status`, {
        status: 'rejected',
        rejectionFeedback: feedback
      })
      toast.success('Property rejected')
      setRejectModal(null)
      fetchProperties()
    } catch (error) {
      toast.error('Failed to reject property')
    }
  }

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
      rejected: 'bg-red-100 text-red-700'
    }
    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${styles[status]}`
  }

  if (loading) return <LoadingSpinner text="Loading properties..." />

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Moderate</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">All Properties</h1>

      {properties.length === 0 ? (
        <p className="text-muted text-sm">No properties submitted yet.</p>
      ) : (
        <div className="border border-line rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Owner</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Rent</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink font-medium max-w-[200px] truncate">{property.title}</td>
                  <td className="px-4 py-3 text-muted">{property.ownerEmail}</td>
                  <td className="px-4 py-3 text-muted">{property.location}</td>
                  <td className="px-4 py-3 text-ink">${property.rent}/{property.rentType}</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge(property.status)}>{property.status}</span>
                    {property.status === 'rejected' && property.rejectionFeedback && (
                      <button
                        title={property.rejectionFeedback}
                        className="ml-2 text-xs text-muted hover:text-ink"
                      >
                        👁️
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {property.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(property._id)}
                          className="px-3 py-1.5 bg-clay text-paper text-xs font-medium rounded-sm hover:bg-clay-dark transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {property.status !== 'rejected' && (
                        <button
                          onClick={() => openRejectModal(property._id)}
                          className="px-3 py-1.5 border border-line text-xs font-medium rounded-sm hover:border-ink transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="px-3 py-1.5 text-red-600 text-xs font-medium hover:underline"
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

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 px-6">
          <div className="bg-paper rounded-sm p-6 w-full max-w-md">
            <h3 className="font-display text-xl text-ink mb-3">Rejection feedback</h3>
            <p className="text-sm text-muted mb-3">Explain why this property is being rejected. The owner will see this.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="e.g. Photos are unclear, missing required details..."
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
              >
                Confirm rejection
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="px-5 py-2.5 border border-line text-sm font-medium rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProperties