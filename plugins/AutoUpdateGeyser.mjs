import { getLatestRelease } from '../utils/GithubUtils.mjs'

export default {
  title: 'AutoUpdateGeyser',
  info: async () => {
    const release = await getLatestRelease({
      owner: 'NewAmazingPVP',
      repo: 'AutoUpdateGeyser',
      assetId: 181613689,
    })

    const url = release.url
    const filename = `AutoUpdateGeyser-${release.version}.jar`

    return {
      url,
      filename,
    }
  },
}
