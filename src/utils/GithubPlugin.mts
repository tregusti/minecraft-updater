import { Octokit } from 'octokit'
import { readFile } from 'fs/promises'

const tokenFilename = `${import.meta.dirname}/.github_token`
const token = await readFile(tokenFilename, { encoding: 'utf8' })
const octokit = new Octokit({ auth: token })

export const getLatestRelease = async ({
  /** Owner of repository */
  owner,
  /** Repository name */
  repo,
  /** Print out debug information */
  debug = false,
}: {
  owner: string
  repo: string
  debug?: boolean
}) => {
  const release = await octokit.request(
    'GET /repos/{owner}/{repo}/releases/latest',
    {
      owner,
      repo,
    }
  )
  if (debug) {
    console.debug(`Latest release for ${owner}/${repo}:`, release)
    console.debug(`Latest assets for ${owner}/${repo}:`, release.data.assets)
  }

  const asset = release.data.assets.find(
    (a) =>
      a.browser_download_url.endsWith('.jar') &&
      !/\bmin\b/.test(a.browser_download_url)
  )
  const url = asset?.browser_download_url
  const version = url?.match(/^.*\/download\/v?(.*)\/.*$/)?.at(1)
  const filename = asset?.name

  if (!url || !version || !filename) {
    throw new Error(`Error getting latest release for: ${owner}/${repo}`)
  }

  return {
    url,
    version,
    filename,
  }
}
