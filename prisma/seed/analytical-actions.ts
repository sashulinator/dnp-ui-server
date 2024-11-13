import { type PrismaClient } from '@prisma/client'

export async function seedAnalyticalActions(prisma: PrismaClient) {
  const actionData = [
    {
      id: 1,
      group: 'Метрики таблиц',

      display: 'Кол-во строк',
      name: 'Count Row',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 2,
      group: 'Метрики таблиц',

      display: 'Кол-во столбцов',
      name: 'Count Column',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 3,
      group: 'Метрики столбцов',

      display: 'Количество отличительных значений',
      name: '-',
      description:
        'Количество уникальных записей в столбце. Оно показывает, сколько различных значений встречается в столбце. ',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 4,
      group: 'Метрики столбцов',

      display: 'Количество незаполненных значений',
      name: '-',
      description:
        'Количество значений, которые отсутствуют или не заполнены в столбце. Пропущенные значения могут возникать из-за ошибок ввода данных или других причин. Высокий процент незаполненных значений может указывать на проблемы с качеством данных.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 5,
      group: 'Метрики столбцов',

      display: 'Количество уникальных записей',
      name: '-',
      description:
        'Количество записей, которые уникальны в единственном числе. Они не повторяются в столбце и представляют собой уникальные значения. Это важная метрика, которая помогает нам понять уровень вариативности данных в столбце.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 6,
      group: 'Метрики столбцов',

      display: 'Общее количество профилированных записей',
      name: '-',
      description:
        'Общее количество записей, которые были профилированы в столбце. Это важная информация, которая помогает нам понять размер и объем данных в столбце.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 7,
      group: 'Метрики столбцов',

      display: 'Пропорции отличительных значений',
      name: '-',
      description:
        'Процентное соотношение количества отличительных значений к общему количеству профилированных записей. Он показывает, какую долю занимают уникальные значения в столбце относительно всех записей. Это полезно для понимания степени вариативности данных в столбце.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 8,
      group: 'Метрики столбцов',

      display: 'Пропорции NULL',
      name: '-',
      description:
        'Процентное соотношение количества незаполненных значений к общему количеству профилированных записей. Он показывает, какую долю занимают пропущенные значения в столбце относительно всех записей. Высокий процент пропущенных значений может указывать на проблемы с качеством данных или неполные данные.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 9,
      group: 'Метрики столбцов',

      display: 'Пропорции уникальных значений',
      name: '-',
      description:
        'Процентное соотношение количества уникальных значений к общему количеству профилированных записей. Он показывает, какую долю занимают уникальные значения относительно всех записей. Это полезно для понимания степени вариативности данных и уникальности значений в столбце.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 10,
      group: 'Метрики столбцов',

      display: 'Максимальное значение',
      name: '-',
      description: 'Число, которое представляет максимальное значение в таблице данных. ',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 11,
      group: 'Метрики столбцов',

      display: 'Среднее значение',
      name: '-',
      description:
        'Среднее значение всех данных в данном диапазоне. Среднее арифметическое позволяет оценить общую тенденцию данных в диапазоне.',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 12,
      group: 'Метрики столбцов',

      display: '3. Минимальное значение',
      name: '-',
      description: 'Число, которое представляет минимальное значение в таблице данных. ',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 13,
      group: 'Метрики столбцов',

      display:
        'Суммарные значения на графике «Агрегирование данных» считаются по атрибуту с аддитивными типами данных или как суммарное количество символов для атрибутов с текстовым типом данных.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 14,
      group: 'Метрики столбцов',

      display:
        '1. Первый квартиль (Q1) представляет собой значение, ниже которого находится 25% значений. Он указывает на нижнюю границу нижней четверти данных.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 15,
      group: 'Метрики столбцов',

      display:
        '2. Медиана (Q2) представляет собой значение, которое делит данные на две равные части. 50% значений находятся ниже медианы, а 50% - выше. Она показывает центральную точку данных.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 16,
      group: 'Метрики столбцов',

      display:
        '3. Третий квартиль (Q3) представляет собой значение, ниже которого находится 75% значений. Он указывает на нижнюю границу верхней четверти данных.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 17,
      group: 'Метрики столбцов',

      display:
        '4. Интерквартильный размах (IQR) - это разница между третьим и первым квартилями. Он представляет собой меру разброса данных в середине распределения.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 18,
      group: 'Метрики столбцов',

      display:
        'График представляется в виде столбчатой диаграммы, где высота столбцов отражает количество записей в каждом диапазоне.',
      name: '-',
      description: '',
      isText: false,
      isInt: false,
      isDate: false,
    },
    {
      id: 19,
      group: 'Конструктор метрик для столбцов',

      display: 'Количество значений',
      name: 'Values Count',
      description: 'Это общее количество заполненных значений в столбце. Игнорирует значения NULL.',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 20,
      group: 'Конструктор метрик для столбцов',

      display: 'Процент значений',
      name: 'Values Percentage',
      description: 'Процент значений в столбце по отношению к числу строк.',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 22,
      group: 'Конструктор метрик для столбцов',

      display: 'Количество незаполненных значений',
      name: 'Null Count',
      description: 'Количество значений NULL в столбце(пустые).',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 23,
      group: 'Конструктор метрик для столбцов',

      display: 'Пропорция незаполненных значений',
      name: 'Null Proportion',
      description: 'Показывает отношение значений NULL к общему количеству значений в столбце.',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 21,
      group: 'Конструктор метрик для столбцов',

      display: 'Количество дубликатов',
      name: 'Duplicate Count',
      description:
        'Передает количество строк с повторяющимися значениями в столбце. Вычисляется как .count(col) - count(distinct(col))',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 24,
      group: 'Конструктор метрик для столбцов',

      display: 'Количество уникальных значений',
      name: 'Unique Count',
      description:
        'Количество уникальных значений в столбце, которые отображаются только один раз. Например..[1, 2, 2, 3, 3, 4] => [1, 4] => count = 2',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 25,
      group: 'Конструктор метрик для столбцов',

      display: 'Пропорция уникальных значений',
      name: 'Unique Proportion',
      description: 'Соотношение количества уникальных значений и общего числа записей',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 26,
      group: 'Конструктор метрик для столбцов',

      display: 'Количество отличительных значений',
      name: 'Distinct Count',
      description:
        'Количество исключительных элементов в столбце. Например..[1, 2, 2, 3, 3, 4] => [1, 2, 3, 4] => count = 4',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 27,
      group: 'Конструктор метрик для столбцов',

      display: 'Пропорция отличительных значений',
      name: 'Distinct Proportion',
      description: 'Соотношение количества исключительных значений по отношению к общему числу записей.',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 28,
      group: 'Конструктор метрик для столбцов',

      display: 'Мин',
      name: 'min',
      description: 'Только для числовых значений. Возвращает минимальное значений.',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 29,
      group: 'Конструктор метрик для столбцов',

      display: 'Макс',
      name: 'max',
      description: 'Только для числовых значений. Возвращает максимальное значений.',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 30,
      group: 'Конструктор метрик для столбцов',

      display: 'Минимальная длина',
      name: 'Min Length',
      description: 'Только для текстовых значений. Возвращает минимальную длину значений в столбце.',
      isText: true,
      isInt: false,
      isDate: false,
    },
    {
      id: 31,
      group: 'Конструктор метрик для столбцов',

      display: 'Максимальная длина',
      name: 'Max Length',
      description: 'Только для текстовых значений. Возвращает максимальную длину значений в столбце.',
      isText: true,
      isInt: false,
      isDate: false,
    },
    {
      id: 32,
      group: 'Конструктор метрик для столбцов',

      display: 'Значения',
      name: 'Mean',
      description:
        'Числовые значения: возвращает среднее арифметическое значений.\nТекстовые значения: возвращает среднюю длину значений.',
      isText: true,
      isInt: true,
      isDate: false,
    },
    {
      id: 33,
      group: 'Конструктор метрик для столбцов',

      display: 'Медиана',
      name: 'Median',
      description: 'Только для числовых значений.',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 34,
      group: 'Конструктор метрик для столбцов',

      display: 'Сумма',
      name: 'Sum',
      description: 'Только для числовых значений. Возвращает сумму всех значений в столбце.',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 35,
      group: 'Конструктор метрик для столбцов',

      display: 'Стандартное отклонение',
      name: 'Standard Deviation',
      description: 'Только для числовых значений. Возвращает стандартное отклонение.',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 36,
      group: 'Конструктор метрик для столбцов',

      display: 'Гистограмма',
      name: 'Histogram',
      description:
        'Гистограмма возвращает список различных категорий и количество значений, найденных для этих категорий. Будет вычислена только в том случае, если включено значение Inter Quartile Range',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 37,
      group: 'Конструктор метрик для столбцов',

      display: 'Первый квартиль',
      name: 'First Quartile',
      description: 'Только для числовых значений. Среднее число между наименьшим значением и медианой',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 38,
      group: 'Конструктор метрик для столбцов',

      display: 'Третий квартиль',
      name: 'Third Quartile',
      description: 'Только для числовых значений. Среднее число между медианой и наибольшим значением',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 39,
      group: 'Конструктор метрик для столбцов',

      display: 'Межквартильный диапазон',
      name: 'Inter Quartile Range',
      description: 'Только для числовых значений. Разница между третьим и первым квартилем',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 40,
      group: 'Конструктор метрик для столбцов',

      display: 'Непараметрический наклон',
      name: 'Nonparametric Skew',
      description:
        'Мера асимметрии распределения столбцов. Непараметрический асимметрия вычисляется следующим образом: $$ S = \\frac{\\mu-\\tilde{\\mu}}{\\sigma} $$\nГде $$ \\mu = среднее\\ \\tilde{\\mu} = медиана\\ \\sigma = стандартное отклонение\\ $$',
      isText: false,
      isInt: true,
      isDate: false,
    },
    {
      id: 41,
      group: 'Конструктор метрик для столбцов',

      display: 'Некорректная дата',
      name: '-',
      description: 'Кол-во дат с некорректным значением (например, 30.02)',
      isText: false,
      isInt: false,
      isDate: true,
    },
  ]

  for (const action of actionData) {
    await prisma.analyticalActions.create({
      data: action,
    })
  }
}
