import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'
import { install } from '@layer0/prefetch/window'

hydrate(<RemixBrowser />, document)

install()
