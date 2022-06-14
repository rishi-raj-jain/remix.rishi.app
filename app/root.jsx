import styles from './tailwind.css'
import Navbar from './components/Navbar'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix'

export function meta() {
  return { title: 'New Remix App' }
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-display">
        <div className="transition-colors duration-200 bg-white dark:bg-black text-black dark:text-gray-200 font-display flex flex-col items-center">
          <Navbar />
          <div className="py-10 w-full max-w-[90vw] lg:max-w-[75vw] sm:px-10 flex flex-col">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        <link rel="stylesheet" href="/styles/font.css" />
        <link rel="stylesheet" href="/styles/dark.css" />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }) {
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>The whole just page crashed.</h1>
        <Scripts />
      </body>
    </html>
  )
}
