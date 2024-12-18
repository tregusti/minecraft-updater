import p from 'path'
import { Client } from 'basic-ftp'
import Constants from './Constants.mjs'
import { readFile } from './fileUtils.mjs'

const PASSWORD = await readFile(p.resolve(import.meta.dirname, '.apex_secret'))

export default {
  async connect() {
    const client = new Client()

    client.ftp.verbose = Constants.DEEP_DEBUG

    await client.access({
      host: '5520.node.apexhosting.gdn',
      user: 'glenn@tregusti.com.2568190',
      password: PASSWORD,
    })

    return client
  },
}
