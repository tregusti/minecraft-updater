import { Octokit } from 'octokit'
import { readFile } from 'fs/promises'

const token = await readFile('utils/.github_token', { encoding: 'utf8' })
const octokit = new Octokit({ auth: token })

export const getLatestRelease = async ({
  /** Owner of repository */
  owner,
  /** Repository name */
  repo,
  /** Print out debug information */
  debug = false,
}) => {
  const release = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
    owner,
    repo,
  })
  if (debug) {
    console.debug(`Latest release for ${owner}/${repo}:`, release)
    console.debug(`Latest assets for ${owner}/${repo}:`, release.data.assets)
  }

  const asset = release.data.assets.find(
    (a) => a.browser_download_url.endsWith('.jar') && !/\bmin\b/.test(a.browser_download_url)
  )
  const url = asset.browser_download_url
  const version = url.match(/^.*\/download\/v?(.*)\/.*$/)[1]
  const filename = asset.name

  return {
    url,
    version,
    filename,
  }
}
