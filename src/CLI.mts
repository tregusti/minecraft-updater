import { Command } from 'commander'
import { UpdateCommand } from './commands/update.mts'

import type { Options } from './types.mts'
import { ensureCorrectCWD } from './utils/CwdValidator.mts'

const program = new Command()
program
  .description('CLI tool to manage our PI Minecraft server config.')
  .option('-d, --debug')

program
  .command('update')
  .description('Command to download newly updated minecraft plugins.')
  .usage('-n LuckPerms Via')
  .option(
    '-f, --force',
    'Forces to download the newest version even if already present.'
  )
  .option('-n, --name [names...]', 'Filter plugins to update by partial name')
  .action((_, command: Command) => {
    ensureCorrectCWD()
    return UpdateCommand(command.opts())
  })

program.parse()

const options = program.opts() as Options
if (options.debug) {
  console.debug('CLI options:', options)
}
