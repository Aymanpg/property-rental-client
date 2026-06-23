"use client"

import { useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, dbUser } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: dbUser?.name || '',
    photo: dbUser?.photo || ''
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await axiosSecure.put(`/users/${user.email}`, formData)
      toast.success('Profile updated!')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-clay">
          — Account
        </span>
        <h1 className="font-display italic text-4xl text-ink mt-1">
          My Profile
        </h1>
        <p className="text-sm text-muted mt-2">
          Manage your personal information and profile settings
        </p>
      </div>

      {/* Main Card */}
      <div className="border border-line rounded-sm bg-paper shadow-sm">

        {/* Top Profile Section */}
        <div className="flex items-center gap-6 p-6 border-b border-line bg-moss/5">

          {/* Avatar */}
          {editing ? (
            formData.photo ? (
              <img
                src={formData.photo}
                alt="Profile"
                className="w-20 h-20  object-cover border-2 border-line"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-clay/20 text-clay flex items-center justify-center text-2xl font-bold">
                {(dbUser?.name || user?.displayName || 'U')[0].toUpperCase()}
              </div>
            )
          ) : (
            dbUser?.photo ? (
              <img
                src={dbUser?.photo}
                alt="Profile"
                className="w-20 h-20  object-cover border-2 border-line"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-clay/20 text-clay flex items-center justify-center text-2xl font-bold">
                {(dbUser?.name || user?.displayName || 'U')[0].toUpperCase()}
              </div>
            )
          )}

          {/* Info */}
          <div className="flex-1">
            <h2 className="font-display text-2xl text-ink">
              {dbUser?.name || user?.displayName}
            </h2>
            <p className="text-sm text-muted">
              {dbUser?.email || user?.email}
            </p>

            <span className="inline-block mt-2 px-3 py-1 bg-clay/10 text-clay text-xs font-mono uppercase tracking-wide rounded-sm">
              {dbUser?.role}
            </span>
          </div>

          {/* Edit Button */}
          {!editing && (
            <button
              onClick={() => {
                setFormData({
                  name: dbUser?.name || '',
                  photo: dbUser?.photo || ''
                })
                setEditing(true)
              }}
              className="px-4 py-2 border border-line text-sm font-medium rounded-sm hover:border-ink hover:text-ink transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">

          {editing ? (
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
                  placeholder="https://..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 border border-line text-sm font-medium rounded-sm hover:bg-moss/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <p className="text-xs text-muted font-mono uppercase tracking-wide">
                  Name
                </p>
                <p className="text-ink mt-1 font-medium">
                  {dbUser?.name || user?.displayName}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted font-mono uppercase tracking-wide">
                  Email
                </p>
                <p className="text-ink mt-1">
                  {dbUser?.email || user?.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted font-mono uppercase tracking-wide">
                  Role
                </p>
                <p className="text-ink mt-1 capitalize">
                  {dbUser?.role}
                </p>
              </div>

              <div className="md:col-span-2 mt-2">
                <div className="p-4 border border-line rounded-sm bg-moss/5 text-sm text-muted">
                  Tip: Keep your profile updated so property owners can recognize you easily.
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Profile