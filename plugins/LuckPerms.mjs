import path from "path";

export default {
  title: 'LuckPerms',
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
