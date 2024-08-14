import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient, type Process as PrismaProcess } from '@prisma/client'
import MinioService from '~/shared/minio/service'
import PrismaService from '../../shared/prisma/service'
import { DelegateService } from '~/shared/delegate-service'

export type WhereUniqueInput = Prisma.ProcessWhereUniqueInput
export type WhereInput = Prisma.ProcessWhereInput
export type OrderByWithRelationInput = Prisma.ProcessOrderByWithRelationInput
export type Select = Prisma.ProcessSelect

@Injectable()
export default class Service extends DelegateService<PrismaService['process']> {
  constructor(
    protected prisma: PrismaService,
    protected minio: MinioService
  ) {
    super(prisma, prisma.process)
  }

  async create(...args: Parameters<PrismaClient['process']['create']>): Promise<PrismaProcess> {
    const { data } = args[0]
    // Retrieve the normalizationConfig from the database
    const normalizationConfig = await this.prisma.normalizationConfig.findUnique({
      where: { id: data.normalizationConfigId },
    })

    // Throw an error if the normalizationConfig is not found
    if (!normalizationConfig) {
      throw new HttpException(
        `NormalizationConfig with id=${data.normalizationConfigId} not found`,
        HttpStatus.NOT_FOUND
      )
    }

    // Prepare the filename and buffer for uploading to Minio
    const fileName = `${normalizationConfig.name}.json`
    const buffer = JSON.stringify(normalizationConfig.data)

    // Upload the normalizationConfig to Minio
    await this.minio.putObject('dnp-common', fileName, buffer)

    // Set the headers for the HTTP request
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from('airflow:airflow').toString('base64'))
    headers.set('Content-Type', 'application/json;charset=UTF-8')

    // Trigger the Airflow DAG run
    await fetch('http://10.4.40.30:8080/api/v1/dags/dnp_rest_api_trigger/dagRuns', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conf: {
          dnp_s3_config_path: `dnp-common/${fileName}`,
        },
      }),
    })

    return this.prisma.process.create({
      data: {
        normalizationConfigId: data.normalizationConfigId,
        id: createId(),
        createdById: 'tz4a98xxat96iws9zmbrgj3a',
      },
    })
  }
}
