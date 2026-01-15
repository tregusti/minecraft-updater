import type { UpdatePlugin } from '../types.mts'

const getBuildId = async (project: string) => {
  const url = `https://download.geysermc.org/v2/projects/${project}/versions/latest/builds`
  const res = await fetch(url)
  const json = await res.json()
  const build = json.builds.pop()
  return build.build
}

export const Geyser: UpdatePlugin = {
  title: 'Geyser',
  info: async () => {
    const build = await getBuildId('geyser')
    return {
      url: 'https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot',
      fileBaseName: `Geyser-Spigot-${build}.jar`,
    }
  },
}

export const Floodgate: UpdatePlugin = {
  title: 'Floodgate',
  info: async () => {
    const build = await getBuildId('floodgate')
    return {
      url: 'https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot',
      fileBaseName: `Geyser-Floodgate-${build}.jar`,
    }
  },
}
