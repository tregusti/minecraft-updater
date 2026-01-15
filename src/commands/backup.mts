import chalk from 'chalk'
import p from 'path'
import { dateTimeString } from '../utils/datetime.mts'
import { FileFinder } from '../utils/FileFinder.mts'
import {
  getArtifactFilename,
  mkdir,
  readSecretFile,
} from '../utils/fileUtils.mts'
import FtpClient from '../utils/FtpClient.mts'
import Log from '../utils/Log.mts'

export const BackupCommand = async () => {
  const FILES = await readSecretFile('files.list')

  const globs = FILES.split('\n').filter((x) => x)
  const logger = new Log('Backup')

  const datetime = dateTimeString()
  logger.info(
    `Backing up into: ${chalk.greenBright(
      getArtifactFilename('backup', datetime)
    )}`
  )

  let client
  try {
    const reComment = /^[\s#]+/
    const ftpRoot = FtpClient.serverRoot

    client = await FtpClient.connect()
    const ff = new FileFinder({ client, root: ftpRoot })

    for (const [, glob] of globs.entries()) {
      if (reComment.test(glob)) {
        const stripped = glob.replace(reComment, '')
        if (stripped === '') {
          // Empty comment
          continue
        }
        const prefix = `Pattern "${stripped}" `
        logger.info(chalk.dim(prefix) + chalk.yellow('IGNORED'))
        continue
      }

      logger.info(`Pattern "${glob}":`)

      const matches = await ff.match(glob)

      logger.debug(`glob "${glob}" matches: "${matches.join('", "')}"`)

      for (const match of matches) {
        const relativeArtifactFilename = p.relative(ftpRoot, match)
        const artifactFilename = getArtifactFilename(
          'backup',
          datetime,
          relativeArtifactFilename
        )
        await mkdir(p.dirname(artifactFilename))
        logger.info(
          `  Downloading match "${relativeArtifactFilename}"... `,
          Log.WillAppend
        )
        const res = await client.downloadTo(artifactFilename, match)
        if (res.code >= 200 && res.code < 300) {
          logger.append(chalk.greenBright('DONE'))
        }
      }
    }
  } catch (err) {
    logger.error(err)
  } finally {
    client?.close()
  }
}
