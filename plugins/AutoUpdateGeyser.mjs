import { getLatestRelease } from '../utils/GithubUtils.mjs'
import { UpdateType } from '../utils/UpdateType.mjs'

export default {
  title: 'AutoUpdateGeyser',
  type: UpdateType.Plugin,
  info: async () => {
    const release = await getLatestRelease({
      owner: 'NewAmazingPVP',
      repo: 'AutoUpdateGeyser',
    })

    const url = release.url
    const filename = `AutoUpdateGeyser-${release.version}.jar`

    return {
      url,
      filename,
    }
  },
}
