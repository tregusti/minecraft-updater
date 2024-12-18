import chalk from 'chalk'

import Constants from './Constants.mjs'

const Levels = {
  Info: Symbol('Info'),
  Debug: Symbol('Debug'),
  Error: Symbol('Error'),
  Warning: Symbol('Warning'),
}

const WillAppend = Symbol('WillAppend')

export default class Log {
  static get Levels() {
    return Levels
  }

  static get WillAppend() {
    return WillAppend
  }

  #appendLevel = null
  #name = null
  constructor(name) {
    this.#name = name
  }
  #writePrefix(level) {
    const [prefix, method] =
      level === Log.Levels.Warning
        ? ['WARN', chalk.yellow]
        : level === Log.Levels.Error
        ? ['ERROR', chalk.red]
        : level === Log.Levels.Debug
        ? ['DEBUG', chalk.dim]
        : ['INFO', chalk.reset]
    const name = chalk.cyan.bold(this.#name)

    this.#writeToStream(level, `${method(prefix)} ${name}: `)
  }

  // Clean this method up. It's cluttered with stuffs.
  #write({ level, appending } = {}, ...params) {
    const willAppend = Log.WillAppend === params.at(-1)
    const currentAppendLevel = this.#appendLevel
    if (willAppend) {
      this.#appendLevel = level
      params.pop()
    } else {
      this.#appendLevel = null
    }
    const output = params.map((param) => String(param)).join(' ')
    // const stream = this.#stream(appending ? currentAppendLevel : level)
    const streamLevel = appending ? currentAppendLevel : level
    if (willAppend) {
      this.#writeToStream(streamLevel, output)
    } else {
      this.#writeToStream(streamLevel, output + '\n')
    }
  }

  #allowWriteForLevel(level) {
    const notDebugging = !Constants.DEBUG && level !== Levels.Debug
    const isDebugging = Constants.DEBUG && level === Levels.Debug
    return notDebugging || isDebugging
  }
  #writeToStream(level, output) {
    if (this.#allowWriteForLevel(level)) {
      const stream = level === Log.Levels.Error ? process.stderr : process.stdout
      stream.write(output)
    }
  }

  #resetAppend() {
    if (this.#appendLevel) {
      // End previous line in correct stream
      this.#writeToStream(this.#appendLevel, '\n')
      // this.#stream(this.#appendLevel).write('\n')
    }
    this.#appendLevel = null
  }

  append(...params) {
    if (!this.#appendLevel) {
      logger.warning(`Logger ${this.#name} is trying to append to line when not in append mode.`)
      this.info(...params)
    } else if (this.#allowWriteForLevel(this.#appendLevel)) {
      this.#write({ appending: true }, ...params)
    }
  }

  info(...params) {
    this.#resetAppend()
    const level = Log.Levels.Info
    this.#writePrefix(level)
    this.#write({ level }, ...params)
  }
  warning(...params) {
    this.#resetAppend()
    const level = Log.Levels.Warning
    this.#writePrefix(level)
    this.#write({ level }, ...params)
  }
  error(...params) {
    this.#resetAppend()
    const level = Log.Levels.Error
    this.#writePrefix(level)
    this.#write({ level }, ...params)
  }
  debug(...params) {
    this.#resetAppend()
    const level = Log.Levels.Debug
    this.#writePrefix(level)
    this.#write({ level }, ...params)
  }
}

const logger = new Log('Log')
