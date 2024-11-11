import { saveFile } from './fileUtils.mjs'
import { chmod, constants } from 'fs/promises'
import path from 'path'
import dedent from 'string-dedent'

import { UpdateType } from './UpdateType.mjs'
import { unsubscribe } from 'diagnostics_channel'

export class ScriptGenerator {
  #entries = new Array()

  static #generateRemoteFilename(type, filename) {
    UpdateType.validate(type)
    if (type === UpdateType.Plugin) {
      return path.join('plugins', filename)
    }
    if (type === UpdateType.Paper) {
      return 'jar/paper-manual-update.jar'
    }
  }

  static #generateEntry([type, filename]) {
    const localFile = path.join(import.meta.dirname, '../downloads', filename)
    const remoteFile = ScriptGenerator.#generateRemoteFilename(type, filename)
    const localBasename = path.basename(localFile)
    // console.debug('ScriptG${enerator#generateEntry: ', { pathPrefix, localFile, remoteFile })

    return dedent`
      put -O /default/ '${localFile}' -o '${remoteFile}' &&\\
      echo 'Uploaded: ${localBasename}' ||\\
      echo 'Failed upload: ${localBasename}';\\
    `

    // return `put -O /default/ "${localFile}" -o "${remoteFile}" ; !echo Uploaded: $(basename \\"${localFile}\\")`
    // return `ncftpput -f $SECRET_FILE -C "${localFile}" "${remoteFile}"`
  }

  #generateShellScript() {
    if (this.#entries.length > 0) {
      const commands = this.#entries.map(ScriptGenerator.#generateEntry).join('\n\\\n')
      // See: https://lftp.yar.ru/lftp-man.html
      const username = 'glenn@tregusti.com.2568190'
      const hostname = '5520.node.apexhosting.gdn'
      return dedent`
        #!/bin/bash
        echo "\\
        ${commands}
        " | LFTP_PASSWORD=$(cat $(dirname $0)/.apex_secret) lftp -u "${username}" --env-password ${hostname}
      `

      // commands.push(
      //   '#!/bin/bash\n',
      //   `LFTP_PASSWORD=$(cat $(dirname $0)/.apex_secret) lftp -u "glenn@tregusti.com.2568190" --env-password 5520.node.apexhosting.gdn -c '`,
      //   ...this.#entries.map(this.#generateEntry.bind(this)).join('\\\n ; '),
      //   ` ; exit'`
      // )
    }
    return null
  }

  add(type, filename) {
    // console.debug('ScriptGenerator#add: ', { type, filename })
    this.#entries.push([type, filename])
  }
  async create() {
    const buffer = this.#generateShellScript()
    if (!buffer) {
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
