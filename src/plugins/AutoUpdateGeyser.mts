import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from './utils/GithubPlugin.mts'

export const AutoUpdateGeyser: UpdatePlugin = {
  title: 'AutoUpdateGeyser',
  info: async () => {
    const release = await getLatestRelease({
      owner: 'NewAmazingPVP',
      repo: 'AutoUpdateGeyser',
    })

    const url = release.url
    const version = release.version
    const filename = `AutoUpdateGeyser-${release.version}.jar`

    return {
      url,
      filename,
      version,
    }
  },
}
