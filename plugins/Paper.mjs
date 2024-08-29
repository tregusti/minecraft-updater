const getPluginInfo = async () => {
  const res = await fetch('https://papermc.io/js/downloads.js')
  const js = await res.text()
  const text = /.*?(\{.*?);/s.exec(js)[1]
  const json = text.replace(/,\s*\}/gm, '}')
  const items = JSON.parse(json)
  const key = Object.keys(items).find((key) => key.startsWith('Paper'))
  const item = items[key]
  return {
    title: item.title,
    minor: item.api_version,
  }
}

const getBuildInfo = async ({ minor }) => {
  const url = `https://api.papermc.io/v2/projects/paper/version_group/${minor}/builds`
  const res = await fetch(url)
  const json = await res.json()
  const item = json.builds.pop()
  const { version, build } = item
  return { version, build }
}

export default {
  title: 'Paper',
  info: async () => {
    const plugin = await getPluginInfo()
    const { build, version } = await getBuildInfo({ minor: plugin.minor })
    const url = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}/downloads/paper-${version}-${build}.jar`
    const filename = /.*\/([^\/]+)$/.exec(url)[1]
    return {
      url,
      filename,
    }
  },
}
