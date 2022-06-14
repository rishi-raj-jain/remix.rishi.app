const fs = require('fs')
const { nodeFileTrace } = require('@vercel/nft')
const { DeploymentBuilder } = require('@layer0/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

const rewire = require('rewire')
const { exit } = require('process')
const esbuild = rewire('esbuild')

const pkgAndSubpathForCurrentPlatform = esbuild.__get__('pkgAndSubpathForCurrentPlatform')

module.exports = async function build(options) {
  // Clear the previous output
  builder.clearPreviousBuildOutput()

  try {
    // Build the Remix App as is
    let command = 'npm run build'
    await builder.exec(command)

    // Compile the service worker
    build({
      entryPoints: ['./service-worker.js'],
      outfile: './public/service-worker.js',
      minify: true,
      bundle: true,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
        'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
      },
    }).catch(() => process.exit(1))

    // Conpute the public paths for router
    command = 'node getPublicPaths.js'
    await builder.exec(command)

    // Determine the node_modules to include
    let dictNodeModules = await getNodeModules()
    Object.keys(dictNodeModules).forEach(async (i) => {
      try {
        await builder.addJSAsset(`${appDir}/${i}`)
      } catch (e2) {
        console.log(e2)
        exit()
      }
    })

    // Build the project as is with Layer0
    await builder.build()

    // Get the package slug
    const { pkg } = pkgAndSubpathForCurrentPlatform()

    const remixNodeModulesFolder = `${builder.layer0Dir}/lambda/node_modules/@remix-run/dev/node_modules/`
    if (fs.existsSync(remixNodeModulesFolder)) {
      // Find all the folders and delete the ones that are not the platform-specific binary
      fs.readdir(remixNodeModulesFolder, (err, files) => {
        if (files) {
          files.forEach((file) => {
            if (file.includes('esbuild-') && !file.includes(pkg)) {
              console.log(`Deleting the folder: ${remixNodeModulesFolder}${file}`)
              fs.rmSync(`${remixNodeModulesFolder}${file}`, { recursive: true, force: true })
            }
          })
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}

async function getNodeModules() {
  // The whole app inside index.js
  const files = ['./build/index.js']
  // Compute file trace
  const { fileList } = await nodeFileTrace(files)
  // Store set of packages
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
  // Sort the set of packages
  return Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key]
      return obj
    }, {})
}
