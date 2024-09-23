export const createImportOperationalTableNormalizationConfig = (
  sourceFileName: string,
  fileExtension: string,
  destinationTable: string,
) => {
  const format = fileExtension === 'csv' ? 'csv' : 'excel'

  return {
    sdk: {
      'storage-provider': 'mixed',
      'write-mode': 'overwrite',
      'provider-config': {
        s3: {
          connections: {
            s3_base: {
              connection: {
                bucket: 'dnp-datastore',
                'dataset-path': `/`,
                format,
                options: {
                  header: 'true',
                  delimiter: ';',
                },
              },
            },
          },
          'config-by-table': {
            dnp_data: {
              'based-on-in': 's3_base',
              in: {
                connection: {
                  'dataset-name': sourceFileName,
                },
              },
            },
          },
        },
        jdbc: {
          connections: {
            jdbc_base: {
              connection: {
                url: 'jdbc:postgresql://10.4.40.11:5432/dnp_db?user=dnp_user&password=dnp_db_password',
                schema: 'public',
                truncate: 'true',
              },
            },
          },
          'config-by-table': {
            dnp_data: {
              'based-on-out': 'jdbc_base',
              out: {
                connection: {
                  dbtable: destinationTable,
                },
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
        'ru.datatech.sdk.service.dataframe.DFactory',
        'ru.datatech.sdk.service.configtables.ConfigTablesFactory',
        'ru.datatech.sdk.service.procedure.ProcedureConfigFactory',
      ],
    },
    'preload-jars': [
      {
        name: 'dnp-common/artifacts/functions/DnpFunctions',
        version: '0.0.1',
      },
    ],
    'driver-universal-services': ['ru.datatech.functions.DnpStringFunctions', 'ru.datatech.functions.DnpTaxFunctions'],
    executables: [
      {
        'computable-config': {
          'computable-name': 'dnp-common/artifacts/procedures/DnpDataPostprocessing',
          version: '0.0.1',
        },
        'sdk-config': {
          'sdk-name': 'risk-engine-corp-sdk',
          version: '1.1.2',
        },
      },
    ],
    spark: {
      'app.name': 'dnp-demo-dev',
    },
  }
}
