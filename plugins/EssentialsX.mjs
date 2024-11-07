import { UpdateType } from '../utils/UpdateType.mjs'

let artifacts

const getArtifact = async (name) => {
  if (!artifacts) {
    const res = await fetch(
      'https://ci-api.essentialsx.net/job/EssentialsX/lastSuccessfulBuild/api/json'
    )
    const json = await res.json()
    artifacts = json.artifacts
  }

  return artifacts.find((artifact) => artifact.fileName.startsWith(name + '-'))
}

const getPlugin = async (name) => {
  const artifact = await getArtifact(name)
  return {
    url: `https://ci.ender.zone/job/EssentialsX/lastSuccessfulBuild/artifact/jars/${artifact.fileName}`,
    filename: artifact.fileName,
  }
}

export const EssentialsCore = {
  title: 'EssentialsX Core',
  type: UpdateType.Plugin,
  info: () => getPlugin('EssentialsX'),
}

export const EssentialsChat = {
  title: 'EssentialsX Chat',
  type: UpdateType.Plugin,
  info: () => getPlugin('EssentialsXChat'),
}

export const EssentialsSpawn = {
  title: 'EssentialsX Spawn',
  type: UpdateType.Plugin,
  info: () => getPlugin('EssentialsXSpawn'),
}

export const EssentialsAntiBuild = {
  title: 'EssentialsX AntiBuild',
  type: UpdateType.Plugin,
  info: () => getPlugin('EssentialsXAntiBuild'),
}

export const EssentialsProtect = {
  title: 'EssentialsX Protect',
  type: UpdateType.Plugin,
  info: () => getPlugin('EssentialsXProtect'),
}
