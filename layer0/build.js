const fs = require('fs')
const { DeploymentBuilder } = require('@layer0/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  // Clear the previous output
  builder.clearPreviousBuildOutput()
  // Build the project as is
  await builder.build()
  // Get the package slug
  const { pkg } = pkgAndSubpathForCurrentPlatform()
  const remixNodeModulesFolder = `${builder.layer0Dir}/lambda/node_modules/@remix-run/dev/node_modules/`
  if (remixNodeModulesFolder) {
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
}

const os = require('os')

const knownWindowsPackages = {
  'win32 arm64 LE': 'esbuild-windows-arm64',
  'win32 ia32 LE': 'esbuild-windows-32',
  'win32 x64 LE': 'esbuild-windows-64',
}

const knownUnixlikePackages = {
  'android arm64 LE': 'esbuild-android-arm64',
  'darwin arm64 LE': 'esbuild-darwin-arm64',
  'darwin x64 LE': 'esbuild-darwin-64',
  'freebsd arm64 LE': 'esbuild-freebsd-arm64',
  'freebsd x64 LE': 'esbuild-freebsd-64',
  'linux arm LE': 'esbuild-linux-arm',
  'linux arm64 LE': 'esbuild-linux-arm64',
  'linux ia32 LE': 'esbuild-linux-32',
  'linux mips64el LE': 'esbuild-linux-mips64le',
  'linux ppc64 LE': 'esbuild-linux-ppc64le',
  'linux riscv64 LE': 'esbuild-linux-riscv64',
  'linux s390x BE': 'esbuild-linux-s390x',
  'linux x64 LE': 'esbuild-linux-64',
  'netbsd x64 LE': 'esbuild-netbsd-64',
  'openbsd x64 LE': 'esbuild-openbsd-64',
  'sunos x64 LE': 'esbuild-sunos-64',
}

const knownWebAssemblyFallbackPackages = {
  'android x64 LE': 'esbuild-android-64',
}

function pkgAndSubpathForCurrentPlatform() {
  let pkg = '',
    subpath = '',
    isWASM = ''

  // Computing the platform for the specific esbuild
  let platformKey = `${process.platform} ${os.arch()} ${os.endianness()}`

  if (platformKey in knownWindowsPackages) {
    pkg = knownWindowsPackages[platformKey]
    subpath = 'esbuild.exe'
  } else if (platformKey in knownUnixlikePackages) {
    pkg = knownUnixlikePackages[platformKey]
    subpath = 'bin/esbuild'
  } else if (platformKey in knownWebAssemblyFallbackPackages) {
    pkg = knownWebAssemblyFallbackPackages[platformKey]
    subpath = 'bin/esbuild'
    isWASM = true
  } else {
    throw new Error(`Unsupported platform: ${platformKey}`)
  }

  // Get the pkg slug
  return { pkg, subpath, isWASM }
}
