import React, { useState } from 'react'

// Common categories shown as pills. Keep them small and readable.
const CATEGORIES = ['technology', 'business', 'sports', 'health', 'science', 'general']

export default function Header({ onSearch, onCategory, activeCategory }) {
  const [query, setQuery] = useState('')

  function submit(e) {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <div className="mb-4">
      <form onSubmit={submit} className="flex gap-3 items-center">
        <div className="relative flex-1">
          {/* search icon inside the input */}
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"></circle></svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search news..."
            aria-label="Search news"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">Search</button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => { onCategory(''); setQuery('') }}
          className={`px-3 py-1 rounded-full text-sm ${activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >All</button>
        {CATEGORIES.map(name => (
          <button
            key={name}
            onClick={() => onCategory(name)}
            className={`px-3 py-1 rounded-full text-sm ${activeCategory === name ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >{name.charAt(0).toUpperCase() + name.slice(1)}</button>
        ))}
      </div>
    </div>
  )
}
