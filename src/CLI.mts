import { Command } from 'commander'

import { BackupCommand } from './commands/backup.mts'
import { CleanCommand } from './commands/clean.mts'
import { UpdateCommand } from './commands/update.mts'
import { UploadCommand } from './commands/upload.mts'
import type { Options } from './types.mts'
import { ensureCorrectCWD } from './utils/CwdValidator.mts'

const program = new Command()
program
  .description('CLI tool to manage our PI Minecraft server config.')
  .option('-d, --debug', 'Enables debug logging for this CLI tool.')
  .option('-D, --deep-debug', 'Enables debugging for all dependencies, not just this CLI tool.')

program
  .command('update')
  .description('Command to download newly updated minecraft plugins.')
  .usage('-n LuckPerms Via')
  .option('-f, --force', 'Forces to download the newest version even if already present.')
  .option('-n, --name [names...]', 'Filter plugins to update by partial name')
  .action((_, command: Command) => {
    ensureCorrectCWD()
    return UpdateCommand(command.opts())
  })

program
  .command('upload')
  .description('Upload newly downloaded minecraft plugins to the server.')
  // .option(
  //   '-f, --force',
  //   'Forces to download the newest version even if already present.'
  // )
  // .option('-n, --name [names...]', 'Filter plugins to update by partial name')
  .action((_, command: Command) => {
    ensureCorrectCWD()
    return UploadCommand(command.opts())
  })

program
  .command('backup')
  .description('Backup all specified coniguration files from the server.')
  .action(() => {
    ensureCorrectCWD()
    return BackupCommand()
  })

program
  .command('clean')
  .description('Remove all old versions of downloaded plugins.')
  .action((_, command: Command) => {
    ensureCorrectCWD()
    return CleanCommand(command.opts())
  })

program.parse()

const options = program.opts() as Options
// if (options.debug) {
//   console.debug('CLI options:', options)
// }
