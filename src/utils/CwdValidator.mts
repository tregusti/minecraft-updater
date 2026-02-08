import chalk from 'chalk'
import p from 'path'
import dedent from 'dedent'
import PackageJson from '../../package.json' assert { type: 'json' }

const __dirname = import.meta.dirname

/**
 * Validate that we are in the correct folder before processing anything else.
 */
export const ensureCorrectCWD = () => {
  const cwd = process.cwd()
  const rootdir = p.resolve(__dirname, '..', '..')

  if (cwd !== rootdir) {
    const strNav = chalk.yellowBright(`cd ${rootdir}`)
    const strCmd = chalk.yellowBright(`${PackageJson.name} ${process.argv.slice(2).join(' ')}`)
    console.error(
      chalk.red(dedent`
        '${PackageJson.name}' tool should be invoked from the correct folder.
    
        Navigate there with:
          ${strNav}
        
        The invoke your command again:
          ${strCmd}
      `),
    )
    process.exit(3)
  }
}
