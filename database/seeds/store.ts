import { Store } from '@prisma/client'

export const navMenu: Store = {
  name: 'navMenu',
  description: 'Меню навигации',
  data: [
    {
      name: 'Промежуточные таблицы',
      description: 'Промежуточные таблицы',
      link: '/operational-tables',
      children: [
        {
          name: 'Работники',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Работники',
          link: '/operational-tables/employees/explorer?name=Работники',
        },
        {
          name: 'Эталонный датасет',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Эталонный датасет',
          link: '/operational-tables/dataset/explorer?name=Эталонный датасет',
        },
        {
          name: 'Автомобили',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Автомобили',
          link: '/operational-tables/cars/explorer?name=Автомобили',
        },
        {
          name: 'Мед',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Мед',
          link: '/operational-tables/med/explorer?name=Мед',
        },
      ],
    },
    {
      name: 'Справочники',
      description: 'Справочники',
      link: '/dictionary-tables',
      children: [
        {
          name: 'Работники',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Работники',
          link: '/dictionary-tables/employees/explorer?name=Работники',
        },
        {
          name: 'Страны',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Страны',
          link: '/dictionary-tables/countries/explorer?name=Страны',
        },
        {
          name: 'Субьекты РФ',
          icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
          description: 'Субьекты РФ',
          link: '/dictionary-tables/rfSubjects/explorer?name=Субьекты РФ',
        },
      ],
    },
  ],
}
export const operationalStoreConfigId: Store = {
  name: 'OperationalStoreConfigId',
  description: 'Указывает какой StoreConfig является операционным',
  data: '',
}
