import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from './utils/ModrinthPlugin.mts'

export const BetterStructures: UpdatePlugin = {
  title: 'BetterStructures',
  info: async () => getLatestRelease('BetterStructures', 'betterstructures'),
}
