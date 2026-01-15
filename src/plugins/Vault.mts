import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from './utils/GithubPlugin.mts'

export const Vault: UpdatePlugin = {
  title: 'Vault',
  info: async () => {
    const release = await getLatestRelease({
      owner: 'MilkBowl',
      repo: 'Vault',
    })

    const filename = `Vault-${release.version}.jar`

    return {
      url: release.url,
      changelog: release.changelog,
      version: release.version,
      filename,
    }
  },
}
