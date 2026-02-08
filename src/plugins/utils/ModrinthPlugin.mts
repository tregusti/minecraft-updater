import type { UpdatePluginInfo } from '../../types.mts'
import semver from 'semver'

type VersionsResponse = VersionInfo[]

type VersionInfo = {
  version_number: string
  name: string
  game_versions: string[]
  files: VersionFile[]
}

type VersionFile = {
  id: string
  url: string
  primary: boolean
}

export const getLatestRelease = async (
  projectName: string,
  projectId: string,
): Promise<UpdatePluginInfo> => {
  const latest = await fetchLatestVersion(projectId)
  const url = await getDownloadUrl(latest)

  const fileBaseName = `${projectName}-${latest.version_number}.jar`

  return {
    url,
    fileBaseName,
    version: latest.version_number,
    changelog: `https://modrinth.com/plugin/${projectId}/changelog`,
  }
}

async function getDownloadUrl(version: VersionInfo): Promise<string> {
  const primaryFile = version.files.find((file) => file.primary)
  if (!primaryFile) {
    throw new Error(`No primary file found for version ${version.version_number}`)
  }
  return primaryFile.url
}

async function fetchLatestVersion(projectName: string): Promise<VersionInfo> {
  const versionsUrl = `https://api.modrinth.com/v3/project/${projectName}/version?include_changelog=false`
  const res = await fetch(versionsUrl)
  const versions = (await res.json()) as VersionsResponse
  versions.sort((a, b) => semver.compare(a.version_number, b.version_number)).reverse()
  const latest = versions.at(0)
  if (!latest) {
    throw new Error(`No versions found for project ${projectName}`)
  }
  return latest
}
