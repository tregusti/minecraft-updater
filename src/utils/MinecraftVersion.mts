import { debug } from './minis.mts'

type Version = 'release' | 'snapshot'
type Release = {
  version: string
  version_type: Version
  date: string
  major: boolean
}

const VERSIONS: string[] = []

const ensurePopulated = async () => {
  if (VERSIONS.length > 0) return

  const res = await fetch('https://modrinth.com/api/tags/game-versions')
  const data = (await res.json()) as Release[]

  const coll = Intl.Collator('en', { numeric: true, sensitivity: 'base' })
  const releases = data
    .filter((release) => release.version_type === 'release')
    .sort((a, b) => coll.compare(b.version, a.version))

  VERSIONS.push(...releases.map((release) => release.version))

  debug('Populated Minecraft versions:', VERSIONS)
}

export const getLastMinecraftVersion = async (count: number = 1) => {
  await ensurePopulated()

  if (count > VERSIONS.length) {
    count = VERSIONS.length
  } else if (count < 1) {
    count = 1
  } else if (!Number.isInteger(count)) {
    count = Math.floor(count)
  }

  return VERSIONS.slice(0, count)
}
