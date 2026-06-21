"use client"

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const AllPropertiesContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || ''
  })

  const fetchProperties = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.location) params.set('location', filters.location)
      if (filters.propertyType) params.set('propertyType', filters.propertyType)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.sort) params.set('sort', filters.sort)
      params.set('page', page)
      params.set('limit', 9)

      const res = await axios.get(`${apiUrl}/properties?${params.toString()}`)
      setProperties(res.data.properties)
      setTotalPages(res.data.totalPages)
      setCurrentPage(res.data.page)
    } catch (error) {
      console.log('Error fetching properties:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.location) params.set('location', filters.location)
    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.sort) params.set('sort', filters.sort)
    router.push(`/properties?${params.toString()}`)
  }

  const goToPage = (page) => {
    fetchProperties(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">

      <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">— Browse</span>
      <h1 className="font-display italic text-4xl text-ink mt-2 mb-8">All Properties</h1>

      {/* Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="border-2 border-ink rounded-lg p-4 mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3"
      >
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          className="px-4 py-2.5 border border-line rounded-md text-sm focus:outline-none focus:border-clay"
        />
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleFilterChange}
          className="px-4 py-2.5 border border-line rounded-md text-sm bg-paper focus:outline-none focus:border-clay"
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
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="px-4 py-2.5 border border-line rounded-md text-sm focus:outline-none focus:border-clay"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="px-4 py-2.5 border border-line rounded-md text-sm focus:outline-none focus:border-clay"
        />
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="px-4 py-2.5 border border-line rounded-md text-sm bg-paper focus:outline-none focus:border-clay"
        >
          <option value="">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 bg-ink text-paper text-sm font-semibold rounded-md hover:bg-clay transition-colors"
        >
          Apply
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-sm border border-line bg-moss/5 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm py-20 text-center">
          <p className="text-muted text-sm">No properties match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
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
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 text-sm font-medium rounded-sm transition-colors ${
                      currentPage === page
                        ? 'bg-ink text-paper'
                        : 'border border-line text-ink hover:border-ink'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const AllProperties = () => {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-14 text-muted text-sm">Loading...</div>}>
      <AllPropertiesContent />
    </Suspense>
  )
}

export default AllProperties