"use client"

import useAuth from '../../../../hooks/useAuth'

const Profile = () => {
  const { dbUser, user } = useAuth()
  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Account</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-6">Profile</h1>
      <div className="border border-line rounded-sm p-6 max-w-md">
        <p className="text-sm text-muted">Name</p>
        <p className="text-ink font-medium mb-3">{dbUser?.name || user?.displayName}</p>
        <p className="text-sm text-muted">Email</p>
        <p className="text-ink font-medium mb-3">{dbUser?.email || user?.email}</p>
        <p className="text-sm text-muted">Role</p>
        <p className="text-ink font-medium capitalize">{dbUser?.role}</p>
      </div>
    </div>
  )
}

export default Profile