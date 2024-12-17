import p from 'path'
import { Minimatch } from 'minimatch'
import Constants from './Constants.mjs'
import { FileInfo } from 'basic-ftp'

/** @typedef {import("basic-ftp").Client} Client */

// /**
//  *
//  * @param {object} params
//  * @param {string} params.root
//  * @param {string} params.pattern
//  * @param {Client} params.client
//  */
// const cd = async ({ root, pattern, client }) => {
//   await client.cd(root)
//   const pwd = await client.pwd()
// }

export class FileFinder {
  /** @type Client */
  #client = null
  /** @type string */
  #root

  constructor({ client, root = '/' }) {
    if (!root.startsWith('/')) {
      throw new SyntaxError("Parameter 'root' must start with a /")
    }
    this.#client = client
    this.#root = root
  }

  /**
   * Traverse the ftp server structure to find matching files.
   * @param {Minimatch} mm
   * @param {string} path New path in PWD to check if it is a match.
   * @param {Array<string>} results
   * @returns {Array<FileInfo>}
   */
  async #traverse(mm, path) {
    await this.#client.cd(path)

    // Get all content filenames
    const list = await this.#client.list()

    const result = []
    for (const fi of list) {
      const pathFull = p.join(path, fi.name)
      const pathBasedOnRoot = p.relative(this.#root, pathFull)

      if (mm.match(pathBasedOnRoot)) {
        result.push(pathFull)
      } else if (mm.match(pathBasedOnRoot, true)) {
        const childResults = await this.#traverse(mm, pathFull)
        result.push(...childResults)
      }
    }
    return result
  }

  async match(pattern) {
    if (pattern?.includes('**')) {
      throw new SyntaxError('The FileFinder pattern can not contain a double star (**)')
    }

    const mm = new Minimatch(pattern, {
      debug: Constants.DEEP_DEBUG,
      platform: 'darwin',
      noglobstar: true,
    })
    return await this.#traverse(mm, this.#root)
  }
}
