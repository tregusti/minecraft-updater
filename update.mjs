import { isPresent, saveFile } from './utils/fileUtils.mjs'

import chalk from 'chalk'
import AutoUpdateGeyser from './plugins/AutoUpdateGeyser.mjs'
import {
  MultiverseCore,
  MultiversePortals,
  WorldEdit,
  WorldGuard,
} from './plugins/BukkitHosted.mjs'
import {
  EssentialsAntiBuild,
  EssentialsChat,
  EssentialsCore,
  EssentialsProtect,
  EssentialsSpawn,
} from './plugins/EssentialsX.mjs'
import { Floodgate, Geyser } from './plugins/Geyser.mjs'
import LuckPerms from './plugins/LuckPerms.mjs'
import { BetterStructures, EliteMobs } from './plugins/MagmaGuy.mjs'
import Paper from './plugins/Paper.mjs'
import { ViaBackwards, ViaVersion } from './plugins/PaperHangarHosted.mjs'
import Vault from './plugins/Vault.mjs'
import { SimpleVoiceChat, FastAsyncWorldEdit } from './plugins/ModrinthHosted.mjs'

const DEBUG = process.argv.includes('-d')

const plugins = DEBUG
  ? [LuckPerms, Vault]
  : [
      // Geyser, // AutoUpdateGeyser handles this
      // Floodgate, // AutoUpdateGeyser handles this
      // WorldEdit, // Replaced by FastAsyncWorldEdit
      // SimpleVoiceChat, // Not in use
      // EliteMobs, // Not used on Apex
      // WorldGuard, // Needed by EliteMobs which is not used anymore

      // MultiverseCore,
      // MultiversePortals,

      Paper,

      AutoUpdateGeyser,
      BetterStructures,
      EssentialsAntiBuild,
      EssentialsChat,
      EssentialsCore,
      EssentialsProtect,
      EssentialsSpawn,
      FastAsyncWorldEdit,
      LuckPerms,
      Vault,
      ViaBackwards,
      ViaVersion,
    ]

let plugin
while ((plugin = plugins.pop())) {
  try {
    console.log(chalk.bold(`${plugin.title}:`))

    process.stdout.write(chalk.dim(`  Fetching metadata... `))
    const info = await plugin.info()
    console.log(chalk.green('Done'))

    process.stdout.write(chalk.dim(`  Version check...     `))

    if (!DEBUG && (await isPresent(info.filename))) {
      console.log(chalk.green('Done'))
      console.log(chalk.dim(`  Filename ${info.filename}`))
    } else {
      console.log(chalk.yellow('Update available'))
      process.stdout.write(chalk.dim(`  Downloading file...  `))

      const res = await fetch(info.url, { headers: { Accept: 'application/octet-stream' } })
      const buffer = Buffer.from(await res.arrayBuffer())
      console.log(chalk.green('Done'))

      process.stdout.write(chalk.dim(`  Saving ${info.filename}... `))
      await saveFile({
        buffer,
        filename: info.filename,
      })
      console.log(chalk.green('Done'))
    }
  } catch (error) {
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
