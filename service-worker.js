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
        callback: deepFetchImage,
      },
      {
        selector: 'script',
        maxMatches: 20,
        attribute: 'src',
        as: 'script',
        callback: deepFetchJS,
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
  var urlTemplate = $(el).attr('href')
  console.log($(el), urlTemplate)
  if (urlTemplate) {
    console.log(`\n[][][][]\nPrefetching Asset: ${urlTemplate}\n[][][][]\n`)
    prefetch(urlTemplate, 'style')
  }
}

function deepFetchJS({ $el, el, $ }) {
  var urlTemplate = $(el).attr('src')
  console.log($(el), urlTemplate)
  if (urlTemplate) {
    console.log(`\n[][][][]\nPrefetching JS: ${urlTemplate}\n[][][][]\n`)
    prefetch(urlTemplate, 'script')
  }
}

function deepFetchImage({ $el, el, $ }) {
  var urlTemplate = $(el).attr('src')
  console.log($(el), urlTemplate)
  if (urlTemplate) {
    console.log(`\n[][][][]\nPrefetching Image: ${urlTemplate}\n[][][][]\n`)
    prefetch(urlTemplate, 'image')
  }
}
