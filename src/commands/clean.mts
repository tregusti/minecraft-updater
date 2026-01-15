import chalk from 'chalk'
import fs from 'fs/promises'
import path from 'path'

import { getPlugins } from '../plugins/index.mts'
import type { Options } from '../types.mts'
import Log from '../utils/Log.mts'
import { findLocalPluginFiles } from '../utils/pluginFileUtils.mts'

export const CleanCommand = async (options: Options) => {
  const logger = new Log('Clean')

  const plugins = getPlugins(options)
  let plugin
  while ((plugin = plugins.pop())) {
    try {
      const matches = await findLocalPluginFiles(plugin)
      matches.pop()

      for (const match of matches) {
        logger.info(
          `Removing "${path.basename(match.filePath)}"... `,
          Log.WillAppend
        )
        await fs.rm(match.filePath)
        logger.append(chalk.green('DONE'))
      }
    } catch (err) {
      const error = err as Error
      if (error?.message) {
        console.error(error.message)
      }
    }
  }
}
