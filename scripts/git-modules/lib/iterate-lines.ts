import path from 'path'

import { iterateLines as  utilsIterateLines } from '../../utils'
import { FILE_PATH } from '../FILE_PATH';

type Module = { pathName: string; remote: string; repo: string }



export async function iterateLines(cb: (module: Module) => Promise<void>) {
  return utilsIterateLines(path.join(__dirname, FILE_PATH), async (line) => {
    const parts = line.split(' ').filter((part) => part !== '')
    const [pathName, remote, repo] = parts

    if (parts.length !== 3 || !pathName || !remote || !repo) return

    return cb({ pathName, remote, repo })
  })
}
