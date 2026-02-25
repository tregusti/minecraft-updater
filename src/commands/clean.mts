import fs from 'fs/promises'
import path from 'path'

import chalk from 'chalk'

import { foreachPlugin } from '../plugins/index.mts'
import type { Options } from '../types.mts'
import { findLocalPluginFiles } from '../utils/pluginFileUtils.mts'

export const CleanCommand = async (options: Options) => {
  await foreachPlugin(options, async (plugin) => {
    console.log(chalk.bold(plugin.title + ':'))

    const matches = await findLocalPluginFiles(plugin)
    const keeper = matches.pop()

    for (const match of matches) {
      console.log(chalk.red(`  Remove "${path.basename(match.filePath)}"`))
      await fs.rm(match.filePath)
    }
    if (keeper) {
      console.log(chalk.green(`  Keep: "${path.basename(keeper.filePath)}"`))
    }
  })
}
