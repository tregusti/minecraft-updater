import { saveFile } from './fileUtils.mjs'
import { chmod, constants } from 'fs/promises'
import path from 'path'

import { UpdateType } from './UpdateType.mjs'

export class ScriptGenerator {
  #entries = new Array()

  #generateRemoteFilename(type, filename) {
    UpdateType.validate(type)
    if (type === UpdateType.Plugin) {
      return path.join('plugins', filename)
    }
    if (type === UpdateType.Paper) {
      return 'jar/paper-manual-update.jar'
    }
  }

  #generateEntry([type, filename]) {
    const localFile = path.join(import.meta.dirname, '../downloads', filename)
    const remoteFile = this.#generateRemoteFilename(type, filename)
    // console.debug('ScriptGenerator#generateEntry: ', { pathPrefix, localFile, remoteFile })
    return `ncftpput -f $SECRET_FILE -C "${localFile}" "${remoteFile}"`
  }

  #generateShellScript() {
    const commands = []
    if (this.#entries.length > 0) {
      // See: https://www.ncftp.com/ncftp/doc/ncftpput.html
      // Example file contents:
      //   host 5520.node.apexhosting.gdn
      //   user glenn@tregusti.com.2568190
      //   pass <PASSWORD HERE>
      commands.push(
        '#!/bin/bash',
        'SECRET_FILE=$(dirname $0)/.apex_secret',
        '',
        ...this.#entries.map(this.#generateEntry.bind(this))
      )
    }
    return commands.join('\n')
  }

  add(type, filename) {
    // console.debug('ScriptGenerator#add: ', { type, filename })
    this.#entries.push([type, filename])
  }
  async create() {
    const buffer = this.#generateShellScript()
    if (buffer.length === 0) {
      return { filename: null }
    }

    const date = new Intl.DateTimeFormat('sv-SE').format(new Date()).replace(/-/g, '')
    const time = new Date().toLocaleTimeString().replace(/:/g, '')
    const filename = `scripts/update-${date}-${time}.sh`

    await saveFile({ filename, buffer })
    await chmod(filename, constants.S_IRWXU | constants.S_IRGRP | constants.S_IROTH)

    return {
      filename,
    }
  }
}
