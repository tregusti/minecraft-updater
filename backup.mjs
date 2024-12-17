import chalk from 'chalk'
import p from 'path'
import { dateTimeString } from './utils/datetime.mjs'
import { FileFinder } from './utils/FileFinder.mjs'
import { mkdir, readFile } from './utils/fileUtils.mjs'
import FtpClient from './utils/FtpClient.mjs'
import Log from './utils/Log.mjs'
import { Matcher } from './utils/Matcher.mjs'

const globs = (await readFile('files.list')).split('\n').filter((x) => x)
const logger = new Log('Backup')

const datetime = dateTimeString()
let client
try {
  const reComment = /^\s*#\s*/
  const root = '/default'

  client = await FtpClient.connect()
  const ff = new FileFinder({ client, root })

  for (const [, glob] of globs.slice(5, 11).entries()) {
    if (reComment.test(glob)) {
      const stripped = glob.replace(reComment, '')
      logger.info(chalk.dim(stripped + '... ') + chalk.yellow('IGNORED'))
      continue
    }

    const matches = await ff.match(glob)

    logger.debug(`glob "${glob}" matches: "${matches.join('", "')}"`)

    for (const match of matches) {
      const outFile = p.relative(root, p.dirname(match))
      const dirname = p.join('backup', datetime, outFile)
      await mkdir(dirname)
      logger.info(`Downloading "${match}"... `, Log.WillAppend)
      const res = await client.downloadTo(`${dirname}/${p.basename(match)}`, match)
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
