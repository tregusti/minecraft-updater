import p from 'path'
import fs from 'fs/promises'

// export { readFile } from 'fs/promises'

export const isPresent = async (filename) => {
  try {
    await fs.access(filename, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const mkdir = async (path) => await fs.mkdir(path, { recursive: true })
export const readFile = async (file) => await fs.readFile(file, 'utf8')

export const saveFile = async ({ filename, buffer }) => {
  const filepath = p.dirname(filename)
  await fs.mkdir(filepath, { recursive: true })
  await fs.writeFile(filename, buffer)
}
