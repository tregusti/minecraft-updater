import semver from 'semver'

const collator = new Intl.Collator('en', { numeric: true })

export const alpannumSort = (arr: string[]) =>
  [...arr].sort((a: string, b: string) => collator.compare(a, b))

/**
 * Extract a semver version from the name part of a file name.
 * @param name The name witouth path and extension.
 */
export const extractVersionFromName = (name: string) => {
  const versionObject = semver.coerce(name, { includePrerelease: true })
  return semver.valid(versionObject)
}
