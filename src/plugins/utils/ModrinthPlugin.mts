import { JSDOM, VirtualConsole } from 'jsdom'
import Log from '../../utils/Log.mts'
import path from 'path'
import semver from 'semver'
import { getLastMinecraftVersion } from '../../utils/MinecraftVersion.mts'

const virtualConsole = new VirtualConsole()
// virtualConsole.sendTo(console)

// Disable style parsing entirely
// https://github.com/jsdom/jsdom/issues/3236
// https://github.com/jsdom/jsdom/issues/2005
import { implementation } from 'jsdom/lib/jsdom/living/nodes/HTMLStyleElement-impl.js'
import type { UpdatePluginInfo } from '../../types.mts'
implementation.prototype._updateAStyleBlock = () => {}

const logger = new Log('ModrinthPlugin')

export type ModrinthReleaseItem = {
  versionRange: string
  platforms: string
  name: string
  version: string
  filename: string
  type: string
  url?: string | null
}

const clean = (s: string = '') => s.replace(/\s+/g, ' ').trim()
const cleanElm = (elm: Element | null) => clean(elm?.textContent)
const format = (o: any = null) =>
  JSON.stringify(o, null, 2)
    .replace(/\},\s+\{/g, '}, {')
    .trim()

const versionSatisfies = (mcVersions: string[], versionRange: string) => {
  for (const mcVersion of mcVersions) {
    if (semver.satisfies(mcVersion, versionRange)) {
      return true
    }
  }
  return false
}

export const getLatestRelease = async (
  project: string
): Promise<UpdatePluginInfo> => {
  const releasesUrl = `https://modrinth.com/plugin/${project}/versions`
  const dom = await JSDOM.fromURL(releasesUrl, { virtualConsole })

  const body = dom.window.document.body
  const mcVersions = await getLastMinecraftVersion(3)
  logger.debug('Checking for MC versions:', mcVersions)
  const rows = body.querySelectorAll('.versions-grid-row.group')

  const items: ModrinthReleaseItem[] = Array.from(rows).map((row) => {
    const platforms = cleanElm(
      row.querySelector(
        ':scope > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)'
      )
    )

    const version = cleanElm(
      row.querySelector(
        ':scope > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)'
      )
    )
    const name = cleanElm(
      row.querySelector(
        ':scope > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)'
      )
    )

    const versionRangeItems = Array.from(
      row.querySelectorAll(
        ':scope > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) button'
      )
    ).map((btn) => clean(btn.textContent).replace(/[–-]/, ' - '))
    const versionRange = versionRangeItems.join(' || ')

    const type = cleanElm(
      row.querySelector(
        ':scope > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)'
      )
    )
    const url =
      row.querySelector(':scope > div:nth-child(3) a')?.getAttribute('href') ||
      ''

    const file = path.parse(url)
    let filename = file.base
    if (!/\d\.\d/.test(filename) && version) {
      filename = file.name + '-' + version + file.ext
    }

    return {
      name,
      version,
      versionRange,
      filename,
      platforms,
      type,
      url,
    }
  })
  logger.debug('Found releases:', format(items))

  const release = items.find(
    (item) =>
      item.type === 'R' &&
      item.platforms.includes('Paper') &&
      versionSatisfies(mcVersions, item.versionRange)
  )

  return {
    url: release?.url || '',
    filename: release?.filename || '',
    version: release?.version || '',
  }
}
