import { access, writeFile, mkdir, constants } from 'fs/promises'

const base = 'downloads/'

export const isPresent = async (filename: string) => {
  try {
    await access(base + filename, constants.F_OK)
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
  await mkdir(base, { recursive: true })
  await writeFile(base + filename, buffer)
}
