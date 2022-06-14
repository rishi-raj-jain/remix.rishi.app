const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_YEAR = 365 * ONE_DAY

const { publicPaths } = require('./publicPaths')
const { Router } = require('@layer0/core/router')

const pageCache = {
  edge: {
    maxAgeSeconds: ONE_HOUR,
    forcePrivateCaching: true,
  },
  browser: {
    serviceWorkerSeconds: ONE_HOUR,
  },
}

const assetCache = {
  edge: {
    maxAgeSeconds: ONE_YEAR,
    forcePrivateCaching: true,
  },
  browser: {
    serviceWorkerSeconds: ONE_YEAR,
  },
}

const router = new Router()

publicPaths.forEach((i) => {
  router.get(i, ({ cache, serveStatic }) => {
    cache(assetCache)
    serveStatic(`public/${i}`)
  })
})

router
  .match('/', ({ cache }) => {
    cache(pageCache)
  })
  .match('/about', ({ cache }) => {
    cache(pageCache)
  })
  .match('/blogs', ({ cache }) => {
    cache(pageCache)
  })
  .match('/blog/:file', ({ cache }) => {
    cache(pageCache)
  })
  .match('/styles/:file', ({ cache, serveStatic }) => {
    cache(assetCache)
    serveStatic('public/styles/:file')
  })
  .match('/fonts/:file', ({ cache, serveStatic }) => {
    cache(assetCache)
    serveStatic('public/fonts/:file')
  })
  .match('/build/:path*', ({ cache }) => {
    cache(assetCache)
  })
  .match('/l0-storyblok/:path*', ({ cache, proxy }) => {
    cache(assetCache)
    proxy('storyblok', { path: ':path*' })
  })
  .match('/l0-image/:path*', ({ cache, proxy }) => {
    cache(assetCache)
    proxy('image', { path: ':path*' })
  })
  .fallback(({ renderWithApp }) =>
    renderWithApp({
      transformResponse: (res) => {
        res.body = res.body
          .toString()
          .replace(/https:\/\/a\.storyblok\.com\//g, '/l0-storyblok/')
          .replace(/https:\/\/rishi\-raj\-jain\-html\-og\-image\-default\.layer0\.link\//g, '/l0-image/')
      },
    })
  )

export default router
