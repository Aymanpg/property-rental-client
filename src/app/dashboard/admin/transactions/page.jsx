"use client"
import LoadingSpinner from '../../../../components/LoadingSpinner'
import { useState, useEffect } from 'react'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'

const Transactions = () => {
  const axiosSecure = useAxiosSecure()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/payments/admin/all')
      .then(res => setTransactions(res.data))
      .catch(err => console.log('Error:', err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading transactions..." />

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-clay">— Records</span>
      <h1 className="font-display italic text-3xl text-ink mt-1 mb-8">Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-muted text-sm">No transactions yet.</p>
      ) : (
        <>
          {/* Table — desktop only (1024px and up) */}
          <div className="hidden lg:block border border-line rounded-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink text-paper">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Transaction ID</th>
                  <th className="text-left px-4 py-3 font-medium">Property</th>
                  <th className="text-left px-4 py-3 font-medium">Tenant</th>
                  <th className="text-left px-4 py-3 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-t border-line hover:bg-moss/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted max-w-[140px] truncate">
                      {t.transactionId}
                    </td>
                    <td className="px-4 py-3 text-ink font-medium max-w-[160px] truncate">
                      {t.propertyTitle}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink">{t.tenantName}</p>
                      <p className="text-xs text-muted">{t.tenantEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink">{t.ownerName}</p>
                      <p className="text-xs text-muted">{t.ownerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-ink font-semibold">${t.amount}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile and tablet (below 1024px) */}
          <div className="lg:hidden space-y-3">
            {transactions.map((t) => (
              <div key={t._id} className="border border-line rounded-sm p-4">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <p className="font-mono text-xs text-muted truncate min-w-0">
                    {t.transactionId}
                  </p>
                  <p className="text-ink font-semibold shrink-0">${t.amount}</p>
                </div>

                <p className="text-ink font-medium mb-3 truncate">{t.propertyTitle}</p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Tenant</p>
                    <p className="text-sm text-ink truncate">{t.tenantName}</p>
                    <p className="text-xs text-muted truncate">{t.tenantEmail}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">Owner</p>
                    <p className="text-sm text-ink truncate">{t.ownerName}</p>
                    <p className="text-xs text-muted truncate">{t.ownerEmail}</p>
                  </div>
                </div>

                <p className="text-xs text-muted pt-2 border-t border-line">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Transactions