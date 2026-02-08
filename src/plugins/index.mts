import chalk from 'chalk'
import type { Options, UpdatePlugin } from '../types.mts'
import { AutoUpdateGeyser } from './AutoUpdateGeyser.mts'
import { BetterStructures } from './BetterStructures.mts'
import {
  EssentialsAntiBuild,
  EssentialsChat,
  EssentialsCore,
  EssentialsProtect,
  EssentialsSpawn,
} from './EssentialsX.mts'
import { FastAsyncWorldEdit } from './FastAsyncWorldEdit.mts'
import { LuckPerms } from './LuckPerms.mts'
import { Paper } from './Paper.mts'
import { Vault } from './Vault.mts'
import { ViaBackwards, ViaVersion } from './ViaVersion.mts'
import Constants from '../utils/Constants.mts'

const allPlugins: UpdatePlugin[] = [
  // Geyser, // AutoUpdateGeyser handles this
  // Floodgate, // AutoUpdateGeyser handles this
  // WorldEdit, // Replaced by FastAsyncWorldEdit
  // SimpleVoiceChat, // Not in use
  // EliteMobs, // Not used on Apex
  // WorldGuard, // Needed by EliteMobs which is not used anymore

  // MultiverseCore,
  // MultiversePortals,

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
].sort((a, b) => a.title.localeCompare(b.title))
allPlugins.push(Paper)

export const getPlugins = (options: Options) => {
  if (options?.name) {
    return allPlugins.filter((plugin) =>
      options.name?.some((name) =>
        plugin.title.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
      ),
    )
  } else {
    return allPlugins
  }
}

/**
 * Iterates over all plugins and executes the callback for each of them.
 * If the `--name` option is provided, only plugins whose title includes any of the specified names are included.
 * Errors are caught and logged, but do not stop the execution of the loop.
 *
 * @param options CLI options.
 * @param callback Handler for each plugin.
 */
export const foreachPlugin = async (
  options: Options,
  callback: (plugin: UpdatePlugin) => Promise<void>,
) => {
  for (const plugin of getPlugins(options)) {
    try {
      await callback(plugin)
    } catch (err) {
      const error = err as Error
      console.error(chalk.red(`Error processing plugin ${plugin.title}:`), error?.message || error)
      if (Constants.DEBUG && error?.stack) {
        console.error(error.stack.toString())
      }
    }
  }
}
