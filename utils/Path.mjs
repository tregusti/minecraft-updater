import path from 'path'

export class Path {
  static #create(base, filename) {
    return path.join(base, filename)
  }

  static download(filename) {
    return this.#create('downloads', filename)
  }
  static script(filename) {
    return this.#create('script', filename)
  }
}
