// Serverless proxy to fetch news from GNews or NewsAPI securely on the server
// This avoids CORS / plan restrictions when calling GNews from the browser.

module.exports = async function handler(req, res) {
  try {
    const { provider = 'gnews', q = '', cat = '', page = '1' } = req.query || {}
    const PAGE_SIZE = 8

    const searchTerm = q ? q : (cat ? cat : 'latest')

    // Read API keys from server environment variables
    const GNEWS_KEY = process.env.VITE_GNEWS_API_KEY || process.env.GNEWS_API_KEY
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY || process.env.VITE_NEWSAPI_KEY

    if (provider === 'newsapi') {
      if (!NEWSAPI_KEY) {
        res.statusCode = 400
        res.setHeader('content-type', 'application/json')
        return res.end(JSON.stringify({ message: 'Missing NewsAPI key' }))
      }
      const params = new URLSearchParams()
      params.set('q', searchTerm)
      params.set('language', 'en')
      params.set('pageSize', String(PAGE_SIZE))
      params.set('page', String(page))
      params.set('apiKey', NEWSAPI_KEY)
      const url = `https://newsapi.org/v2/everything?${params.toString()}`
      const upstream = await fetch(url)
      const text = await upstream.text()
      res.statusCode = upstream.status
      res.setHeader('content-type', upstream.headers.get('content-type') || 'application/json')
      return res.end(text)
    }

    // default: GNews
    if (!GNEWS_KEY) {
      res.statusCode = 400
      res.setHeader('content-type', 'application/json')
      return res.end(JSON.stringify({ message: 'Missing GNews API key' }))
    }
    const params = new URLSearchParams()
    params.set('q', searchTerm)
    params.set('lang', 'en')
    params.set('max', String(PAGE_SIZE))
    params.set('page', String(page))
    params.set('token', GNEWS_KEY)
    const url = `https://gnews.io/api/v4/search?${params.toString()}`
    const upstream = await fetch(url)
    const text = await upstream.text()
    res.statusCode = upstream.status
    res.setHeader('content-type', upstream.headers.get('content-type') || 'application/json')
    return res.end(text)
  } catch (err) {
    console.error('api/news error', err)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    return res.end(JSON.stringify({ message: err.message || 'Server error' }))
  }
}
