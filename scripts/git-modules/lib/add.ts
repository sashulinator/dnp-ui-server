import { green, red } from 'colors'

import { addSubtree } from '../../git'

export async function add(pathName: string, remote: string) {
  try {
    const addSubtreeRet = await addSubtree(pathName, remote)
    console.log('-----------')
    addSubtreeRet.stderr ? console.log(red(addSubtreeRet.stderr)) : console.log(green(addSubtreeRet.stderr))
    return
  } catch (e) {
    console.log(red(e))
  }
}
