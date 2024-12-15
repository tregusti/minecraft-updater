import { JSDOM } from 'jsdom'

export const getLatestRelease = async (project: string) => {
  const versionsUrl = `https://modrinth.com/plugin/${project}/versions?l=paper&c=release`

  // https://github.com/jsdom/jsdom/issues/3236
  const originalConsoleError = console.error
  console.error = (message, ...params) => {
    if (message.includes('Could not parse CSS stylesheet')) {
      return
    }
    originalConsoleError(message, ...params)
  }

  const dom = await JSDOM.fromURL(versionsUrl)
  const a = dom.window.document.querySelector(
    '.versions-grid-row.group [aria-label="Download"]'
  )
  const url = a?.getAttribute('href')

  const filename = url?.split('/').at(-1)
  const version = filename?.match(/(\d[\d\.]+\d)/)?.at(1)

  if (!url || !version || !filename) {
    throw new Error('Error getting latest release for: ' + project)
  }

  return {
    url,
    version,
    filename,
  }
}
