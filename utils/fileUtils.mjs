import path from 'path'
import { access, writeFile, mkdir, constants } from 'fs/promises'

export const isPresent = async (filename) => {
  try {
    await access(filename, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const saveFile = async ({ filename, buffer }) => {
  await mkdir(path.dirname(filename), { recursive: true })
  await writeFile(filename, buffer)
}
