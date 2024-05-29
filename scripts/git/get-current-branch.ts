import util from 'util'

import { ExecResult } from '../types/exec-result'

const exec = util.promisify(require('child_process').exec)

export async function getCurrentBranch(): Promise<string> {
  const ret = (await exec(`git rev-parse --abbrev-ref HEAD`)) as ExecResult
  return ret.stdout.trim()
}
