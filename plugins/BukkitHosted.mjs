import { JSDOM } from 'jsdom'

const baseUrl = 'https://dev.bukkit.org'

export const WorldGuard = {
  title: 'WorldGuard',
  info: async () => getPlugin('worldguard'),
}

// Do not use. Usa FastAsyncWorldEdit instead.
export const WorldEdit = {
  title: 'WorldEdit',
  info: async () => getPlugin('worldedit'),
}

export const MultiverseCore = {
  title: 'Multiverse-Core',
  info: async () => getPlugin('multiverse-core'),
}

export const MultiversePortals = {
  title: 'Multiverse-Portals',
  info: async () => getPlugin('multiverse-portals'),
}

const getPlugin = async (projectName) => {
  const { downloadPath, infoPath } = await getLatestRelease(projectName)
  const filename = await getFilename(infoPath)
  const url = baseUrl + downloadPath

  return {
    url,
    filename,
  }
}

const getLatestRelease = async (projectName) => {
  const dom = await JSDOM.fromURL(`${baseUrl}/projects/${projectName}/files`)
  const nameNode = dom.window.document.querySelector('#content .project-file-name')
  const infoPath = nameNode.querySelector('.project-file-name-container a').getAttribute('href')
  const downloadPath = nameNode.querySelector('.project-file-download-button a').getAttribute('href')
  return {
    infoPath,
    downloadPath,
  }
}

const getFilename = async (infoPath) => {
  const dom = await JSDOM.fromURL(baseUrl + infoPath)
  const div = dom.window.document.querySelector('#content .details-info li .info-data')
  return div.textContent
}
