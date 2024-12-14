import { UpdatePlugin } from '../types.mts'

const apiUrl =
  'http://magmaguy.com:50001/api/maven/details/releases/com/magmaguy/'
const releasesUrl = 'http://magmaguy.com:50001/releases/com/magmaguy/'

const getRelease = async (project: string) => {
  const res = await fetch(apiUrl + project)
  const json = (await res.json()) as { files: { type: string; name: string }[] }
  const dirs = json.files.filter((file) => file.type == 'DIRECTORY')
  const releases = dirs
    .filter((dir) => /^[\d\.]+$/.test(dir.name))
    .toSorted((a, b) => a.name.localeCompare(b.name))

  const release = releases.pop()

  const version = release?.name
  const filename = `${project}-${version}.jar`
  const url = `${releasesUrl}${project}/${version}/${filename}`

  return {
    url,
    filename,
  }
}

export const BetterStructures: UpdatePlugin = {
  title: 'BetterStructures',
  info: async () => getRelease('BetterStructures'),
}

export const EliteMobs: UpdatePlugin = {
  title: 'EliteMobs',
  info: async () => getRelease('EliteMobs'),
}
