import Log from '../Log.mjs'
import { jest } from '@jest/globals'
import stripAnsi from 'strip-ansi'

process.stdout.write = jest.fn((str) => (process.stdout.result += stripAnsi(str)))
process.stderr.write = jest.fn((str) => (process.stderr.result += stripAnsi(str)))

describe('Log', () => {
  beforeEach(() => {
    process.stdout.result = ''
    process.stderr.result = ''
  })
  it('formats the output according to <level> <logger> <text><newline>', () => {
    const logger = new Log('Colorizer')
    logger.info('green')
    expect(process.stdout.result).toContain('INFO Colorizer: green\n')
  })
  it('outputs multiplpe invokations on separate lines', () => {
    const logger = new Log('Colorizer')
    logger.info('green')
    logger.info('red')
    expect(process.stdout.result).toContain('INFO Colorizer: green\nINFO Colorizer: red')
  })
  describe('#info', () => {
    it('writes to stdout', () => {
      const logger = new Log('Magenta')
      logger.info('pink')
      expect(process.stdout.result).toContain('pink')
    })
    it('writes the prefix', () => {
      const logger = new Log('Magenta')
      logger.info()
      expect(process.stdout.result).toContain('Magenta')
    })
    it('writes the level', () => {
      const logger = new Log()
      logger.info()
      expect(process.stdout.result).toContain('INFO')
    })
    it('starts a new line when in append mode', () => {
      const logger = new Log('Subject')
      logger.info('blue', Log.WillAppend)
      logger.info('red')
      expect(process.stdout.result).toContain('INFO Subject: blue\nINFO Subject: red')
    })
  })
  describe('#warning', () => {
    it('writes to stdout', () => {
      const logger = new Log()
      logger.warning('yellow')
      expect(process.stdout.result).toContain('yellow')
    })
    it('writes the level', () => {
      const logger = new Log()
      logger.warning()
      expect(process.stdout.result).toContain('WARN')
    })
  })
  describe('#error', () => {
    it('writes to stderr', () => {
      const logger = new Log()
      logger.error('red')
      expect(process.stderr.result).toContain('red')
    })
    it('writes the level', () => {
      const logger = new Log()
      logger.error()
      expect(process.stderr.result).toContain('ERR')
    })
  })
  describe('#debug', () => {
    describe('when not in debug mode', () => {
      it('does not output anything', () => {
        const logger = new Log()
        logger.debug('black')
        expect(process.stdout.result).toEqual('')
        expect(process.stderr.result).toEqual('')
      })
      it('does not append to output', () => {
        const logger = new Log()
        logger.debug('red', Log.WillAppend)
        logger.append(' roses')
        expect(process.stdout.result).toEqual('')
        expect(process.stderr.result).toEqual('')
      })
    })
    it('outputs when sending the -d flag', () => {
      process.argv.push('-d')
      const logger = new Log()
      logger.debug('purple')
      process.argv.pop() // remove -d flag again to not affect other tests
      expect(process.stdout.result).toContain('purple')
      expect(process.stdout.result).toContain('DEBUG')
    })
  })
  describe('appending', () => {
    it('can prevent newline', () => {
      const logger = new Log()
      logger.info('red', Log.WillAppend)
      logger.append('blue')
      expect(process.stdout.result).toContain('redblue')
    })
    it('writes to previous stream', () => {
      const logger = new Log()
      logger.error('red', Log.WillAppend)
      logger.append('blue')
      expect(process.stdout.result).toEqual('')
      expect(process.stderr.result).toContain('redblue')
    })
    it('will warn when not in append mode', () => {
      const logger = new Log('Subject')
      logger.append('blue')
      expect(process.stdout.result).toContain('WARN Log: Logger Subject')
      expect(process.stdout.result).toContain('INFO Subject: blue')
    })
  })
})
