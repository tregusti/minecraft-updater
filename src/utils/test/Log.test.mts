import Log from '../Log.mts'
import { jest } from '@jest/globals'
import stripAnsi from 'strip-ansi'

let stdoutResult = ''
let stderrResult = ''
process.stdout.write = jest.fn((str: string) => {
  stdoutResult += stripAnsi(str)
  return true
})
process.stderr.write = jest.fn((str: string) => {
  stderrResult += stripAnsi(str)
  return true
})

describe('Log', () => {
  beforeEach(() => {
    stdoutResult = ''
    stderrResult = ''
  })
  it('formats the output according to <level> <logger> <text><newline>', () => {
    const logger = new Log('Colorizer')
    logger.info('green')
    expect(stdoutResult).toContain('INFO Colorizer: green\n')
  })
  it('outputs multiplpe invokations on separate lines', () => {
    const logger = new Log('Colorizer')
    logger.info('green')
    logger.info('red')
    expect(stdoutResult).toContain('INFO Colorizer: green\nINFO Colorizer: red')
  })
  it('formats an object', () => {
    const logger = new Log('Formatter')
    logger.info({ a: 1, b: 'text' })
    expect(stdoutResult).toContain('INFO Formatter: {"a":1,"b":"text"}')
  })
  describe('#info', () => {
    it('writes to stdout', () => {
      const logger = new Log('Magenta')
      logger.info('pink')
      expect(stdoutResult).toContain('pink')
    })
    it('writes the prefix', () => {
      const logger = new Log('Magenta')
      logger.info()
      expect(stdoutResult).toContain('Magenta')
    })
    it('writes the level', () => {
      const logger = new Log('')
      logger.info()
      expect(stdoutResult).toContain('INFO')
    })
    it('starts a new line when in append mode', () => {
      const logger = new Log('Subject')
      logger.info('blue', Log.WillAppend)
      logger.info('red')
      expect(stdoutResult).toContain('INFO Subject: blue\nINFO Subject: red')
    })
  })
  describe('#warning', () => {
    it('writes to stdout', () => {
      const logger = new Log('')
      logger.warning('yellow')
      expect(stdoutResult).toContain('yellow')
    })
    it('writes the level', () => {
      const logger = new Log('')
      logger.warning()
      expect(stdoutResult).toContain('WARN')
    })
  })
  describe('#error', () => {
    it('writes to stderr', () => {
      const logger = new Log('')
      logger.error('red')
      expect(stderrResult).toContain('red')
    })
    it('writes the level', () => {
      const logger = new Log('')
      logger.error()
      expect(stderrResult).toContain('ERR')
    })
  })
  describe('#debug', () => {
    describe('when not in debug mode', () => {
      it('does not output anything', () => {
        const logger = new Log('')
        logger.debug('black')
        expect(stdoutResult).toEqual('')
        expect(stderrResult).toEqual('')
      })
      it('does not append to output', () => {
        const logger = new Log('')
        logger.debug('red', Log.WillAppend)
        logger.append(' roses')
        expect(stdoutResult).toEqual('')
        expect(stderrResult).toEqual('')
      })
    })
    it('outputs when sending the -d flag', () => {
      process.argv.push('-d')
      const logger = new Log('')
      logger.debug('purple')
      process.argv.pop() // remove -d flag again to not affect other tests
      expect(stdoutResult).toContain('purple')
      expect(stdoutResult).toContain('DEBUG')
    })
  })
  describe('appending', () => {
    it('can prevent newline', () => {
      const logger = new Log('')
      logger.info('red', Log.WillAppend)
      logger.append('blue')
      expect(stdoutResult).toContain('redblue')
    })
    it('writes to previous stream', () => {
      const logger = new Log('')
      logger.error('red', Log.WillAppend)
      logger.append('blue')
      expect(stdoutResult).toEqual('')
      expect(stderrResult).toContain('redblue')
    })
    it('will warn when not in append mode', () => {
      const logger = new Log('Subject')
      logger.append('blue')
      expect(stdoutResult).toContain('WARN Log: Logger Subject')
      expect(stdoutResult).toContain('INFO Subject: blue')
    })
  })
})
