import path from 'path'
import { JSDOM } from 'jsdom'
import { extractVersionFromName } from '../../utils/minis.mts'

const baseUrl = 'https://dev.bukkit.org'

const getPlugin = async (projectName: string) => {
  const { downloadPath, infoPath } = await getLatestRelease(projectName)
  const filename = await getFilename(infoPath)
  const url = baseUrl + downloadPath
  const version = extractVersionFromName(path.parse(filename).name)

  return {
    url,
    filename,
    version,
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

export { getPlugin }
