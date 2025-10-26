// Serverless proxy to fetch news from GNews or NewsAPI securely on the server
// This avoids CORS / plan restrictions when calling GNews from the browser.

export default async function handler(req, res) {
  try {
    const { provider = 'gnews', q = '', cat = '', page = '1' } = req.query || {}
    const PAGE_SIZE = 8

    const searchTerm = q ? q : (cat ? cat : 'latest')

    // Read API keys from server environment variables
    const GNEWS_KEY = process.env.VITE_GNEWS_API_KEY || process.env.GNEWS_API_KEY
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY || process.env.VITE_NEWSAPI_KEY

    if (provider === 'newsapi') {
      if (!NEWSAPI_KEY) return res.status(400).json({ message: 'Missing NewsAPI key' })
      const params = new URLSearchParams()
      params.set('q', searchTerm)
      params.set('language', 'en')
      params.set('pageSize', String(PAGE_SIZE))
      params.set('page', String(page))
      params.set('apiKey', NEWSAPI_KEY)
      const url = `https://newsapi.org/v2/everything?${params.toString()}`
      const upstream = await fetch(url)
      const data = await upstream.json()
      return res.status(upstream.status).json(data)
    }

    // default: GNews
    if (!GNEWS_KEY) return res.status(400).json({ message: 'Missing GNews API key' })
    const params = new URLSearchParams()
    params.set('q', searchTerm)
    params.set('lang', 'en')
    params.set('max', String(PAGE_SIZE))
    params.set('page', String(page))
    params.set('token', GNEWS_KEY)
    const url = `https://gnews.io/api/v4/search?${params.toString()}`
    const upstream = await fetch(url)
    const data = await upstream.json()
    return res.status(upstream.status).json(data)
  } catch (err) {
    console.error('api/news error', err)
    res.status(500).json({ message: err.message || 'Server error' })
  }
}
