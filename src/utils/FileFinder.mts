import p from 'path'
import { Minimatch } from 'minimatch'
import Constants from './Constants.mts'
import type { Client, FileInfo } from 'basic-ftp'

export class FileFinder {
  #client: Client
  #root: string

  constructor({ client, root = '/' }: { client: Client; root?: string }) {
    if (!root.startsWith('/')) {
      throw new SyntaxError("Parameter 'root' must start with a /")
    }
    this.#client = client
    this.#root = root
  }

  /** Traverse the ftp server structure to find matching files. */
  async #traverse(mm: Minimatch, path: string): Promise<string[]> {
    await this.#client.cd(path)

    // Get all content file base names in the current directory
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

  async match(pattern: string) {
    if (pattern?.includes('**')) {
      throw new SyntaxError(
        'The FileFinder pattern can not contain a double star (**)'
      )
    }

    const mm = new Minimatch(pattern, {
      debug: Constants.DEEP_DEBUG,
      platform: 'darwin',
      noglobstar: true,
    })
    return await this.#traverse(mm, this.#root)
  }
}
