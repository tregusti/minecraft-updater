import { isPresent, saveFile } from './utils/fileUtils.mjs'

import Paper from './plugins/Paper.mjs'
import { Geyser, Floodgate } from './plugins/Geyser.mjs'
import Vault from './plugins/Vault.mjs'
import AutoUpdateGeyser from './plugins/AutoUpdateGeyser.mjs'
import { BetterStructures, EliteMobs } from './plugins/MagmaGuy.mjs'
import { Core, Chat, AntiBuild, Protect, Spawn } from './plugins/EssentialsX.mjs'
import FastAsyncWorldEdit from './plugins/FastAsyncWorldEdit.mjs'
import LuckPerms from './plugins/LuckPerms.mjs'
import { MultiverseCore, MultiversePortals, WorldEdit, WorldGuard } from './plugins/BukkitHosted.mjs'
import { ViaBackwards, ViaVersion } from './plugins/PaperHangarHosted.mjs'
import chalk from 'chalk'

const plugins = [
  // Paper, // Auto updating by hosting provider
  // Geyser, // AutoUpdateGeyser handles this
  // Floodgate, // AutoUpdateGeyser handles this

  Core,
  Chat,
  AntiBuild,
  Spawn,
  Protect,
  Vault,
  AutoUpdateGeyser,
  BetterStructures,
  EliteMobs,
  FastAsyncWorldEdit,
  LuckPerms,
  WorldGuard,
  MultiverseCore,
  MultiversePortals,
  ViaVersion,
  ViaBackwards,
]

let plugin
while ((plugin = plugins.pop())) {
  console.log(chalk.bold(`${plugin.title}:`))

  process.stdout.write(chalk.dim(`  Fetching metadata... `))
  const info = await plugin.info()
  console.log(chalk.green('Done'))

  process.stdout.write(chalk.dim(`  Version check...     `))

  if (await isPresent(info.filename)) {
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
}

console.log()
console.log(chalk.greenBright('All plugins downloaded!'))
