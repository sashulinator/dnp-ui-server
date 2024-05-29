import { red } from 'colors'

import * as git from '../../git'

export async function remove(pathName: string) {
  try {
    const rmRet = await git.removeSubtree(pathName)
    rmRet.stderr ? console.log(red(rmRet.stderr)) : undefined
    rmRet.stdout ? console.log(rmRet.stdout) : undefined
  } catch (e) {
    console.log(red(e))
  }
}
