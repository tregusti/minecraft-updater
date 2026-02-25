const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const frequency = 80

const RESTART_LINE = `\r`
const CLEAR_LINE = `\x1B[K`

/**
 * Write a line of text with a spinner in it.
 *
 * Insert the placeholder (#) where you want the spinner to appear.
 * @param text
 */
const create = (text: string) => {
  const interval = setInterval(() => {
    const frame = frames[Math.floor(Date.now() / frequency) % frames.length]
    process.stdout.write(RESTART_LINE + text.replace('#', frame) + CLEAR_LINE)
  }, frequency)

  return (completeText?: string) => {
    clearInterval(interval)
    process.stdout.write(RESTART_LINE + text.replace('#', completeText || '') + CLEAR_LINE + '\n')
  }
}

export default { create }
