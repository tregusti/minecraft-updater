import p from 'path'
import { Client, FileInfo, FileType } from 'basic-ftp'

/* TEST UTIL */

type FilePaths = Set<string>

class ClientMock {
  #structure: FilePaths
  #pwd = '/'

  /**
   * All full paths in the system that is matching the provided base path.
   * @param {string} path Root relative path
   * @returns {Array<string>} All matching full root relative paths.
   */
  #matches(path: string) {
    return Array.from(this.#structure).filter((x) => x.startsWith(path))
  }

  constructor(structure: FilePaths) {
    this.#structure = structure
  }

  async list() {
    const deepMatches = this.#matches(this.#pwd)
    const matches = new Map()
    deepMatches.forEach((m) => {
      const parts = p.relative(this.#pwd, m).split('/')
      const name = parts.at(0) ?? 'bad-name'
      const fi = new FileInfo(name)
      if (parts.length > 1) {
        fi.type = FileType.Directory
      } else {
        fi.type = FileType.File
      }
      matches.set(name, fi)
    })
    return Array.from(matches.values())
  }
  async cd(path: string) {
    const fullpath = p.resolve(this.#pwd, path)
    if (this.#matches(fullpath).length > 0) {
      this.#pwd = fullpath
    } else {
      throw new TypeError(
        `ClientMock: The path is invalid. path=${path} resolved=${fullpath}`
      )
    }
  }
  async pwd() {
    return this.#pwd
  }
}

export class ClientMockBuilder {
  static create() {
    return new this()
  }

  #structure: FilePaths
  #sort() {
    const sorted = [...this.#structure].sort()
    this.#structure = new Set(sorted)
  }

  constructor() {
    this.#structure = new Set()
  }

  file(filePath: string) {
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath
    }
    this.#structure.add(filePath)
    this.#sort()
    return this
  }

  build() {
    // Cast mock to real thing.
    return new ClientMock(this.#structure) as unknown as Client
  }
}
