import type { Client, FileInfo } from 'basic-ftp'
import chalk from 'chalk'
import { Minimatch } from 'minimatch'
import { createReadStream } from 'node:fs'
import p from 'node:path'
import { foreachPlugin, getPlugins } from '../plugins/index.mts'
import type { Options, UpdatePlugin } from '../types.mts'
import Constants from '../utils/Constants.mts'
import FtpClient from '../utils/FtpClient.mts'
import { alpannumSort } from '../utils/minis.mts'
import {
  createPluginFile,
  findLocalPluginFiles,
  type PluginFile,
} from '../utils/pluginFileUtils.mts'

export const UploadCommand = async (options: Options) => {
  let client: Client
  try {
    client = await FtpClient.connect()
    const pluginsPath = p.posix.join(FtpClient.serverRoot, 'plugins')
    const fileInfos = await client.list(pluginsPath)

    await foreachPlugin(options, async (plugin) => {
      console.log(chalk.bold(`${plugin.title}:`))

      const remoteMatches = findServerMatches(plugin, fileInfos)
      const localMatches = await findLocalPluginFiles(plugin)
      const latestLocal = localMatches.at(-1)
      const latestRemote = remoteMatches.at(-1)

      if (!latestLocal) {
        console.log(chalk.yellow(`  No local files found for plugin, skipping upload.`))
        return
      }

      if (!latestRemote) {
        console.log(chalk.yellow(`  No files found on server for plugin, skipping removal.`))
        return
      }

      if (latestRemote.fileBaseName === latestLocal.fileBaseName) {
        console.log(chalk.dim(`  No changes detected for plugin, skipping upload.`))
        return
      }

      // Upload new version to server.
      const localStream = createReadStream(latestLocal.filePath)
      await client.uploadFrom(localStream, p.posix.join(pluginsPath, latestLocal.fileBaseName))
      console.log(chalk.green(`  Uploaded new version: ${latestLocal.fileBaseName}`))

      // Remove old remote files after uploading new version to not break server in case of upload failure.
      for (const remoteMatch of remoteMatches) {
        await client.remove(p.posix.join(pluginsPath, remoteMatch.fileBaseName))
        console.log(chalk.yellow(`  Removed old version: ${remoteMatch.fileBaseName}`))
      }
    })
  } catch (err) {
    console.error('Failed to connect to server:', err)
    return
  } finally {
    client!.close()
  }
}

const findServerMatches = (plugin: UpdatePlugin, fileInfos: FileInfo[]): PluginFile[] => {
  const fileStartsWith = plugin.fileStartsWith ?? plugin.title
  const pattern = `${fileStartsWith}-*.*`
  const mm = new Minimatch(pattern, {
    debug: Constants.DEEP_DEBUG,
    platform: 'darwin',
    noglobstar: true,
  })

  const filesOnly = fileInfos.filter((f) => f.isFile)
  const matches = filesOnly.filter((f) => mm.match(f.name))
  const fileBaseNames = matches.map((f) => f.name)
  const sorted = alpannumSort(fileBaseNames)
  return sorted.map((name) => createPluginFile(name, plugin))
}
