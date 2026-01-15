import chalk from 'chalk'
import fs from 'fs/promises'
import p from 'path'
import Log from './Log.mjs'

const logger = new Log('FileUtils')
const __dirname = import.meta.dirname
const secretsPath = p.resolve(import.meta.dirname, '../../secrets')

export const getArtifactFilename = (
  type: 'backup' | 'plugins',
  ...fileBaseNames: string[]
) => p.resolve(__dirname, '../../artifacts', type, ...fileBaseNames)

export const glob = async (glob: string) => {
  logger.debug(`glob: "${glob}"... `, Log.WillAppend)
  const result = await fs.glob(glob)
  logger.append(chalk.green('DONE'))
  return result
}

export const rm = async (filePath: string) => {
  logger.debug(`rm: "${filePath}"... `, Log.WillAppend)
  const result = await fs.rm(filePath)
  logger.append(chalk.green('DONE'))
  return result
}

export const mkdir = async (path: string) => {
  logger.debug(`mkdir: "${path}"... `, Log.WillAppend)
  const result = await fs.mkdir(path, { recursive: true })
  logger.append(chalk.green('DONE'))
  return result
}

export const readFile = async (filePath: string) =>
  await fs.readFile(filePath, 'utf8')

export const isPresent = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const saveFile = async ({
  filePath,
  buffer,
}: {
  filePath: string
  buffer: Buffer
}) => {
  const filepath = p.dirname(filePath)
  await fs.mkdir(filepath, { recursive: true })
  await fs.writeFile(filePath, buffer)
}

export const readSecretFile = async (fileStem: string) => {
  const filePath = p.join(secretsPath, fileStem)
  return await readFile(filePath)
}
