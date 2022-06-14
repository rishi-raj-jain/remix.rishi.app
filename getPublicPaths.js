const fs = require('fs')

const getPublicRoutes = (publicFolderPath) => {
  const matchingRoutes = []
  // Check if the folder exists
  if (fs.existsSync(publicFolderPath)) {
  } else {
    publicFolderPath = `../../${publicFolderPath}`
  }
  if (fs.existsSync(publicFolderPath)) {
    console.log('Compiling public routes...', publicFolderPath)
    fs.readdirSync(publicFolderPath).forEach((file) => {
      const dirPath = `${publicFolderPath}/${file}`
      if (fs.lstatSync(dirPath).isDirectory()) {
        matchingRoutes.push(`/${file}/:path*`)
      } else {
        matchingRoutes.push(`/${file}`)
      }
    })
  }
  return matchingRoutes
}

fs.writeFile('./publicPaths.js', `export const publicPaths= ${JSON.stringify(getPublicRoutes('public'))}`, function (err) {
  if (err) {
    console.error('Crap happens')
  }
})
