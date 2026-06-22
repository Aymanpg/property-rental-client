"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const OwnerHome = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [stats, setStats] = useState({ earnings: 0, properties: 0, bookings: 0 })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) return

    const fetchData = async () => {
      try {
        const [propertiesRes, bookingsRes, transactionsRes] = await Promise.all([
          axiosSecure.get(`/properties/owner/${user.email}`),
          axiosSecure.get(`/bookings/owner/${user.email}`),
          axiosSecure.get(`/payments/owner/${user.email}`)
        ])

        const properties = propertiesRes.data
        const bookings = bookingsRes.data
        const transactions = transactionsRes.data

        const totalEarnings = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
        const confirmedBookings = bookings.filter(b => b.bookingStatus === 'approved').length

        setStats({
          earnings: totalEarnings,
          properties: properties.length,
          bookings: confirmedBookings
        })

        // Build last 12 months earnings
        const now = new Date()
        const months = []
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            label: d.toLocaleString('default', { month: 'short' }),
            earnings: 0
          })
        }

        transactions.forEach(t => {
          const d = new Date(t.createdAt)
          const key = `${d.getFullYear()}-${d.getMonth()}`
          const month = months.find(m => m.key === key)
          if (month) month.earnings += t.amount || 0
        })

        setChartData(months)
      } catch (error) {
        console.log('Error fetching analytics:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, axiosSecure])

  if (loading) {
    return <p className="text-muted text-sm">Loading analytics...</p>
  }

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Overview</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="border border-line rounded-sm p-6">
          <p className="text-xs font-mono uppercase tracking-wide text-muted">Total Earnings</p>
          <p className="font-display text-3xl text-ink mt-2">${stats.earnings}</p>
        </div>
        <div className="border border-line rounded-sm p-6">
          <p className="text-xs font-mono uppercase tracking-wide text-muted">Total Properties</p>
          <p className="font-display text-3xl text-ink mt-2">{stats.properties}</p>
        </div>
        <div className="border border-line rounded-sm p-6">
          <p className="text-xs font-mono uppercase tracking-wide text-muted">Total Bookings</p>
          <p className="font-display text-3xl text-ink mt-2">{stats.bookings}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-line rounded-sm p-6">
        <h2 className="font-display text-lg text-ink mb-5">Monthly Earnings (last 12 months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E5" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#5C6B61' }} />
            <YAxis tick={{ fontSize: 12, fill: '#5C6B61' }} />
            <Tooltip
              contentStyle={{ borderRadius: '4px', border: '1px solid #E3E8E5', fontSize: '13px' }}
            />
            <Line type="monotone" dataKey="earnings" stroke="#1B4D3E" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OwnerHome