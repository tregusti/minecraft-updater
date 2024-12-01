import p from 'path'
import { mkdir, readFile } from './utils/fileUtils.mjs'
import { Client } from 'basic-ftp'
import { dateTimeString } from './utils/datetime.mjs'
import chalk from 'chalk'

const DEBUG = process.argv.includes('-d')
const PASSWORD = await readFile('.apex_secret')
const globs = (await readFile('files.list')).split('\n').filter((x) => x)

const client = new Client()
client.ftp.verbose = DEBUG

const datetime = dateTimeString()

try {
  await client.access({
    host: '5520.node.apexhosting.gdn',
    user: 'glenn@tregusti.com.2568190',
    password: PASSWORD,
  })
  await client.cd('default')
  const reComment = /^\s*#\s*/
  // console.log(await client.list())
  for (const glob of globs) {
    if (reComment.test(glob)) {
      console.log(chalk.dim(glob.replace(reComment, '') + '... ') + chalk.yellow('IGNORED'))
      continue
    }
    process.stdout.write(glob + chalk.dim('... '))
    const dirname = p.join('backup', datetime, p.dirname(glob))
    await mkdir(dirname)
    const res = await client.downloadTo(`${dirname}/${p.basename(glob)}`, `${glob}`)
    if (res.code >= 200 && res.code < 300) {
      console.log(chalk.greenBright('DONE'))
    }
  }
} catch (err) {
  console.log(chalk.redBright('ERROR:'), err)
} finally {
  client.close()
}
