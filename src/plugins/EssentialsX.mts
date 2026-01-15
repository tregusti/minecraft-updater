import path from 'path'
import type { UpdatePlugin } from '../types.mts'

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
    fileBaseName: artifact.fileName,
  }
}

class EssentialsXPlugin implements UpdatePlugin {
  public fileStartsWith: string

  constructor(public id: string, public title: string) {
    this.fileStartsWith = id
  }

  extractVersion(name: string) {
    return name.substring(this.fileStartsWith.length + 1)
  }

  async info() {
    const plugin = await getPlugin(this.id)
    const version = this.extractVersion(path.parse(plugin.fileBaseName).name)
    return {
      ...plugin,
      version,
    }
  }
}

export const EssentialsCore = new EssentialsXPlugin(
  'EssentialsX',
  'EssentialsX Core'
)

export const EssentialsChat = new EssentialsXPlugin(
  'EssentialsXChat',
  'EssentialsX Chat'
)

export const EssentialsSpawn = new EssentialsXPlugin(
  'EssentialsXSpawn',
  'EssentialsX Spawn'
)

export const EssentialsAntiBuild = new EssentialsXPlugin(
  'EssentialsXAntiBuild',
  'EssentialsX AntiBuild'
)

export const EssentialsProtect = new EssentialsXPlugin(
  'EssentialsXProtect',
  'EssentialsX Protect'
)
