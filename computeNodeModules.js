async function exec() {
  const fs = require('fs')
  const { nodeFileTrace } = require('@vercel/nft')
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
  packages = Object.keys(packages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = packages[key]
      return obj
    }, {})
  // Write to file for layer0.config.js
  fs.writeFileSync('./toInclude.json', JSON.stringify(packages, null, 2), 'utf-8')
}

exec()
