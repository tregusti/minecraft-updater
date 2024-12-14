import { UpdatePlugin } from '../types.mts'

let artifacts: any[]

const getArtifact = async (name: string) => {
  if (!artifacts) {
    const res = await fetch(
      'https://ci-api.essentialsx.net/job/EssentialsX/lastSuccessfulBuild/api/json'
    )
    const json = await res.json()
    artifacts = json.artifacts
  }

  return artifacts.find((artifact) => artifact.fileName.startsWith(name + '-'))
}

const getPlugin = async (name: string) => {
  const artifact = await getArtifact(name)
  return {
    url: `https://ci.ender.zone/job/EssentialsX/lastSuccessfulBuild/artifact/jars/${artifact.fileName}`,
    filename: artifact.fileName,
  }
}

export const EssentialsCore: UpdatePlugin = {
  title: 'EssentialsX Core',
  info: () => getPlugin('EssentialsX'),
}

export const EssentialsChat: UpdatePlugin = {
  title: 'EssentialsX Chat',
  info: () => getPlugin('EssentialsXChat'),
}

export const EssentialsSpawn: UpdatePlugin = {
  title: 'EssentialsX Spawn',
  info: () => getPlugin('EssentialsXSpawn'),
}

export const EssentialsAntiBuild: UpdatePlugin = {
  title: 'EssentialsX AntiBuild',
  info: () => getPlugin('EssentialsXAntiBuild'),
}

export const EssentialsProtect: UpdatePlugin = {
  title: 'EssentialsX Protect',
  info: () => getPlugin('EssentialsXProtect'),
}
