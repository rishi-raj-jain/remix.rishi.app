import { Router } from '@edgio/core/router'

const router = new Router()

router.static('public')

router.match(
  {
    path: '/:path*',
    query: {
      _data: /routes%2F.*/,
    },
  },
  ({ cache }) => {
    cache({
      edge: {
        maxAgeSeconds: 1,
        staleWhileRevalidateSeconds: 60 * 60 * 24 * 365,
      },
    })
  }
)

router.match('/service-worker.js', ({ serviceWorker }) => {
  serviceWorker('.edgio/temp/service-worker.js')
})

router.fallback(({ renderWithApp }) => {
  renderWithApp()
})

export default router
