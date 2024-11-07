import { getLatestRelease } from '../utils/GithubUtils.mjs'
import { UpdateType } from '../utils/UpdateType.mjs'

export default {
  title: 'FastAsyncWorldEdit',
  type: UpdateType.Plugin,
  info: async () => {
    const release = await getLatestRelease({
      owner: 'IntellectualSites',
      repo: 'FastAsyncWorldEdit',
    })

    const url = release.url
    const filename = release.filename

    return {
      url,
      filename,
    }
  },
}
