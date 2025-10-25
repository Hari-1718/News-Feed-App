import React from 'react'

// Single article card. Keep the rendering simple and predictable.
export default function ArticleCard({ article }) {
  const { title, description, image, url, source } = article || {}

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden card-hover">
      {image ? (
        <img src={image} alt={title || 'Article image'} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          {/* simple placeholder icon when image is missing */}
          <svg className="w-12 h-12 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
          {/* Source name shown as a small badge */}
          <span className="ml-2 provider-badge">{(source && source.name) || 'Unknown'}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{description}</p>

        <div className="mt-3 flex items-center justify-between">
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium">Read</a>
        </div>
      </div>
    </article>
  )
}
