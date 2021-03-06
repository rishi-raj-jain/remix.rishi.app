import { precacheAndRoute } from 'workbox-precaching'
import { skipWaiting, clientsClaim } from 'workbox-core'
import { Prefetcher, prefetch } from '@layer0/prefetch/sw'
import DeepFetchPlugin from '@layer0/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: 'img',
        maxMatches: 20,
        attribute: 'src',
        as: 'image',
        callback: deepFetchAssets,
      },
      {
        selector: 'script',
        maxMatches: 20,
        attribute: 'src',
        as: 'script',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="stylesheet"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="preload"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
      {
        selector: '[rel="modulepreload"]',
        maxMatches: 20,
        attribute: 'href',
        as: 'style',
        callback: deepFetchAssets,
      },
    ]),
  ],
})
  .route()
  .cache(/^https:\/\/(.*?)\.com\/.*/)
  .cache(/^https:\/\/(.*?)\.net\/.*/)
  .cache(/^https:\/\/(.*?)\.app\/.*/)
  .cache(/^https:\/\/(.*?)\.link\/.*/)

function deepFetchAssets({ $el, el, $ }) {
  let urlTemplate = $(el).attr('href')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
  urlTemplate = $(el).attr('src')
  if (urlTemplate) {
    prefetch(urlTemplate)
  }
}
