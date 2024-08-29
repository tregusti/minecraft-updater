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

export const Core = {
  title: 'EssentialsX Core',
  info: () => getPlugin('EssentialsX'),
}

export const Chat = {
  title: 'EssentialsX Chat',
  info: () => getPlugin('EssentialsXChat'),
}

export const Spawn = {
  title: 'EssentialsX Spawn',
  info: () => getPlugin('EssentialsXSpawn'),
}

export const AntiBuild = {
  title: 'EssentialsX AntiBuild',
  info: () => getPlugin('EssentialsXAntiBuild'),
}

export const Protect = {
  title: 'EssentialsX Protect',
  info: () => getPlugin('EssentialsXProtect'),
}
