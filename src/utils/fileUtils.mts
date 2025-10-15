import chalk from 'chalk'
import fs from 'fs/promises'
import p from 'path'
import Log from './Log.mjs'

const logger = new Log('FileUtils')
const __dirname = import.meta.dirname
const secretsPath = p.resolve(import.meta.dirname, '../../secrets')

export const getArtifactFilename = (
  type: 'backup' | 'plugins',
  ...filenames: string[]
) => p.resolve(__dirname, '../../artifacts', type, ...filenames)

export const glob = async (glob: string) => {
  logger.debug(`glob: "${glob}"... `, Log.WillAppend)
  const result = await fs.glob(glob)
  logger.append(chalk.green('DONE'))
  return result
}

export const rm = async (file: string) => {
  logger.debug(`rm: "${file}"... `, Log.WillAppend)
  const result = await fs.rm(file)
  logger.append(chalk.green('DONE'))
  return result
}

export const mkdir = async (path: string) => {
  logger.debug(`mkdir: "${path}"... `, Log.WillAppend)
  const result = await fs.mkdir(path, { recursive: true })
  logger.append(chalk.green('DONE'))
  return result
}

export const readFile = async (file: string) => await fs.readFile(file, 'utf8')

export const isPresent = async (filename: string) => {
  try {
    await fs.access(filename, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const saveFile = async ({
  filename,
  buffer,
}: {
  filename: string
  buffer: Buffer
}) => {
  const filepath = p.dirname(filename)
  await fs.mkdir(filepath, { recursive: true })
  await fs.writeFile(filename, buffer)
}

export const readSecretFile = async (filename: string) => {
  const filePath = p.join(secretsPath, filename)
  return await readFile(filePath)
}
