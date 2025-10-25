# News Feed App

A small, human-friendly React app that fetches news (supports GNews and NewsAPI keys).

What I changed to make code more human-readable

- Clearer function and variable names (e.g. `fetchGNews`, `fetchNewsApi`, `mapToArticle`).
- Short comments explaining purpose and edge-cases.
- Simpler error messages and safe checks when data is missing.
- CSS improvements for a modern look (Inter font, card hover, spinner).

How to run

1. Copy `.env.example` to `.env` and add your API key:

```powershell
cp .env.example .env
# Then edit .env and set VITE_GNEWS_API_KEY=<your_key>
```

2. Install dependencies and start dev server:

```powershell
npm install --legacy-peer-deps
npm run dev
```

3. Open http://localhost:5173/ in your browser.

Notes
- If your key is for NewsAPI (newsapi.org) the app will automatically fall back to it if GNews rejects the key.
- `.env` is in `.gitignore` — don't commit your API key.
- If you'd like the code to be even more "hand-written" (longer comments, different naming style, more helper functions), tell me the style and I'll refactor further.
