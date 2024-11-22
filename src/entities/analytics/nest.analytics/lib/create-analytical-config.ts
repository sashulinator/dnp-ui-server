import { toDatabaseUrl } from '~/utils/database'

interface CreateConfigParams {
  tableName: string
  schemaName: string
  executableStats: {
    [key: string]: string
  }
  host: string
  port: number
  user: string
  password: string
  database: string
  client: string
}

export const createAnalyticsConfig = ({
  host,
  port,
  user,
  password,
  database,
  client,
  tableName,
  schemaName,
  executableStats,
}: CreateConfigParams) => {
  const baseUrlIn = `jdbc:${toDatabaseUrl({
    client: client,
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,
  })}`
  const baseUrlOut = 'jdbc:postgresql://10.4.40.11:5432/target?user=dnp_user&password=dnp_db_password'
  const dbTableOut = 'analyticReport'

  return {
    sdk: {
      'storage-provider': 'jdbc',
      'write-mode': 'append',
      'provider-config': {
        'default-input-schema': 'jdbc_in',
        connections: {
          jdbc_in: {
            connection: {
              url: baseUrlIn,
              schema: schemaName,
            },
          },
        },
        'config-by-table': {
          dnp_data: {
            out: {
              connection: {
                url: baseUrlOut,
                schema: 'public',
                dbtable: dbTableOut,
              },
            },
          },
        },
      },
      dnp: {
        'main-contour': 'TEST',
        contour: 'TEST',
        format: 'dd.MM.yyyy',
        'report-dt': '01.01.1991',
        'config-tables-path': 's3a://dnp-case-4/configtables',
        'config-tables-max-size': 300,
      },
      'universal-services': [
        'ru.datatech.engine.sdk.service.dataframe.CorpDataFrameServiceFactory',
        'ru.datatech.engine.sdk.service.configtables.ConfigTablesFactory',
      ],
    },
    'preload-jars': [
      {
        name: 'dnp-common/artifacts/functions/DnpFunctions',
        version: '2.0.0',
      },
    ],
    'driver-universal-services': ['ru.datatech.functions.DnpStringFunctions', 'ru.datatech.functions.DnpTaxFunctions'],
    executables: [
      {
        'computable-config': {
          'computable-name': 'dnp-common/artifacts/procedures/DnpTableStats',
          version: '2.0.0',
        },
        'sdk-config': {
          name: 'risk-engine-corp-sdk',
          version: '2.0.1-beta',
        },
        parameters: {
          id: '1',
          table: tableName,
          stats: { ...executableStats },
        },
      },
    ],
    'computable-factory': 'ru.datatech.engine.sdk.compute.BaseSDKProcedureFactory',
    'computables-prefix': 'ru.datatech.procedures',
    'calc-id': 909,
    spark: {
      'app.name': 'dnp-demo-dev',
    },
  }
}
