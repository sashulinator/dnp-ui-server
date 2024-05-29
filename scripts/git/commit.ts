import util from 'util'

import { ExecResult } from '../types/exec-result'

const exec = util.promisify(require('child_process').exec)

export function commit(message: string): Promise<ExecResult> {
  return exec(`git commit -m '${message}' --no-verify`)
}
