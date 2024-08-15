import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type Prisma, type Process as PrismaProcess } from '@prisma/client'
import MinioService from '~/shared/minio/service'
import PrismaService from '../../shared/prisma/service'
import { CrudService } from '~/shared/crud-service'

export type Process = PrismaProcess
export type CreateProcess = Prisma.ProcessUncheckedCreateInput
export type UpdateProcess = Prisma.ProcessUncheckedUpdateInput

export type WhereUniqueInput = Prisma.ProcessWhereUniqueInput
export type WhereInput = Prisma.ProcessWhereInput
export type Include = Prisma.ProcessInclude
export type OrderByWithRelationInput = Prisma.ProcessOrderByWithRelationInput
export type Select = Prisma.ProcessSelect

@Injectable()
export default class Service extends CrudService<Process, CreateProcess, UpdateProcess> {
  constructor(
    protected prisma: PrismaService,
    protected minio: MinioService
  ) {
    const include: Include = { normalizationConfig: true, createdBy: true }
    const orderBy: OrderByWithRelationInput = { createdAt: 'desc' }

    super(
      {
        take: 100,
        orderBy,
        include,
      },
      {
        count: prisma.process.count.bind(prisma),
        create: prisma.process.create.bind(prisma),
        delete: CrudService.notAllowed,
        update: CrudService.notAllowed,
        getFirst: prisma.process.findFirstOrThrow.bind(prisma),
        getUnique: prisma.process.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.process.findFirst.bind(prisma),
        findMany: prisma.process.findMany.bind(prisma),
        findUnique: prisma.process.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      }
    )
  }

  async create(params: { data: CreateProcess; select?: Select; include?: Include }): Promise<Process> {
    // Retrieve the normalizationConfig from the database
    const normalizationConfig = await this.prisma.normalizationConfig.findUnique({
      where: { id: params.data.normalizationConfigId },
    })

    // Throw an error if the normalizationConfig is not found
    if (!normalizationConfig) {
      throw new HttpException(
        `NormalizationConfig with id=${params.data.normalizationConfigId} not found`,
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

    return super.create(params)
  }
}
