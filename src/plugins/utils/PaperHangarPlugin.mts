import path from 'path'
import { JSDOM } from 'jsdom'

export const getPlugin = async (projectName: string) => {
  const pluginUrl = `https://hangar.papermc.io/ViaVersion/${projectName}/versions?channel=Release&platform=PAPER`
  const dom = await JSDOM.fromURL(pluginUrl)
  const section = dom.window.document.querySelector('section') // left section (content)
  const version = section?.querySelector('li h3')?.textContent || '0.0.0'
  const url = `https://hangarcdn.papermc.io/plugins/ViaVersion/${projectName}/versions/${version}/PAPER/${projectName}-${version}.jar`
  const fileBaseName = path.basename(url)

  return {
    url,
    fileBaseName,
    version,
    changelog: `https://github.com/ViaVersion/${projectName}/commits/${version}/`,
  }
}
