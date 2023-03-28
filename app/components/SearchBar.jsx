import { useState } from 'react'

export default function SearchBar() {
  const [message, setMessage] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searcValue, setSearcValue] = useState('')
  return (
    <div className="relative mt-5">
      <input
        value={searcValue}
        onChange={(e) => {
          setMessage('')
          setLoading(true)
          setSearcValue(e.target.value)
          if (e.target.value.length > 0) {
            fetch('/api/search', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                text: e.target.value,
              }),
            })
              .then((res) => {
                if (!res.ok) throw new Error(res.statusText)
                else return res.json()
              })
              .then((res) => {
                setLoading(false)
                if (res && res.data) {
                  setResults(res['data'])
                }
                if (res && res.e) {
                  setMessage(res.e)
                }
              })
              .catch((e) => {
                setLoading(false)
                setMessage(e.message)
              })
          }
        }}
        placeholder="Search Posts..."
        className="w-full rounded-lg border bg-white py-2 px-5 text-sm outline-none dark:border-gray-600 dark:bg-black"
      />
      {searcValue.length > 0 && (
        <div className={`top-10 mt-2 shadow ${message.length > 0 ? 'p-5' : ''} `}>
          {message.length > 0 && <span className="py-1 text-sm">{message}</span>}
          {message.length < 1 &&
            loading &&
            new Array(5).fill(0).map((_, item) => (
              <a href={item} key={item}>
                <div className="mt-5 flex flex-col border-t">
                  <span className="text-md animate-pulse bg-gray-300 py-5 px-5 font-bold"></span>
                  <span className="mt-3 animate-pulse bg-gray-300 py-3 px-5 text-sm"></span>
                </div>
              </a>
            ))}
          {message.length < 1 &&
            results.length > 0 &&
            results.map((item) => (
              <a key={item.slug} href={`/blog/${item.slug}`}>
                <div className="flex flex-col border-t py-3 px-5">
                  <span className="text-md py-1 font-bold">{item.content.title}</span>
                  <span className="py-1 text-sm">{item.content.intro}</span>
                </div>
              </a>
            ))}
        </div>
      )}
    </div>
  )
}
