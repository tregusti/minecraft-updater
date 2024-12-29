import type { UpdatePlugin } from '../types.mts'
import { getLatestRelease } from './utils/ModrinthPlugin.mts'

export const FastAsyncWorldEdit: UpdatePlugin = {
  title: 'FastAsyncWorldEdit',
  info: async () => getLatestRelease('fastasyncworldedit'),
}
