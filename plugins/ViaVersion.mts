import { UpdatePlugin } from '../types.mts'
import { getPlugin } from '../utils/PaperHangarPlugin.mts'

export const ViaVersion: UpdatePlugin = {
  title: 'ViaVersion',
  info: async () => getPlugin('ViaVersion'),
}

export const ViaBackwards: UpdatePlugin = {
  title: 'ViaBackwards',
  info: async () => getPlugin('ViaBackwards'),
}
