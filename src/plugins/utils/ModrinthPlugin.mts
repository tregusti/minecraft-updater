import { JSDOM } from 'jsdom'
import Log from '../../utils/Log.mts'

const VERSIONS: string[] = []
const logger = new Log('ModrinthPlugin')

// https://github.com/jsdom/jsdom/issues/3236
const originalConsoleError = console.error
console.error = (message, ...params) => {
  if (message?.includes('Could not parse CSS stylesheet')) {
    return
  }
  originalConsoleError(message, ...params)
}

const populateVersions = async () => {
  if (VERSIONS.length > 0) return

  const dom = await JSDOM.fromURL(
    'https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs'
  )
  const rows = dom.window.document.querySelectorAll('.article-list a')
  const javas = Array.from(rows).filter((row) =>
    row.textContent.startsWith('Minecraft: Java Edition ')
  )
  const releaseNames = javas.map((release) => release.textContent.trim())
  const versions = releaseNames.map((release) =>
    release.match(/(\d+\.\d+(\.\d+)?)/)?.at(1)
  )

  if (versions.includes(undefined) || versions.length === 0) {
    throw new Error('Error populating Minecraft versions from changelog')
  }

  VERSIONS.push(...(versions as string[]).slice(0, 3)) // Get latest 3 versions
  logger.debug('Populated Minecraft versions:', VERSIONS)
}

const getReleaseForVersion = async (project: string, mcVersion: string) => {
  const versionsUrl = `https://modrinth.com/plugin/${project}/versions?l=paper&c=release&g=${mcVersion}`

  const dom = await JSDOM.fromURL(versionsUrl)
  const row = dom.window.document.querySelector('.versions-grid-row.group')
  const a = row?.querySelector('[aria-label="Download"]')
  const url = a?.getAttribute('href')

  const filename = url?.split('/').at(-1)
  const pluginVersion =
    filename?.match(/(\d[\d\.]+\d)/)?.at(1) ??
    row?.querySelector('.font-bold.text-contrast')?.textContent?.trim()
  logger.debug({ mcVersion, url, filename, pluginVersion })

  return {
    url,
    version: pluginVersion,
    filename,
  }
}

export const getLatestRelease = async (project: string) => {
  await populateVersions()

  for (let i = 0, version; (version = VERSIONS[i]); i++) {
    const rel = await getReleaseForVersion(project, version)

    if (rel && rel.url && rel.version && rel.filename) {
      return {
        url: rel.url,
        version: rel.version,
        filename: rel.filename,
      }
    }
  }

  throw new Error('Error getting latest release for: ' + project)
}
