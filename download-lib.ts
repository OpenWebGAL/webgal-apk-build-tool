import * as path from 'path'
import * as fs from 'fs/promises'
import fetch from 'node-fetch'
import extract from 'extract-zip'
import * as tar from 'tar'

type Platform = 'windows' | 'mac' | 'linux'

interface DownloadableFile {
  url: string
  fileName: string
}

const downloadFile = async (url: string, destPath: string): Promise<void> => {
  console.log(`Download ${url} to ${destPath}`)
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await fs.writeFile(destPath, buffer)
    console.log(`Successfully downloaded ${url} to ${destPath}`)
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error)
    throw error
  }
}

const ensureDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true })
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`Ensured directory exists: ${dirPath}`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      console.error(`Error ensuring directory ${dirPath}:`, error)
      throw error
    }
  }
}

const downloadJDK = async (destDir: string, platform: Platform): Promise<void> => {
  const jdkUrl = `https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.7%2B6/OpenJDK21U-jdk_x64_${platform}_hotspot_21.0.7_6.${platform === 'windows' ? 'zip' : 'tar.gz'}`
  const jdkFileName = `jdk-21.${platform === 'windows' ? 'zip' : 'tar.gz'}`
  const jdkDestPath = path.join(destDir, jdkFileName)

  await downloadFile(jdkUrl, jdkDestPath)

  if (platform === 'windows') {
    await extractZip(jdkDestPath, destDir)
  } else {
    await extractTarGz(jdkDestPath, destDir)
  }

  await fs.rename(path.join(destDir, `jdk-21.0.7+6`), path.join(destDir, 'jdk-21'))
  await fs.rm(jdkDestPath)
}

const downloadBuildTools = async (destDir: string, platform: Platform): Promise<void> => {
  const platformInUrl = (()=>{
    switch (platform) {
      case 'windows':
        return 'windows'
      case 'mac':
        return 'macosx'
      case 'linux':
        return 'linux'
      default:
        return 'windows'
    }
  })()
  const buildToolsUrl = `https://dl.google.com/android/repository/build-tools_r36_${platformInUrl}.zip`
  const buildToolsFileName = 'build-tools.zip'
  const buildToolsDestPath = path.join(destDir, buildToolsFileName)

  await downloadFile(buildToolsUrl, buildToolsDestPath)
  await extractZip(buildToolsDestPath, destDir)
  await fs.rename(path.join(destDir, 'android-16'), path.join(destDir, 'build-tools'))
  await fs.rm(buildToolsDestPath)
}

const extractZip = async (zipPath: string, destDir: string): Promise<void> => {
  try {
    await extract(zipPath, { dir: destDir })
    console.log('Extraction complete')
  } catch (error) {
    console.error('Error extracting zip:', error)
  }
}

const extractTarGz = async (tarGzPath: string, destDir: string): Promise<void> => {
  try {
    await tar.x({
      file: tarGzPath,
      cwd: destDir
    })
    console.log(`Extraction of ${tarGzPath} to ${destDir} complete.`)
  } catch (error) {
    console.error(`Error extracting tar.gz ${tarGzPath}:`, error)
    throw error
  }
}

const main = async (): Promise<void> => {
  let platform: Platform

  switch (process.platform) {
    case 'win32':
      platform = 'windows'
      console.log('Detected Platform:', platform)
      break
    case 'darwin':
      platform = 'mac'
      console.log('Detected Platform:', platform)
      break
    case 'linux':
      platform = 'linux'
      console.log('Detected Platform:', platform)
      break
    default:
      console.error('Unsupported operating system:', process.platform)
      process.exit(1)
  }

  const args = process.argv.slice(2)

  let libDir: string | null = null

  if (args.includes('--win')) {
    platform = 'windows'
  }
  if (args.includes('--mac')) {
    platform = 'mac'
  }
  if (args.includes('--linux')) {
    platform = 'linux'
  }

  switch (platform) {
    case 'windows':
      libDir = path.join(__dirname, 'dist', 'win-unpacked', 'lib')
      break
    case 'mac':
      libDir = path.join(__dirname, 'dist', 'mac-unpacked', 'Contents', 'lib')
      break
    case 'linux':
      libDir = path.join(__dirname, 'dist', 'linux-unpacked', 'lib')
      break
  }

  if (args.includes('--dev')) {
    console.log('Downloading for development')
    libDir = path.join(__dirname, 'node_modules', 'electron', 'dist', 'lib')
  }

  if (args.includes('--cli')) {
    libDir = path.join(__dirname, 'dist', 'cli', 'lib')
  }

  if (!libDir) {
    console.error('No lib dir specified')
    process.exit(1)
  }

  console.log('Downloading to:', libDir)

  await ensureDir(libDir)

  const files: DownloadableFile[] = [
    {
      url: 'https://github.com/REAndroid/APKEditor/releases/download/V1.4.3/APKEditor-1.4.3.jar',
      fileName: 'APKEditor.jar'
    },
    {
      url: 'https://github.com/OpenWebGAL/WebGAL-Android/releases/latest/download/webgal-template.apk',
      fileName: 'webgal-template.apk'
    }
  ]

  for (const file of files) {
    await downloadFile(file.url, path.join(libDir, file.fileName))
  }

  await downloadBuildTools(libDir, platform)
  await downloadJDK(libDir, platform)

  console.log('All files processed in sequence.')
}

main()
