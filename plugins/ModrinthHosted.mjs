import { JSDOM } from 'jsdom'

export const SimpleVoiceChat = {
  title: 'SimpleVoiceChat',
  info: async () => getLatestRelease('simple-voice-chat'),
}

const getLatestRelease = async (
  /** Project islug */
  project
) => {
  const versionsUrl = `https://modrinth.com/plugin/${project}/versions?l=paper&c=release`
  const dom = await JSDOM.fromURL(versionsUrl)
  const a = dom.window.document.querySelector('.versions-grid-row.group [aria-label="Download"]')
  const url = a.getAttribute('href')

  const filename = url.match(/^.*\/(.+?)$/)[1]
  const version = filename.match(/^.*([\d\.]+)/)[1]

  return {
    url,
    version,
    filename,
  }
}
