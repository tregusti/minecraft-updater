import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from '../utils/GithubPlugin.mts'

export const Vault: UpdatePlugin = {
  title: 'Vault',
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
