import { getLatestRelease } from '../utils/GithubUtils.mjs'

export default {
  title: 'FastAsyncWorldEdit',
  info: async () => {
    const release = await getLatestRelease({
      owner: 'IntellectualSites',
      repo: 'FastAsyncWorldEdit',
      assetId: 185309396
    })

    const url = release.url
    const filename = release.filename

    return {
      url,
      filename,
    }
  },
}
