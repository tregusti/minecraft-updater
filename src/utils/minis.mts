import semver from 'semver'

import Constants from './Constants.mts'

const collator = new Intl.Collator('en', { numeric: true })

export const alpannumSort = (arr: string[]) =>
  [...arr].sort((a: string, b: string) => collator.compare(a, b))

/**
 * Extract a semver version from the name part of a file name.
 * @param name The name witouth path and extension.
 */
export const extractVersionFromName = (name: string) => {
  const versionObject = semver.coerce(name, { includePrerelease: true })
  const version = semver.valid(versionObject)
  return version || Constants.NO_VERSION
}

export const debug = (message: string, ...args: any[]) => {
  if (Constants.DEBUG || Constants.DEEP_DEBUG) {
    console.debug(message, ...args)
  }
}
