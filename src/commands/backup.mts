import p from 'path'

import chalk from 'chalk'

import { dateTimeString } from '../utils/datetime.mts'
import { FileFinder } from '../utils/FileFinder.mts'
import { getArtifactFilename, mkdir, readSecretFile } from '../utils/fileUtils.mts'
import FtpClient from '../utils/FtpClient.mts'
import Work from '../utils/Work.mts'

type Client = Awaited<ReturnType<typeof FtpClient.connect>>

export const BackupCommand = async () => {
  const FILES = await readSecretFile('files.list')

  const globs = FILES.split('\n').filter((x) => x)

  const datetime = dateTimeString()
  console.log(`Backing up into: ${chalk.green(getArtifactFilename('backup', datetime))}`)

  let client: Client
  try {
    const ftpRoot = FtpClient.serverRoot

    client = await FtpClient.connect()
    const ff = new FileFinder({ client, root: ftpRoot })

    for (const [, glob] of globs.entries()) {
      const { isComment } = checkComment(glob)
      if (isComment) {
        continue
      }

      const matches = await Work.do(`Pattern "${glob}": #`, () => ff.match(glob))

      for (const match of matches) {
        await handleMatch(ftpRoot, match, datetime, client)
      }
    }
  } catch (err) {
    console.error('fel', err)
  } finally {
    client!?.close()
  }
}

const checkComment = (glob: string) => {
  const re = /^[\s#]+/
  const isComment = re.test(glob)

  if (isComment) {
    const stripped = glob.replace(re, '')
    if (stripped !== '') {
      console.log(chalk.dim(`Pattern "${stripped}" `) + chalk.yellow('IGNORED'))
    }
  }

  return { isComment }
}

async function handleMatch(ftpRoot: string, match: string, datetime: string, client: Client) {
  const relativeArtifactFilename = p.relative(ftpRoot, match)
  await Work.do(
    chalk.dim(`  Downloading match "${relativeArtifactFilename}" #`),
    async () => {
      const artifactFilename = getArtifactFilename('backup', datetime, relativeArtifactFilename)
      await mkdir(p.dirname(artifactFilename))
      const res = await client.downloadTo(artifactFilename, match)
      return { success: res.code >= 200 && res.code < 300 }
    },
    ({ success }) => {
      if (success) {
        return chalk.reset.green('DONE')
      } else {
        return chalk.reset.red('FAILED')
      }
    },
  )
}
