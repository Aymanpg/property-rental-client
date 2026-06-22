import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— 404</span>
      <h1 className="font-display italic text-6xl md:text-8xl text-ink mt-3">Lost?</h1>
      <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-ink text-paper text-sm font-semibold rounded-sm hover:bg-clay transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/properties"
          className="px-6 py-3 border border-line text-sm font-medium rounded-sm hover:border-ink transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    </div>
  )
}

export default NotFound