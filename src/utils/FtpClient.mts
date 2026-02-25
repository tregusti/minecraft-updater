import { Client } from 'basic-ftp'

import Constants from './Constants.mjs'
import { readSecretFile } from './fileUtils.mts'

const PASSWORD = await readSecretFile('.apex_secret')

export default {
  serverRoot: '/default',

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
