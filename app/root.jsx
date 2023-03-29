import { useEffect } from 'react'
import global from './global.css'
import styles from './tailwind.css'
import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'
import { themeChangeListener } from './lib/themeChangeListener.client'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

export const links = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: global },
]

export const meta = () => ({
  charset: 'utf-8',
  title: 'Rishi Raj Jain',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  useEffect(() => {
    if (window.localStorage.getItem('theme')) {
      themeChangeListener()
    } else {
      // Check the theme preferred in the window acc. to the zone
      const theme = (() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop),
        })
        if (typeof window !== 'undefined') {
          return params.mode ? params.mode : window.localStorage.getItem('theme') || 'light'
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark'
        }
        return 'light'
      })()
      // Set the theme as light / dark
      window.localStorage.setItem('theme', theme)
    }
    install()
    installDevtools()
  }, [])
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .hide-if-no-javascript {
                display: none;
              }`,
            }}
          ></style>
        </noscript>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
