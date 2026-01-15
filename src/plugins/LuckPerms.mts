import path from 'path'
import type { UpdatePlugin } from '../types.mts'

export const LuckPerms: UpdatePlugin = {
  title: 'LuckPerms',
  info: async () => {
    const res = await fetch('https://metadata.luckperms.net/data/all')
    const json = await res.json()
    const url = json.downloads.bukkit as string
    const filename = path.basename(url)
    const version = json.version as string

    return {
      version,
      url,
      filename,
    }
  },
}
