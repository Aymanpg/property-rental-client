"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useAxiosSecure from '../../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const UpdateProperty = () => {
  const { id } = useParams()
  const router = useRouter()
  const axiosSecure = useAxiosSecure()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'apartment',
    rent: '',
    rentType: 'monthly',
    bedrooms: '',
    bathrooms: '',
    propertySize: '',
    amenities: '',
    images: '',
    extraFeatures: '',
  })

  useEffect(() => {
    if (!id) return
    axiosSecure.get(`/properties/${id}`)
      .then(res => {
        const p = res.data
        setFormData({
          title: p.title || '',
          description: p.description || '',
          location: p.location || '',
          propertyType: p.propertyType || 'apartment',
          rent: p.rent || '',
          rentType: p.rentType || 'monthly',
          bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '',
          propertySize: p.propertySize || '',
          amenities: p.amenities?.join(', ') || '',
          images: p.images?.join(', ') || '',
          extraFeatures: p.extraFeatures || '',
        })
      })
      .catch(() => toast.error('Failed to load property'))
      .finally(() => setLoading(false))
  }, [id, axiosSecure])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axiosSecure.put(`/properties/${id}`, {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
      })
      toast.success('Property updated!')
      router.push('/dashboard/owner/my-properties')
    } catch (error) {
      toast.error('Failed to update property')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-line border-t-clay rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl">
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Edit listing</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">Update property</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Property Title</label>
          <input
            type="text" name="title" required value={formData.title} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Description</label>
          <textarea
            name="description" required rows={4} value={formData.description} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Location</label>
            <input
              type="text" name="location" required value={formData.location} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Property Type</label>
            <select
              name="propertyType" value={formData.propertyType} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm bg-paper focus:outline-none focus:border-clay"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="office">Office</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Rent</label>
            <input
              type="number" name="rent" required value={formData.rent} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Rent Type</label>
            <select
              name="rentType" value={formData.rentType} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm bg-paper focus:outline-none focus:border-clay"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Bedrooms</label>
            <input
              type="number" name="bedrooms" required value={formData.bedrooms} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Bathrooms</label>
            <input
              type="number" name="bathrooms" required value={formData.bathrooms} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Size (sq ft)</label>
            <input
              type="text" name="propertySize" value={formData.propertySize} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Amenities (comma separated)</label>
          <input
            type="text" name="amenities" value={formData.amenities} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Image URLs (comma separated)</label>
          <input
            type="text" name="images" value={formData.images} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Extra Features</label>
          <textarea
            name="extraFeatures" rows={2} value={formData.extraFeatures} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/owner/my-properties')}
            className="px-6 py-3 border border-line text-sm font-medium rounded-sm hover:border-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProperty