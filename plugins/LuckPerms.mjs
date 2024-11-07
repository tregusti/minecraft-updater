import path from 'path'
import { UpdateType } from '../utils/UpdateType.mjs'

export default {
  title: 'LuckPerms',
  type: UpdateType.Plugin,
  info: async () => {
    const res = await fetch('https://metadata.luckperms.net/data/all')
    const json = await res.json()
    const url = json.downloads.bukkit
    const filename = path.basename(url)

    return {
      url,
      filename,
    }
  },
}
