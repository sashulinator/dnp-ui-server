import fs from 'fs'
import path from 'path'
import readline from 'readline'
import util from 'util'

import { getCurrentBranch } from '../git'
import { FILE_PATH } from './FILE_PATH'

const exec = util.promisify(require('child_process').exec)

run()

async function run() {
  const currentBranch = await getCurrentBranch()

  // Проверка на CI/CD
  if (currentBranch === 'HEAD') {
    return
  }

  processLineByLine(path.join(__dirname, FILE_PATH), async (line) => {
    const [pathName, remote] = line.split(' ').filter((part) => part !== '')

    exec(`git fetch ${remote} main`).then(async (fetchRet) => {
      const currentBranch = (await exec(`git branch --show-current`)).stdout.trim()

      exec(`git --no-pager diff --stat "${remote}/main" "${currentBranch}:${pathName}"`).then((diffRet) => {
        // Если изменений нет то команда ничего не выдаст

        if (fetchRet.stdout) console.log(fetchRet.stdout)

        if (diffRet.stdout) {
          console.log(`"${remote}" has changes`)
          console.log('to see details:')
          console.log(`git --no-pager diff --stat "${remote}/main" "${currentBranch}:${pathName}"`)
          console.log('to push:')
          console.log(`git subtree push --prefix=${pathName} ${remote} main`)
          console.log('force push:')
          console.log(`git push ${remote} \`git subtree split --prefix=${pathName} @\`:main --force`)
          console.log('------')
        }
      })
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
