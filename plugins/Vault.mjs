import { getLatestRelease } from '../utils/GithubUtils.mjs'
import { UpdateType } from '../utils/UpdateType.mjs'

export default {
  title: 'Vault',
  type: UpdateType.Plugin,
  info: async () => {
    const release = await getLatestRelease({
      owner: 'MilkBowl',
      repo: 'Vault',
    })

    const url = release.url
    const filename = `Vault-${release.version}.jar`

    return {
      url,
      filename,
    }
  },
}
