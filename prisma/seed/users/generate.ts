import { createId } from '@paralleldrive/cuid2'
import { type Prisma } from '@prisma/client'

type CreateInput = Prisma.UserUncheckedCreateInput

export default function generate(_, iteration: number): CreateInput {
  const instance: CreateInput = {
    id: createId(),
    name: `Seededname${iteration}`,
    avatar:
      'https://play-lh.googleusercontent.com/ccszZWb16OvEbitvRrk6MI4AXrWeTfSMAK-qB1Z0IYZvnob-SPctGcTR_CJgBsxg3N8=s128',
    password: 'password',
  }
  return instance
}
