import { Router } from '@edgio/core/router'

const router = new Router()

router.static('public')

router.match('/service-worker.js', ({ serviceWorker }) => {
  serviceWorker('.edgio/temp/service-worker.js')
})

router.fallback(({ renderWithApp }) => {
  renderWithApp()
})

export default router
