import { getLatestRelease } from '../utils/GithubUtils.mjs'

export default {
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
