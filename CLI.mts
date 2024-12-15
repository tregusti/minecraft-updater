import { Command } from 'commander'

interface Options {
  debug: boolean
  name?: string[]
  force: boolean
}
const program = new Command()
program
  .name('npm run update')
  .usage('')
  .usage('-- -d')
  .usage('-- -n LuckPerms Via')
  .description('CLI tool to download newly updated minecraft plugins.')
program.option('-d, --debug')
program.option(
  '-f, --force',
  'Forces to download the newest version even if already present.'
)
program.option(
  '-n, --name <names...>',
  'Filter plugins to update by partial name'
)
program.parse()

const options = program.opts() as Options

options.debug && console.debug('CLI options:', options)

export { options as Options }
