"use client"

import { useState, useEffect } from 'react'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../../components/LoadingSpinner'
const AllUsers = () => {
  const axiosSecure = useAxiosSecure()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    axiosSecure.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.log('Error:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role })
      toast.success(`Role updated to ${role}`)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const roleBadge = (role) => {
    const styles = {
      admin: 'bg-clay/15 text-clay',
      owner: 'bg-moss/20 text-moss',
      tenant: 'bg-line text-muted'
    }
    return `px-2.5 py-1 rounded-sm text-xs font-mono uppercase tracking-wide ${styles[role] || ''}`
  }

  if (loading) return <LoadingSpinner text="Loading users..." />

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Manage</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">All Users</h1>

      <div className="border border-line rounded-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-line hover:bg-moss/5 transition-colors">
                 <td className="px-4 py-3">
  <div className="flex items-center gap-3">
    {user.photo ? (
      <img
        src={user.photo}
        alt={user.name || 'User'}
        className="w-10 h-10 rounded-full object-cover border border-line shrink-0"
        style={{ minWidth: '40px', maxWidth: '40px', minHeight: '40px', maxHeight: '40px' }}
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-clay/20 text-clay flex items-center justify-center text-sm font-semibold shrink-0">
        {user.name?.charAt(0).toUpperCase()}
      </div>
    )}
    <span className="font-medium text-ink">{user.name}</span>
  </div>
</td>



                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={roleBadge(user.role)}>{user.role}</span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="px-3 py-1.5 border border-line rounded-sm text-xs bg-paper focus:outline-none focus:border-clay"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllUsers