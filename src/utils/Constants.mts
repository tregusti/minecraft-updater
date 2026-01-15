// Hmm, not really constants. But must be late for test to be able to
// be affected by addeing to argv.

export default {
  get DEBUG() {
    return process.argv.includes('-d') || !!process.env.MC_DEBUG
  },
  get DEEP_DEBUG() {
    return process.argv.includes('-dd') || !!process.env.MC_DEEP_DEBUG
  },
  get NO_VERSION() {
    return '0.0.0-unknown'
  },
}
