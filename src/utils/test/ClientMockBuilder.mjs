import p from 'path'
import { FileInfo, FileType } from 'basic-ftp'

/* TEST UTIL */

/** @param {Array<string>} arr */
const uniq = (arr) => Array.from(new Set(arr))

/**
 * @typedef {Set<string>} FilePaths
 */
class ClientMock {
  static #createFileInfo(name, type = FileType.File) {
    const info = new FileInfo(name)
    info.size = 0
    info.type = type
    return info
  }

  /** @type FilePaths */
  #structure
  #pwd = '/'

  /**
   * All full paths in the system that is matching the provided base path.
   * @param {string} path Root relative path
   * @returns {Array<string>} All matching full root relative paths.
   */
  #matches(path) {
    return Array.from(this.#structure).filter((x) => x.startsWith(path))
  }

  constructor(structure) {
    this.#structure = structure
  }

  async list() {
    const deepMatches = this.#matches(this.#pwd)
    const matches = new Map()
    const FILE = 1
    const DIR = 2
    deepMatches.forEach((m) => {
      const parts = p.relative(this.#pwd, m).split('/')
      const name = parts.at(0)
      const fi = new FileInfo(name)
      if (parts.length > 1) {
        fi.type = DIR
      } else {
        fi.type = FILE
      }
      matches.set(name, fi)
    })
    return Array.from(matches.values())
  }
  async cd(path) {
    const fullpath = p.resolve(this.#pwd, path)
    if (this.#matches(fullpath).length > 0) {
      this.#pwd = fullpath
    } else {
      throw new TypeError(`ClientMock: The path is invalid. path=${path} resolved=${fullpath}`)
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

  /** @type FilePaths */
  #structure
  #sort() {
    const sorted = [...this.#structure].sort()
    this.#structure = new Set(sorted)
  }

  constructor() {
    this.#structure = new Set()
  }

  file(filename) {
    if (!filename.startsWith('/')) {
      filename = '/' + filename
    }
    this.#structure.add(filename)
    this.#sort()
    return this
  }

  dump() {
    console.log(Array.from(this.#structure).join('\n'))
    return this
  }
  build() {
    return new ClientMock(this.#structure)
  }
}
