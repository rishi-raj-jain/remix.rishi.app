const fs = require('fs')
const { join } = require('path')
const { nodeFileTrace } = require('@vercel/nft')
const { DeploymentBuilder } = require('@edgio/core/deploy')

const appDir = process.cwd()
const SW_SRC = join(appDir, 'sw', 'service-worker.js')
const SW_DEST = join(appDir, '.edgio', 'temp', 'service-worker.js')

module.exports = async function build() {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  try {
    await builder.exec('npm run build')
    builder.buildServiceWorker(SW_SRC, SW_DEST, false)
    let dictNodeModules = await getNodeModules(['./server.js'])
    Object.keys(dictNodeModules).forEach(async (i) => {
      try {
        await builder.addJSAsset(`${appDir}/${i}`)
      } catch (e) {
        console.log(e.message || e.toString())
      }
    })
    await builder.build()
    await cleanBinaries(builder)
  } catch (e) {
    console.log(e.message || e.toString())
  }
}

async function getNodeModules(files) {
  const { fileList } = await nodeFileTrace(files)
  let packages = {}
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '')
      temp = temp.substring(0, temp.indexOf('/'))
      packages[`node_modules/${temp}`] = true
    } else {
      packages[i] = true
    }
  })
  return Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key]
      return obj
    }, {})
}

async function cleanBinaries(builder) {
  const rewire = require('rewire')
  const pkgAndSubpathForCurrentPlatform = rewire('esbuild').__get__('pkgAndSubpathForCurrentPlatform')
  const { pkg } = pkgAndSubpathForCurrentPlatform()
  const remixNodeModulesFolder = `${builder.layer0Dir}/lambda/node_modules/@remix-run/dev/node_modules/`
  if (fs.existsSync(remixNodeModulesFolder)) {
    fs.readdir(remixNodeModulesFolder, (err, files) => {
      if (files) {
        files.forEach((file) => {
          if (file.includes('esbuild-') && !file.includes(pkg)) {
            fs.rmSync(`${remixNodeModulesFolder}${file}`, { recursive: true, force: true })
          }
        })
      }
    })
  }
}
