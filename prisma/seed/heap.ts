import { type PrismaClient } from '@prisma/client'

export async function seedHeap(prisma: PrismaClient) {
  const heapData = [
    {
      name: 'navMenu',
      description: 'Меню навигации',
      data: [
        {
          name: 'Google',
          icon: '',
          description: 'Гугл',
          link: 'https://google.com',
        },
        {
          name: 'WorkLinks',
          description: 'Рабочие ссылки',
          children: [
            { name: 'Яндекс', icon: '', description: 'Яндекс', link: 'https://ya.ru' },
            {
              name: 'Радикс',
              icon: 'icon3.png',
              description: 'Радикс',
              link: 'https://www.radix-ui.com/',
              children: { name: 'Иконки', icon: '', description: 'Иконки', link: 'https://www.radix-ui.com/icons' },
            },
          ],
        },
      ],
    },
  ]

  for (const heap of heapData) {
    await prisma.heap.create({
      data: heap,
    })
  }
}
