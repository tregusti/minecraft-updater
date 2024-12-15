import { isPresent, saveFile } from './utils/fileUtils.mts'

import chalk from 'chalk'
import { Plugins } from './plugins/index.mts'
import { Options } from './CLI.mts'

let plugin
while ((plugin = Plugins.pop())) {
  try {
    console.log(chalk.bold(`${plugin.title}:`))

    process.stdout.write(chalk.dim(`  Fetching metadata... `))
    const info = await plugin.info()
    console.log(chalk.green('Done'))

    process.stdout.write(chalk.dim(`  Version check...     `))

    if (!Options.force && (await isPresent(info.filename))) {
      console.log(chalk.green('Done'))
      console.log(chalk.dim(`  Filename ${info.filename}`))
    } else {
      if (Options.force) {
        console.log(chalk.yellow('Forced update'))
      } else {
        console.log(chalk.yellow('Update available'))
      }
      process.stdout.write(chalk.dim(`  Downloading file...  `))

      const res = await fetch(info.url, {
        headers: { Accept: 'application/octet-stream' },
      })
      const buffer = Buffer.from(await res.arrayBuffer())
      console.log(chalk.green('Done'))

      process.stdout.write(chalk.dim(`  Saving ${info.filename}... `))
      await saveFile({
        buffer,
        filename: info.filename,
      })
      console.log(chalk.green('Done'))
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
