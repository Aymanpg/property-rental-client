import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-paper/10">
          <div className="md:col-span-2">
            <span className="font-display italic text-3xl">RentEase</span>
            <p className="mt-4 text-sm text-paper/55 max-w-xs leading-relaxed">
              A transparent marketplace connecting tenants and property owners — find a place, list a place, book it securely.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-paper/40 mb-4">— Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-paper/75 hover:text-clay transition-colors">Home</Link></li>
              <li><Link href="/properties" className="text-paper/75 hover:text-clay transition-colors">All Properties</Link></li>
              <li><Link href="/register" className="text-paper/75 hover:text-clay transition-colors">List your property</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-paper/40 mb-4">— Account</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/login" className="text-paper/75 hover:text-clay transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-paper/75 hover:text-clay transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[11px] text-paper/40 tracking-wide">
          <span>© {new Date().getFullYear()} RENTEASE — ALL RIGHTS RESERVED</span>
          <span>MADE FOR TENANTS & OWNERS</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer