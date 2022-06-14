import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'
import { install as installSW, prefetch } from '@layer0/prefetch/window'

hydrate(<RemixBrowser />, document)

installSW({
  watch: [
    {
      selector: 'a',
      callback: (el) => {
        if (!el.href.includes('https://')) {
          prefetch(el.href)
        }
      },
    },
    {
      selector: 'img',
      callback: (el) => {
        if (!el.src.includes('https://')) {
          prefetch(el.src)
        }
      },
    },
  ],
})
