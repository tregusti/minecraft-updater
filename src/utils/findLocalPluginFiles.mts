import type { UpdatePlugin } from '../types.mts'
import { getArtifactFilename, glob } from './fileUtils.mts'
import { alpannumSort, extractVersionFromName } from './minis.mts'
import path from 'path'

export async function findLocalPluginFiles(plugin: UpdatePlugin) {
  const fileStartsWith = plugin.fileStartsWith ?? plugin.title
  const str = getArtifactFilename('plugins', fileStartsWith + '-*.*')
  const matches = await Array.fromAsync(await glob(str))
  const sorted = alpannumSort(matches)
  return sorted.map((x) => createPluginFile(x, plugin))
}

function createPluginFile(
  filename: string,
  plugin: UpdatePlugin
): {
  /** The full path to the file */
  filename: string
  /** The base name of the file */
  basename: string
  /** The name of the file without extension */
  name: string
  /** The version of the plugin file */
  version: string | null
} {
  const fileObj = path.parse(filename)
  const basename = fileObj.base
  const name = fileObj.name
  const version = plugin.extractVersion
    ? plugin.extractVersion(name)
    : extractVersionFromName(name)
  return {
    filename,
    basename,
    name,
    version,
  }
}
