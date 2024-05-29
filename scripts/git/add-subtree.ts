import util from 'util'

import { ExecResult } from '../types/exec-result'

const exec = util.promisify(require('child_process').exec)

export function addSubtree(pathName: string, remote: string): Promise<ExecResult> {
  return exec(`git subtree add --prefix=${pathName} ${remote} main`)
}
