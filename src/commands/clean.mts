import { getArtifactFilename, glob, rm } from '../utils/fileUtils.mts'
import fs from 'fs/promises'

import { getPlugins } from '../plugins/index.mts'
import type { Options } from '../types.mts'
import Log from '../utils/Log.mts'
import chalk from 'chalk'
import path from 'path'

export const CleanCommand = async (options: Options) => {
  const alphanumCollator = new Intl.Collator('en', { numeric: true })
  const logger = new Log('Clean')

  const plugins = getPlugins(options)
  let plugin
  while ((plugin = plugins.pop())) {
    try {
      const fileStartsWith = plugin.fileStartsWith ?? plugin.title
      const str = getArtifactFilename('plugins', fileStartsWith + '-*.*')
      const matches = await Array.fromAsync(await glob(str))
      matches.sort((a: string, b: string) => alphanumCollator.compare(a, b))
      matches.pop()

      for (const match of matches) {
        logger.info(`Removing "${path.basename(match)}"... `, Log.WillAppend)
        await fs.rm(match)
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
