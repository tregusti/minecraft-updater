import { UpdateType } from '../utils/UpdateType.mjs'

const getLatestVersion = async () => {
  const url = `https://api.papermc.io/v2/projects/paper`
  const res = await fetch(url)
  const json = await res.json()
  const version = json.versions.pop()
  return version
}

const getLatestBuild = async ({ version }) => {
  const url = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds`
  const res = await fetch(url)
  const json = await res.json()
  const item = json.builds.pop()
  const filename = item.downloads.application.name
  const build = item.build
  return { filename, build }
}

export default {
  title: 'Paper',
  type: UpdateType.Paper,
  info: async () => {
    const version = await getLatestVersion()
    const { filename, build } = await getLatestBuild({ version })
    const url = `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}/downloads/paper-${version}-${build}.jar`
    // const filename = /.*\/([^\/]+)$/.exec(url)[1]
    return {
      url,
      filename,
    }
  },
}
