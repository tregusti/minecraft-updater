export const dateTimeString = () => {
  const date = new Intl.DateTimeFormat('sv-SE').format(new Date()).replace(/-/g, '')
  const time = new Date().toLocaleTimeString().replace(/:/g, '')
  return `${date}-${time}`
}
