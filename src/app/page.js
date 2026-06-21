"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Home = () => {
  const router = useRouter()

  const [search, setSearch] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  })

  const [featured, setFeatured] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    axios.get(`${apiUrl}/properties/featured`)
      .then(res => setFeatured(res.data))
      .catch(err => console.log('Error loading featured properties:', err.message))
      .finally(() => setLoadingFeatured(false))

    axios.get(`${apiUrl}/reviews`)
      .then(res => setReviews(res.data))
      .catch(err => console.log('Error loading reviews:', err.message))
  }, [])

  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (search.location) params.set('location', search.location)
    if (search.propertyType) params.set('propertyType', search.propertyType)
    if (search.minPrice) params.set('minPrice', search.minPrice)
    if (search.maxPrice) params.set('maxPrice', search.maxPrice)

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-paper border-[12px] border-ink">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 relative z-10">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-mono text-xs uppercase tracking-[0.25em] text-clay mb-5"
          >
            — Find your next address
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display italic text-5xl md:text-6xl lg:text-7xl leading-tight text-ink max-w-3xl"
          >
            Renting, made honest and simple.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-muted max-w-xl text-base leading-relaxed"
          >
            Browse verified listings, book securely online, and skip the
            back-and-forth. Built for tenants and property owners alike.
          </motion.p>

          {/* Search Section */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="mt-12 bg-paper border-2 border-ink rounded-lg p-4 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">

              <input
                type="text"
                name="location"
                value={search.location}
                onChange={handleSearchChange}
                placeholder="Location"
                className="w-full px-4 py-3 rounded-md border border-line text-ink focus:outline-none focus:border-clay"
              />

              <select
                name="propertyType"
                value={search.propertyType}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-md border border-line text-ink bg-paper focus:outline-none focus:border-clay"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="office">Office</option>
              </select>

              <input
                type="number"
                name="minPrice"
                value={search.minPrice}
                onChange={handleSearchChange}
                placeholder="Min Price"
                className="w-full px-4 py-3 rounded-md border border-line text-ink focus:outline-none focus:border-clay"
              />

              <input
                type="number"
                name="maxPrice"
                value={search.maxPrice}
                onChange={handleSearchChange}
                placeholder="Max Price"
                className="w-full px-4 py-3 rounded-md border border-line text-ink focus:outline-none focus:border-clay"
              />

              <button
                type="submit"
                className="w-full px-6 py-3 bg-ink text-paper font-semibold rounded-md hover:bg-clay transition duration-300"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>

        {/* Decorative Blur */}
        <div className="absolute -right-24 -bottom-24 w-[420px] h-[420px] rounded-full bg-moss/30 blur-3xl" />
        <div className="absolute -left-24 -top-24 w-[300px] h-[300px] rounded-full bg-clay/20 blur-3xl" />
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— Handpicked for you</span>
            <h2 className="font-display italic text-3xl md:text-4xl text-ink mt-2">Featured Properties</h2>
          </div>
          <Link
            href="/properties"
            className="hidden md:inline-block px-5 py-2.5 border border-ink text-sm font-semibold rounded-sm hover:bg-ink hover:text-paper transition-colors"
          >
            View all
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-sm border border-line bg-moss/5 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="border border-dashed border-line rounded-sm py-16 text-center">
            <p className="text-muted text-sm">No properties listed yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property, i) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border border-line rounded-sm overflow-hidden hover:border-ink transition-colors group"
              >
                <div className="h-48 bg-moss/10 overflow-hidden">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-clay">{property.propertyType}</span>
                  <h3 className="font-display text-lg text-ink mt-1 truncate">{property.title}</h3>
                  <p className="text-sm text-muted mt-1">{property.location}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-ink font-semibold">
                      ${property.rent}
                      <span className="text-muted font-normal text-sm">/{property.rentType}</span>
                    </span>
                    <Link
                      href={`/properties/${property._id}`}
                      className="text-sm font-medium text-clay hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Link
          href="/properties"
          className="md:hidden mt-8 block w-full text-center px-5 py-3 border border-ink text-sm font-semibold rounded-sm"
        >
          View all properties
        </Link>
      </section>

      {/* Why Choose Us */}
      <section className="bg-ink text-paper py-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-moss">— Why RentEase</span>
          <h2 className="font-display italic text-3xl md:text-4xl mt-2 max-w-xl">A marketplace built on trust, not guesswork.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: 'Verified listings',
                desc: 'Every property is reviewed by our team before it goes live, so what you see is what you get.'
              },
              {
                title: 'Secure payments',
                desc: 'Booking fees are processed through Stripe — encrypted, traceable, and refund-friendly.'
              },
              {
                title: 'Direct communication',
                desc: 'Message owners and track booking status in one place, no scattered emails or calls.'
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-t border-paper/15 pt-5"
              >
                <span className="font-mono text-xs text-clay">0{i + 1}</span>
                <h3 className="font-display text-xl mt-2">{item.title}</h3>
                <p className="text-paper/65 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— From our tenants</span>
        <h2 className="font-display italic text-3xl md:text-4xl text-ink mt-2 mb-10">What people are saying</h2>

        {reviews.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Aisha R.', comment: 'Booking was seamless and the listing matched exactly what was advertised. Highly recommend.', rating: 5 },
              { name: 'Tomas B.', comment: 'Loved how transparent the whole process was — from search to payment, everything just worked.', rating: 5 },
              { name: 'Priya N.', comment: 'Found a great apartment within days. Communication with the owner was smooth throughout.', rating: 4 },
              { name: 'Daniel K.', comment: 'The review system gave me confidence before booking. Will definitely use RentEase again.', rating: 5 }
            ].map((r, i) => (
              <div key={i} className="border border-line rounded-sm p-6">
                <div className="flex gap-1 text-clay mb-3">
                  {Array.from({ length: r.rating }).map((_, idx) => <span key={idx}>★</span>)}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed">&quot;{r.comment}&quot;</p>
                <p className="font-display text-ink mt-4">{r.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0, 4).map((review) => (
              <div key={review._id} className="border border-line rounded-sm p-6">
                <div className="flex gap-1 text-clay mb-3">
                  {Array.from({ length: review.rating }).map((_, idx) => <span key={idx}>★</span>)}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed">&quot;{review.comment}&quot;</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-display text-ink">{review.tenantName}</p>
                  <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extra Section 1: Top Locations */}
      <section className="bg-moss/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— Trending now</span>
          <h2 className="font-display italic text-3xl md:text-4xl text-ink mt-2 mb-10">Top locations tenants are searching</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna'].map((city, i) => (
              <button
                key={city}
                onClick={() => router.push(`/properties?location=${city}`)}
                className="bg-paper border border-line rounded-sm p-6 text-left hover:border-ink transition-colors"
              >
                <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                <h3 className="font-display text-xl text-ink mt-2">{city}</h3>
                <span className="text-clay text-sm font-medium mt-1 inline-block">Explore →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 2: Rental Statistics */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— By the numbers</span>
        <h2 className="font-display italic text-3xl md:text-4xl text-ink mt-2 mb-10">RentEase at a glance</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1,200+', label: 'Verified listings' },
            { value: '850+', label: 'Bookings completed' },
            { value: '40+', label: 'Cities covered' },
            { value: '4.8★', label: 'Average rating' }
          ].map((stat) => (
            <div key={stat.label} className="border-t-2 border-ink pt-4">
              <p className="font-display italic text-4xl text-ink">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <h2 className="font-display italic text-3xl md:text-4xl max-w-md">
            Have a place to rent out? List it in minutes.
          </h2>
          <Link
            href="/register"
            className="px-7 py-3.5 bg-clay text-paper font-semibold rounded-sm hover:bg-clay-dark transition-colors whitespace-nowrap"
          >
            Become an owner
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home