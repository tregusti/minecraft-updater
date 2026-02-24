import p from 'path'

import chalk from 'chalk'
import semver from 'semver'

import { foreachPlugin } from '../plugins/index.mts'
import type { Options, UpdatePlugin, UpdatePluginInfo } from '../types.mts'
import Constants from '../utils/Constants.mts'
import { getArtifactFilename, saveFile } from '../utils/fileUtils.mts'
import { findLocalPluginFiles } from '../utils/pluginFileUtils.mts'
import Work from '../utils/Work.mts'

const subtextWidth = 25
const makeSubtext = (text: string) => chalk.dim(`  ${text}:`.padEnd(subtextWidth))
const makeSpinnerSubtext = (text: string) => makeSubtext(text) + chalk.reset('#')

export const UpdateCommand = async (options: Options) => {
  await foreachPlugin(options, async (plugin) => {
    console.log(chalk.bold(`${plugin.title}:`))

    const info = await fetchMetadata(plugin)
    const { shouldUpdate } = await versionCheck(plugin, info, options)

    if (!shouldUpdate) {
      console.log(makeSubtext(`Filename`) + chalk.dim(info.fileBaseName))
      return
    }

    if (info.changelog) {
      console.log(makeSubtext(`Changelog`) + chalk.yellow(info.changelog))
    }

    const buffer = await downloadFile(info)
    await persistFile(buffer, info)
  })

  console.log()
  console.log(chalk.greenBright('All plugins downloaded!'))
}

const fetchMetadata = async (plugin: UpdatePlugin) => {
  return await Work.do(
    makeSpinnerSubtext(`Fetching metadata`),
    () => plugin.info(),
    chalk.reset.green('Done'),
  )
}

const versionCheck = async (plugin: UpdatePlugin, info: UpdatePluginInfo, options: Options) =>
  Work.do(
    makeSpinnerSubtext(`Version check`),
    async () => {
      const localFiles = await findLocalPluginFiles(plugin)
      const isPresent = localFiles.some(
        (file) => file.fileBaseName === p.basename(info.fileBaseName),
      )
      const shouldUpdate = options.force || !isPresent
      return { localFiles, isPresent, shouldUpdate }
    },
    ({ localFiles, shouldUpdate }) => {
      if (options.force) {
        return chalk.yellow('Forced update')
      }

      if (!shouldUpdate) {
        return chalk.green('No update')
      }

      const lastLocalVersion = localFiles.at(-1)?.version || Constants.NO_VERSION
      if (semver.diff(info.version, lastLocalVersion) === 'major') {
        return chalk.red('Major update available')
      } else {
        return chalk.yellow('Update available')
      }
    },
  )

const downloadFile = async (info: UpdatePluginInfo) =>
  Work.do(
    makeSpinnerSubtext(`Downloading file`),
    async () => {
      const res = await fetch(info.url, {
        headers: { Accept: 'application/octet-stream' },
      })
      return Buffer.from(await res.arrayBuffer())
    },
    chalk.reset.green('Done'),
  )

const persistFile = async (buffer: Buffer, info: UpdatePluginInfo) =>
  Work.do(
    makeSpinnerSubtext(`Saving file`),
    async () => {
      const artifact = getArtifactFilename('plugins', info.fileBaseName)
      await saveFile({
        buffer,
        filePath: artifact,
      })
    },
    () => chalk.reset.green(info.fileBaseName),
  )
