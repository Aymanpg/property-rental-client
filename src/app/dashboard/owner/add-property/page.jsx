"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const AddProperty = () => {
  const { dbUser, user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        propertyType: formData.propertyType,
        rent: Number(formData.rent),
        rentType: formData.rentType,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        propertySize: formData.propertySize,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
        extraFeatures: formData.extraFeatures,
        status: 'pending',
        ownerInfo: {
          name: dbUser?.name || user?.displayName,
          email: dbUser?.email || user?.email,
          photo: dbUser?.photo || user?.photoURL,
        },
        ownerEmail: dbUser?.email || user?.email,
      }

      await axiosSecure.post('/properties', payload)
      toast.success('Property submitted for review!')
      router.push('/dashboard/owner/my-properties')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— New listing</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">Add a property</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Property Title</label>
          <input
            type="text" name="title" required value={formData.title} onChange={handleChange}
            placeholder="Cozy 2-bedroom apartment in Banani"
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Description</label>
          <textarea
            name="description" required rows={4} value={formData.description} onChange={handleChange}
            placeholder="Describe the property..."
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Location</label>
            <input
              type="text" name="location" required value={formData.location} onChange={handleChange}
              placeholder="Dhaka"
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
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Rent (Price)</label>
            <input
              type="number" name="rent" required value={formData.rent} onChange={handleChange}
              placeholder="500"
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
              placeholder="2"
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Bathrooms</label>
            <input
              type="number" name="bathrooms" required value={formData.bathrooms} onChange={handleChange}
              placeholder="1"
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Size (sq ft)</label>
            <input
              type="text" name="propertySize" value={formData.propertySize} onChange={handleChange}
              placeholder="900"
              className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Amenities (comma separated)</label>
          <input
            type="text" name="amenities" value={formData.amenities} onChange={handleChange}
            placeholder="WiFi, Parking, Air Conditioning"
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Image URLs (comma separated)</label>
          <input
            type="text" name="images" value={formData.images} onChange={handleChange}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
          />
          <p className="mt-1.5 text-xs text-muted">Tip: use free stock photo links (e.g. from Unsplash) for testing</p>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Extra Features</label>
          <textarea
            name="extraFeatures" rows={2} value={formData.extraFeatures} onChange={handleChange}
            placeholder="Anything else worth mentioning..."
            className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit for review'}
        </button>
      </form>
    </div>
  )
}

export default AddProperty