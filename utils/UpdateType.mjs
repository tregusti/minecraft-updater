const Plugin = Symbol('Plugin')
const Paper = Symbol('Paper')

export const UpdateType = {
  Plugin,
  Paper,

  validate(type) {
    if (![Plugin, Paper].includes(type)) {
      throw new TypeError('Not a valid UpdateType: ', type)
    }
  },
}
