import type { UpdatePlugin } from '../types.mts'
import { getPlugin } from '../utils/BukkitPlugin.mts'

export const WorldGuard: UpdatePlugin = {
  title: 'WorldGuard',
  info: async () => getPlugin('worldguard'),
}

/** @deprecated Do not use. Usa FastAsyncWorldEdit instead. */
export const WorldEdit: UpdatePlugin = {
  title: 'WorldEdit',
  info: async () => getPlugin('worldedit'),
}
