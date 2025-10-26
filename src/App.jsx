import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import ArticleCard from './components/ArticleCard'
import ThemeToggle from './components/ThemeToggle'
import logo from './components/assets/newsfeedlogo.svg'
// Read API key from environment (Vite exposes VITE_* variables)
// If no env var is set, fall back to the provided key so the app fetches live articles.
const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || 'fad1ee003f9541a39dfa0c8cd864d833'
const PAGE_SIZE = 8
const DEFAULT_QUERY = 'latest'

// Simple helper to map NewsAPI/GNews objects to the shape our UI expects
function mapToArticle(item, provider = 'gnews') {
  if (!item) return null
  if (provider === 'newsapi') {
    return {
      title: item.title,
      description: item.description || item.content,
      image: item.urlToImage,
      url: item.url,
      source: item.source || { name: (item.source && item.source.name) || '' }
    }
  }
  // default: gnews
  return {
    title: item.title,
    description: item.description || item.content,
    image: item.image,
    url: item.url,
    source: item.source || { name: (item.source && item.source.name) || '' }
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [providerUsed, setProviderUsed] = useState(null)

  // Reset results when the query or category changes
  useEffect(() => {
    setArticles([])
    setPage(1)
  }, [query, category])

  useEffect(() => {
    let cancelled = false

    async function fetchGNews(q, cat, p) {
      const base = 'https://gnews.io/api/v4/search'
      const params = new URLSearchParams()
      const searchTerm = q ? q : (cat ? cat : DEFAULT_QUERY)
      params.set('q', searchTerm)
      params.set('lang', 'en')
      params.set('max', PAGE_SIZE)
      params.set('page', String(p))
      params.set('token', API_KEY)
      const url = `${base}?${params.toString()}`
      const res = await fetch(url)
      const data = await res.json()
      return { res, data }
    }

    async function fetchNewsApi(q, cat, p) {
      const base = 'https://newsapi.org/v2/everything'
      const params = new URLSearchParams()
      const searchTerm = q ? q : (cat ? cat : DEFAULT_QUERY)
      params.set('q', searchTerm)
      params.set('language', 'en')
      params.set('pageSize', PAGE_SIZE)
      params.set('page', String(p))
      params.set('apiKey', API_KEY)
      const url = `${base}?${params.toString()}`
      const res = await fetch(url)
      const data = await res.json()
      return { res, data }
    }

    async function load() {
      setLoading(true)
      setError(null)

      // API key is provided (either via env var or hardcoded fallback). Proceed to fetch live articles.

      try {
        // Try GNews first
        const { res, data } = await fetchGNews(query, category, page)

        // If GNews says the key is invalid, try NewsAPI (user may have provided a NewsAPI key)
        if (res.status === 401 || (data && data.errors && data.errors[0] && String(data.errors[0]).toLowerCase().includes('invalid'))) {
          const fallback = await fetchNewsApi(query, category, page)
          if (!fallback.res.ok) throw new Error(fallback.data.message || `NewsAPI error ${fallback.res.status}`)
          if (cancelled) return
          const mapped = (fallback.data.articles || []).map(item => mapToArticle(item, 'newsapi'))
          setArticles(prev => (page === 1 ? mapped : [...prev, ...mapped]))
          setHasMore(mapped.length === PAGE_SIZE)
          setProviderUsed('NewsAPI')
          return
        }

        if (!res.ok) throw new Error(data.message || `GNews error ${res.status}`)
        if (cancelled) return
        const mapped = (data.articles || []).map(item => mapToArticle(item, 'gnews'))
        setArticles(prev => (page === 1 ? mapped : [...prev, ...mapped]))
        setHasMore(mapped.length === PAGE_SIZE)
        setProviderUsed('GNews')
      } catch (err) {
        if (cancelled) return
        setError(err && err.message ? err.message : 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [query, category, page])

  function handleSearch(text) {
    setQuery(text || '')
  }

  function handleCategory(name) {
    setCategory(name || '')
    setQuery('')
  }

  function loadMore() {
    setPage(p => p + 1)
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="News Feed" className="h-10 w-10 rounded-md shadow-sm" />
          <div>
            <h1 className="text-2xl font-semibold">News Feed</h1>
            {providerUsed && (
              <div className="text-xs text-gray-500">Source: <span className="provider-badge">{providerUsed}</span></div>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <ThemeToggle />
        </div>
      </div>

      <Header onSearch={handleSearch} onCategory={handleCategory} activeCategory={category} />

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {articles.length === 0 && loading && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="spinner" aria-hidden="true"></div>
          <div className="text-gray-600 dark:text-gray-300">Loading articles...</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {articles.map((a, idx) => (
          <ArticleCard key={`${a.url || idx}-${idx}`} article={a} />
        ))}
      </div>

      {loading && articles.length > 0 && (
        <div className="mt-6 text-center">Loading more...</div>
      )}

      {!loading && hasMore && (
        <div className="mt-8 text-center">
          <button onClick={loadMore} className="px-4 py-2 bg-blue-600 text-white rounded">Load more</button>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No articles found.</div>
      )}
    </div>
  )
}
