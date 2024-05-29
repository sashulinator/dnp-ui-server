import fs from 'fs'
import path from 'path'
import readline from 'readline'
import util from 'util'

import { FILE_PATH } from './FILE_PATH'

const exec = util.promisify(require('child_process').exec)

run()

async function run() {
  processLineByLine(path.join(__dirname, FILE_PATH), async (line) => {
    const [pathName, remote, repo] = line.split(' ').filter((part) => part !== '')

    exec(`git remote add ${remote} ${repo}`)
      .then((diffRet) => {
        // Если изменений нет то команда ничего не выдаст

        if (diffRet.stdout) {
          console.log(diffRet.stdout)
        }
      })
      .catch((e) => {
        console.error(e.stderr)
      })
  })
}

/**
 * Private
 */

async function processLineByLine(filePath: string, cb: (line: string) => void) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })
  for await (const line of rl) cb(line)
}
