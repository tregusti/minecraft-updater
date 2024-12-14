import { JSDOM } from 'jsdom'
import { UpdatePlugin } from '../types.mts'

const baseUrl = 'https://dev.bukkit.org'

export const WorldGuard: UpdatePlugin = {
  title: 'WorldGuard',
  info: async () => getPlugin('worldguard'),
}

/** @deprecated Do not use. Usa FastAsyncWorldEdit instead. */
export const WorldEdit: UpdatePlugin = {
  title: 'WorldEdit',
  info: async () => getPlugin('worldedit'),
}

export const MultiverseCore: UpdatePlugin = {
  title: 'Multiverse-Core',
  info: async () => getPlugin('multiverse-core'),
}

export const MultiversePortals: UpdatePlugin = {
  title: 'Multiverse-Portals',
  info: async () => getPlugin('multiverse-portals'),
}

const getPlugin = async (projectName: string) => {
  const { downloadPath, infoPath } = await getLatestRelease(projectName)
  const filename = await getFilename(infoPath)
  const url = baseUrl + downloadPath

  return {
    url,
    filename,
  }
}

const getLatestRelease = async (projectName: string) => {
  const dom = await JSDOM.fromURL(`${baseUrl}/projects/${projectName}/files`)
  const nameNode = dom.window.document.querySelector(
    '#content .project-file-name'
  )
  const infoPath = nameNode
    ?.querySelector('.project-file-name-container a')
    ?.getAttribute('href')
  const downloadPath = nameNode
    ?.querySelector('.project-file-download-button a')
    ?.getAttribute('href')

  if (!infoPath || !downloadPath) {
    throw new Error(`Error getting latest release for: ${projectName}`)
  }

  return {
    infoPath,
    downloadPath,
  }
}

const getFilename = async (infoPath: string) => {
  const dom = await JSDOM.fromURL(baseUrl + infoPath)
  const div = dom.window.document.querySelector(
    '#content .details-info li .info-data'
  )

  if (!div || !div.textContent) {
    throw new Error(`Error getting filename`)
  }

  return div.textContent
}
