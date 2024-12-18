import p from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'

import Log from './Log.mjs'

// export { readFile } from 'fs/promises'
const logger = new Log('FileUtils')

export const isPresent = async (filename) => {
  try {
    await fs.access(filename, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const mkdir = async (path) => {
  logger.debug(`mkdir: "${path}"... `, Log.WillAppend)
  const result = await fs.mkdir(path, { recursive: true })
  logger.append(chalk.green('DONE'))
  return result
}
export const readFile = async (file) => await fs.readFile(file, 'utf8')

export const saveFile = async ({ filename, buffer }) => {
  const filepath = p.dirname(filename)
  await fs.mkdir(filepath, { recursive: true })
  await fs.writeFile(filename, buffer)
}
