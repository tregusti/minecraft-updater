import chalk from 'chalk'
import p from 'path'

import { getPlugins } from '../plugins/index.mts'
import type { Options } from '../types.mts'
import {
  getArtifactFilename,
  isPresent,
  saveFile,
} from '../utils/fileUtils.mts'

export const UpdateCommand = async (options: Options) => {
  const plugins = getPlugins(options)
  let plugin
  while ((plugin = plugins.shift())) {
    try {
      console.log(chalk.bold(`${plugin.title}:`))

      process.stdout.write(chalk.dim(`  Fetching metadata... `))
      const info = await plugin.info()
      console.log(chalk.green('Done'))

      process.stdout.write(chalk.dim(`  Version check...     `))

      const artifact = getArtifactFilename('plugins', info.filename)
      if (!options.force && (await isPresent(artifact))) {
        console.log(chalk.green('No update'))
        console.log(chalk.dim(`  Filename ${info.filename}`))
      } else {
        if (options.force) {
          console.log(chalk.yellow('Forced update'))
        } else {
          console.log(chalk.yellow('Update available'))
        }
        if (info.changelog) {
          console.log(
            chalk.dim(`  Changelog:           ${chalk.yellow(info.changelog)}`)
          )
        }
        process.stdout.write(chalk.dim(`  Downloading file...  `))

        const res = await fetch(info.url, {
          headers: { Accept: 'application/octet-stream' },
        })
        const buffer = Buffer.from(await res.arrayBuffer())
        console.log(chalk.green('Done'))

        console.log(
          chalk.dim(
            `  Saving file...       ${chalk.reset.green(info.filename)}`
          )
        )
        await saveFile({
          buffer,
          filename: artifact,
        })
      }
    } catch (err) {
      const error = err as Error
      if (error?.message) {
        console.error(chalk.red(error.message))
      }
      if (error?.stack) {
        console.error(error.stack.toString())
      }
    }
  }

  console.log()
  console.log(chalk.greenBright('All plugins downloaded!'))
}
