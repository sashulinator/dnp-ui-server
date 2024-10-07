const rfSubjects = [
  {
    name: 'Республика Адыгея',
    capital: 'Майкоп',
    region_code: '01',
  },
  {
    name: 'Республика Башкортостан',
    capital: 'Уфа',
    region_code: '02',
  },
  {
    name: 'Республика Бурятия',
    capital: 'Улан-Удэ',
    region_code: '03',
  },
  {
    name: 'Республика Алтай',
    capital: 'Горно-Алтайск',
    region_code: '04',
  },
  {
    name: 'Республика Дагестан',
    capital: 'Махачкала',
    region_code: '05',
  },
  {
    name: 'Республика Ингушетия',
    capital: 'Магас',
    region_code: '06',
  },
  {
    name: 'Кабардино-Балкарская Республика',
    capital: 'Нальчик',
    region_code: '07',
  },
  {
    name: 'Республика Калмыкия',
    capital: 'Элиста',
    region_code: '08',
  },
  {
    name: 'Карачаево-Черкесская Республика',
    capital: 'Черкесск',
    region_code: '09',
  },
  {
    name: 'Республика Карелия',
    capital: 'Петрозаводск',
    region_code: '10',
  },
  {
    name: 'Республика Коми',
    capital: 'Сыктывкар',
    region_code: '11',
  },
  {
    name: 'Республика Крым',
    capital: 'Симферополь',
    region_code: '92',
  },
  {
    name: 'Республика Марий Эл',
    capital: 'Йошкар-Ола',
    region_code: '12',
  },
  {
    name: 'Республика Мордовия',
    capital: 'Саранск',
    region_code: '13',
  },
  {
    name: 'Республика Саха (Якутия)',
    capital: 'Якутск',
    region_code: '14',
  },
  {
    name: 'Республика Северная Осетия-Алания',
    capital: 'Владикавказ',
    region_code: '15',
  },
  {
    name: 'Республика Татарстан',
    capital: 'Казань',
    region_code: '16',
  },
  {
    name: 'Республика Тыва',
    capital: 'Кызыл',
    region_code: '17',
  },
  {
    name: 'Удмуртская Республика',
    capital: 'Ижевск',
    region_code: '18',
  },
  {
    name: 'Республика Хакасия',
    capital: 'Абакан',
    region_code: '19',
  },
  {
    name: 'Чеченская Республика',
    capital: 'Грозный',
    region_code: '20',
  },
  {
    name: 'Чувашская Республика',
    capital: 'Чебоксары',
    region_code: '21',
  },
  {
    name: 'Алтайский край',
    capital: 'Барнаул',
    region_code: '22',
  },
  {
    name: 'Краснодарский край',
    capital: 'Краснодар',
    region_code: '23',
  },
  {
    name: 'Красноярский край',
    capital: 'Красноярск',
    region_code: '24',
  },
  {
    name: 'Приморский край',
    capital: 'Владивосток',
    region_code: '25',
  },
  {
    name: 'Ставропольский край',
    capital: 'Ставрополь',
    region_code: '26',
  },
  {
    name: 'Хабаровский край',
    capital: 'Хабаровск',
    region_code: '27',
  },
  {
    name: 'Амурская область',
    capital: 'Благовещенск',
    region_code: '28',
  },
  {
    name: 'Архангельская область',
    capital: 'Архангельск',
    region_code: '29',
  },
  {
    name: 'Астраханская область',
    capital: 'Астрахань',
    region_code: '30',
  },
  {
    name: 'Белгородская область',
    capital: 'Белгород',
    region_code: '31',
  },
  {
    name: 'Брянская область',
    capital: 'Брянск',
    region_code: '32',
  },
  {
    name: 'Владимирская область',
    capital: 'Владимир',
    region_code: '33',
  },
  {
    name: 'Волгоградская область',
    capital: 'Волгоград',
    region_code: '34',
  },
  {
    name: 'Вологодская область',
    capital: 'Вологда',
    region_code: '35',
  },
  {
    name: 'Воронежская область',
    capital: 'Воронеж',
    region_code: '36',
  },
  {
    name: 'Ивановская область',
    capital: 'Иваново',
    region_code: '37',
  },
  {
    name: 'Иркутская область',
    capital: 'Иркутск',
    region_code: '38',
  },
  {
    name: 'Калининградская область',
    capital: 'Калининград',
    region_code: '39',
  },
  {
    name: 'Калужская область',
    capital: 'Калуга',
    region_code: '40',
  },
  {
    name: 'Камчатский край',
    capital: 'Петропавловск-Камчатский',
    region_code: '41',
  },
  {
    name: 'Кемеровская область',
    capital: 'Кемерово',
    region_code: '42',
  },
  {
    name: 'Кировская область',
    capital: 'Киров',
    region_code: '43',
  },
  {
    name: 'Костромская область',
    capital: 'Кострома',
    region_code: '44',
  },
  {
    name: 'Курганская область',
    capital: 'Курган',
    region_code: '45',
  },
  {
    name: 'Курская область',
    capital: 'Курск',
    region_code: '46',
  },
  {
    name: 'Ленинградская область',
    capital: 'Санкт-Петербург',
    region_code: '47',
  },
  {
    name: 'Липецкая область',
    capital: 'Липецк',
    region_code: '48',
  },
  {
    name: 'Магаданская область',
    capital: 'Магадан',
    region_code: '49',
  },
  {
    name: 'Московская область',
    capital: 'Москва',
    region_code: '50',
  },
  {
    name: 'Мурманская область',
    capital: 'Мурманск',
    region_code: '51',
  },
  {
    name: 'Нижегородская область',
    capital: 'Нижний Новгород',
    region_code: '52',
  },
  {
    name: 'Новгородская область',
    capital: 'Великий Новгород',
    region_code: '53',
  },
  {
    name: 'Новосибирская область',
    capital: 'Новосибирск',
    region_code: '54',
  },
  {
    name: 'Омская область',
    capital: 'Омск',
    region_code: '55',
  },
  {
    name: 'Оренбургская область',
    capital: 'Оренбург',
    region_code: '56',
  },
  {
    name: 'Орловская область',
    capital: 'Орёл',
    region_code: '57',
  },
  {
    name: 'Пензенская область',
    capital: 'Пенза',
    region_code: '58',
  },
  {
    name: 'Пермский край',
    capital: 'Пермь',
    region_code: '59',
  },
  {
    name: 'Псковская область',
    capital: 'Псков',
    region_code: '60',
  },
  {
    name: 'Ростовская область',
    capital: 'Ростов-на-Дону',
    region_code: '61',
  },
  {
    name: 'Рязанская область',
    capital: 'Рязань',
    region_code: '62',
  },
  {
    name: 'Самарская область',
    capital: 'Самара',
    region_code: '63',
  },
  {
    name: 'Санкт-Петербург',
    capital: 'Санкт-Петербург',
    region_code: '78',
  },
  {
    name: 'Саратовская область',
    capital: 'Саратов',
    region_code: '64',
  },
  {
    name: 'Сахалинская область',
    capital: 'Южно-Сахалинск',
    region_code: '65',
  },
  {
    name: 'Свердловская область',
    capital: 'Екатеринбург',
    region_code: '66',
  },
  {
    name: 'Смоленская область',
    capital: 'Смоленск',
    region_code: '67',
  },
  {
    name: 'Тамбовская область',
    capital: 'Тамбов',
    region_code: '68',
  },
  {
    name: 'Тверская область',
    capital: 'Тверь',
    region_code: '69',
  },
  {
    name: 'Томская область',
    capital: 'Томск',
    region_code: '70',
  },
  {
    name: 'Тульская область',
    capital: 'Тула',
    region_code: '71',
  },
  {
    name: 'Тюменская область',
    capital: 'Тюмень',
    region_code: '72',
  },
  {
    name: 'Ульяновская область',
    capital: 'Ульяновск',
    region_code: '73',
  },
  {
    name: 'Челябинская область',
    capital: 'Челябинск',
    region_code: '74',
  },
  {
    name: 'Читинская область',
    capital: 'Чита',
    region_code: '75',
  },
  {
    name: 'Москва',
    capital: 'Москва',
    region_code: '77',
  },
  {
    name: 'Ярославская область',
    capital: 'Ярославль',
    region_code: '76',
  },
]

export default rfSubjects
