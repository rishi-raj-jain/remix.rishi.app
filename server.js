const path = require('path')
const express = require('express')
const { createRequestHandler } = require('@remix-run/express')

const app = express()
const BUILD_DIR = path.join(process.cwd(), 'build')

if (process.env.NODE_ENV === 'development') {
  app.use(express.static('public'))
}

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) =>
        createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next)
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
