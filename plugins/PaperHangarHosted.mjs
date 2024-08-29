import path from "path";
import { JSDOM } from 'jsdom'

export const ViaVersion = {
  title: 'ViaVersion',
  info: async () => getPlugin('ViaVersion'),
}

export const ViaBackwards = {
  title: 'ViaBackwards',
  info: async () => getPlugin('ViaBackwards'),
}


const getPlugin = async (projectName) => {
  const pluginUrl =`https://hangar.papermc.io/ViaVersion/${projectName}/versions?channel=Release&platform=PAPER`
  const dom = await JSDOM.fromURL(pluginUrl)
  const section = dom.window.document.querySelector('section') // left section (content)
  const version = section.querySelector("li h3").textContent
  const url = `https://hangarcdn.papermc.io/plugins/ViaVersion/${projectName}/versions/${version}/PAPER/${projectName}-${version}.jar`
  const filename = path.basename(url)

  return {
    url,
    filename,
  }
}
