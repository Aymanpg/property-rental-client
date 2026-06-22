"use client"

import { useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, dbUser } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: dbUser?.name || '',
    photo: dbUser?.photo || ''
  })
  const [saving, setSaving] = useState(false)

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
    <div className="max-w-lg">
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Account</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">My Profile</h1>

      <div className="border border-line rounded-sm p-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-line">
          {(editing ? formData.photo : dbUser?.photo) ? (
            <img
              src={editing ? formData.photo : dbUser?.photo}
              alt="Profile"
              style={{ width: '80px', height: '80px', minWidth: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E3E8E5' }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', minWidth: '80px', borderRadius: '50%', backgroundColor: 'rgba(27,77,62,0.15)', color: '#1B4D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '600' }}>
              {(dbUser?.name || user?.displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-display text-xl text-ink">{dbUser?.name || user?.displayName}</p>
            <p className="text-sm text-muted">{dbUser?.email || user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-1 bg-clay/10 text-clay text-xs font-mono uppercase tracking-wide rounded-sm">
              {dbUser?.role}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Photo URL</label>
              <input
                type="text"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay"
              />
            </div>
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
                className="px-5 py-2.5 border border-line text-sm font-medium rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted font-mono uppercase tracking-wide">Name</p>
              <p className="text-ink mt-0.5">{dbUser?.name || user?.displayName}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-mono uppercase tracking-wide">Email</p>
              <p className="text-ink mt-0.5">{dbUser?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-mono uppercase tracking-wide">Role</p>
              <p className="text-ink capitalize mt-0.5">{dbUser?.role}</p>
            </div>
            <button
              onClick={() => {
                setFormData({ name: dbUser?.name || '', photo: dbUser?.photo || '' })
                setEditing(true)
              }}
              className="mt-3 px-5 py-2.5 border border-ink text-sm font-semibold rounded-sm hover:bg-ink hover:text-paper transition-colors"
            >
              Edit profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile