const getBuildId = async (project) => {
  const url = `https://download.geysermc.org/v2/projects/${project}/versions/latest/builds`
  const res = await fetch(url)
  const json = await  res.json()
  const build = json.builds.pop()
  return build.build
}

export const Geyser = {
  title: 'Geyser',
  info: async () => {
    const build = await getBuildId('geyser')
    return {
      url: "https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot",
      filename: `Geyser-Spigot-${build}.jar`,
    }
  },
}

export const Floodgate = {
  title: 'Floodgate',
  info: async () => {
    const build = await getBuildId('floodgate')
    return {
      url: "https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot",
      filename: `Geyser-Floodgate-${build}.jar`,
    }
  },
}
