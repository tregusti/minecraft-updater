import type { UpdatePlugin } from '../types.mts'
import { getPlugin } from './utils/BukkitPlugin.mts'

export const MultiverseCore: UpdatePlugin = {
  title: 'Multiverse-Core',
  info: async () => getPlugin('multiverse-core'),
}

export const MultiversePortals: UpdatePlugin = {
  title: 'Multiverse-Portals',
  info: async () => getPlugin('multiverse-portals'),
}
