const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const frequency = 80

/**
 * Write a line of text with a spinner in it.
 *
 * Insert the placeholder (#) where you want the spinner to appear.
 * @param text
 */
const create = (text: string) => {
  const interval = setInterval(() => {
    const frame = frames[Math.floor(Date.now() / frequency) % frames.length]
    process.stdout.write(`\r${text.replace('#', frame)}`)
  }, frequency)

  return (completeText?: string) => {
    clearInterval(interval)
    process.stdout.write(`\r${text.replace('#', completeText || '')}\n`)
  }
}

export default { create }
