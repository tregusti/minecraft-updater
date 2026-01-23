import chalk from 'chalk'
import fs from 'fs/promises'
import path from 'path'

import { getPlugins } from '../plugins/index.mts'
import type { Options } from '../types.mts'
import { findLocalPluginFiles } from '../utils/pluginFileUtils.mts'
import Constants from '../utils/Constants.mts'

export const CleanCommand = async (options: Options) => {
  const plugins = getPlugins(options)
  let plugin
  while ((plugin = plugins.pop())) {
    try {
      const matches = await findLocalPluginFiles(plugin)
      const keeper = matches.pop()

      console.log(chalk.bold(plugin.title + ':'))

      for (const match of matches) {
        console.log(chalk.red(`  Remove "${path.basename(match.filePath)}"`))
        await fs.rm(match.filePath)
      }
      if (keeper) {
        console.log(chalk.green(`  Keep: "${path.basename(keeper.filePath)}"`))
      }
    } catch (err) {
      const error = err as Error
      if (error?.message) {
        console.error(error?.message)
        if (Constants.DEBUG) console.error(error?.stack)
      }
    }
  }
}
