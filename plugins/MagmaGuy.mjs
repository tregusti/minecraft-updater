const apiUrl = 'http://magmaguy.com:50001/api/maven/details/releases/com/magmaguy/'
const releasesUrl = 'http://magmaguy.com:50001/releases/com/magmaguy/'

const getRelease = async (project) => {
  const res = await fetch(apiUrl + project)
  const json = await res.json()
  const dirs = json.files.filter((file) => file.type == 'DIRECTORY')
  const releases = dirs.filter((dir) => /^[\d\.]+$/.test(dir.name))
  releases.sort((rel) => rel.name)
  const release = releases.pop()

  const version = release.name
  const filename = `${project}-${version}.jar`
  const url = `${releasesUrl}${project}/${version}/${filename}`

  return {
    url,
    filename,
  }
}

export const BetterStructures = {
  title: 'BetterStructures',
  info: async () => getRelease('BetterStructures'),
}

export const EliteMobs = {
  title: 'EliteMobs',
  info: async () => getRelease('EliteMobs'),
}
