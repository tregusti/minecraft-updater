import type { Options, UpdatePlugin } from '../types.mts'
import { AutoUpdateGeyser } from './AutoUpdateGeyser.mts'
import {
  EssentialsAntiBuild,
  EssentialsChat,
  EssentialsCore,
  EssentialsProtect,
  EssentialsSpawn,
} from './EssentialsX.mts'
import { FastAsyncWorldEdit } from './FastAsyncWorldEdit.mts'
import { LuckPerms } from './LuckPerms.mts'
import { BetterStructures } from './MagmaGuy.mts'
import { Paper } from './Paper.mts'
import { Vault } from './Vault.mts'
import { ViaBackwards, ViaVersion } from './ViaVersion.mts'

const allPlugins: UpdatePlugin[] = [
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

export const getPlugins = (options: Options) => {
  if (options?.name) {
    return allPlugins.filter((plugin) =>
      options.name?.some((name) =>
        plugin.title.toLocaleLowerCase().includes(name.toLocaleLowerCase())
      )
    )
  } else {
    return allPlugins
  }
}
