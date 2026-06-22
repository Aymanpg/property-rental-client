"use client"

import { useEffect } from 'react'
import Link from 'next/link'

const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— Error</span>
      <h1 className="font-display italic text-5xl md:text-6xl text-ink mt-3">Something went wrong</h1>
      <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
        An unexpected error occurred. Please try again or go back to home.
      </p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={reset}
          className="px-6 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-line text-sm font-medium rounded-sm hover:border-ink transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Error