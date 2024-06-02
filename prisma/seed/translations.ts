import { type PrismaClient } from '@prisma/client'

export async function seedTranslations(prisma: PrismaClient) {
  // pages
  // ru
  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs',
      ns: 't',
      locale: 'ru',
      data: 'Конфигурации Нормализаций',
    },
  })

  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs_id',
      ns: 't',
      locale: 'ru',
      data: 'Конфигурация Нормализации',
    },
  })

  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs_create',
      ns: 't',
      locale: 'ru',
      data: 'Создать Конфигурацию Нормализации',
    },
  })

  // pages
  // en
  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs',
      ns: 't',
      locale: 'en',
      data: 'Normalization Configs',
    },
  })

  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs_id',
      ns: 't',
      locale: 'en',
      data: 'Normalization Config',
    },
  })

  await prisma.translation.create({
    data: {
      key: 'pages.normalizationConfigs_create',
      ns: 't',
      locale: 'en',
      data: 'Create Normalization Config',
    },
  })
}
