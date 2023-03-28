const { join } = require('path')
const { watchFile } = require('fs')
const { createDevServer } = require('@edgio/core/dev')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const SW_SRC = join(appDir, 'sw', 'service-worker.js')
const SW_DEST = join(appDir, '.edgio', 'temp', 'service-worker.js')

function BUILD_SW() {
  try {
    new DeploymentBuilder().buildServiceWorker(SW_SRC, SW_DEST, false)
  } catch (e) {}
}

module.exports = function () {
  BUILD_SW()
  watchFile(SW_SRC, (curr, prev) => {
    BUILD_SW()
  })
  return createDevServer({
    label: 'Remix',
    command: (port) => {
      process.env.PORT = port.toString()
      return `npm run dev`
    },
    ready: [/Local/i],
  })
}
