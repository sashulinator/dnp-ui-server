import { baseUrl } from './constants'

export const NAME = 'test-connection'

export const url = `${baseUrl}/${NAME}`

export type RequestParams = {
  client: 'pg'
  host: string
  port: number
  user: string
  password: string
}

export type Result = boolean
