export type ToDatabaseUrlParams = {
  user: string
  password: string
  database: string
  host: string
  port: number
  client: string
}

export function toDatabaseUrl(params: ToDatabaseUrlParams): string {
  return `${params.client}://${params.host}:${params.port}/${params.database}?user=${params.user}&password=${params.password}`
}
