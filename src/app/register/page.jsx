"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const Register = () => {
  const { registerUser, googleLogin } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: '',
    password: '',
    role: 'tenant'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { name, email, photo, password, role } = formData
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.')
      return
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter.')
      return
    }

    try {
      setLoading(true)
      await registerUser(name, email, password, photo, role)
      toast.success('Account created successfully!')
      router.push('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await googleLogin()
      toast.success('Logged in with Google!')
      router.push('/')
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-display italic text-4xl text-ink">Create an account</h1>
          <p className="mt-2 text-sm text-muted">Join RentEase as a tenant or property owner</p>
        </div>

        <div className="border border-line rounded-sm p-8 bg-paper">

          {error && (
            <div className="mb-5 px-4 py-3 bg-clay/10 border border-clay/30 text-clay text-sm rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Photo URL</label>
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-line rounded-sm text-sm focus:outline-none focus:border-clay transition-colors"
              />
              <p className="mt-1.5 text-xs text-muted">Min 6 characters, with uppercase & lowercase letters</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted mb-2">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tenant' })}
                  className={`px-4 py-3 rounded-sm border text-sm font-medium transition-colors ${
                    formData.role === 'tenant'
                      ? 'border-clay bg-clay text-paper'
                      : 'border-line text-muted hover:border-ink/30'
                  }`}
                >
                  Tenant
                  <span className="block text-[11px] font-normal mt-0.5 opacity-80">Find & book a place</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'owner' })}
                  className={`px-4 py-3 rounded-sm border text-sm font-medium transition-colors ${
                    formData.role === 'owner'
                      ? 'border-clay bg-clay text-paper'
                      : 'border-line text-muted hover:border-ink/30'
                  }`}
                >
                  Owner
                  <span className="block text-[11px] font-normal mt-0.5 opacity-80">List a property</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-line" />
            <span className="text-xs text-muted font-mono">OR</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-line rounded-sm text-sm font-medium hover:border-ink/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.96 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-3 text-[11px] text-muted text-center">Google sign-up joins you as a Tenant by default</p>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-clay font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register