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

export type PluginFile = {
  /** The full path to the file */
  filePath: string
  /** The base name of the file */
  fileBaseName: string
  /** The name of the file without extension */
  fileStem: string
  /** The version of the plugin file */
  version: string | null
}

export function createPluginFile(
  filePath: string,
  plugin: UpdatePlugin
): PluginFile {
  const fileObj = path.parse(filePath)
  const fileBaseName = fileObj.base
  const fileStem = fileObj.name
  const version = plugin.extractVersion
    ? plugin.extractVersion(fileStem)
    : extractVersionFromName(fileStem)
  return {
    filePath,
    fileBaseName,
    fileStem,
    version,
  }
}
