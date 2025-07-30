export const luzonLocations: Record<
  string,
  { city: string; zipPrefixes: string[] }[]
> = {
  'Metro Manila (NCR)': [
    {
      city: 'Caloocan',
      zipPrefixes: [
        '1400',
        '1401',
        '1402',
        '1403',
        '1404',
        '1405',
        '1406',
        '1407',
        '1408',
        '1409',
        '1410',
        '1411',
        '1412',
        '1413',
        '1414',
        '1415',
        '1416',
        '1417',
        '1418',
        '1419',
        '1420',
        '1421',
        '1422',
        '1423',
        '1424',
        '1425',
        '1426',
        '1427',
        '1428',
      ],
    },
    { city: 'Las Piñas', zipPrefixes: ['1740', '1745'] },
    {
      city: 'Makati',
      zipPrefixes: Array.from({ length: 36 }, (_, i) =>
        (1200 + i).toString().padStart(4, '0'),
      ),
    },
    {
      city: 'Malabon',
      zipPrefixes: Array.from({ length: 10 }, (_, i) => (1470 + i).toString()),
    },
    {
      city: 'Mandaluyong',
      zipPrefixes: Array.from({ length: 7 }, (_, i) => (1550 + i).toString()),
    },
    {
      city: 'Manila',
      zipPrefixes: Array.from({ length: 19 }, (_, i) => (1000 + i).toString()),
    },
    {
      city: 'Marikina',
      zipPrefixes: Array.from({ length: 13 }, (_, i) => (1800 + i).toString()),
    },
    {
      city: 'Muntinlupa',
      zipPrefixes: Array.from({ length: 30 }, (_, i) => (1770 + i).toString()),
    },
    {
      city: 'Navotas',
      zipPrefixes: Array.from({ length: 11 }, (_, i) => (1480 + i).toString()),
    },
    { city: 'Parañaque', zipPrefixes: ['1700', '1709'] },
    {
      city: 'Pasay',
      zipPrefixes: Array.from({ length: 10 }, (_, i) => (1300 + i).toString()),
    },
    {
      city: 'Pasig',
      zipPrefixes: Array.from({ length: 20 }, (_, i) => (1600 + i).toString()),
    },
    {
      city: 'Pateros',
      zipPrefixes: ['1620', '1621', '1622', '1623'],
    },
    {
      city: 'Quezon City',
      zipPrefixes: Array.from({ length: 39 }, (_, i) => (1100 + i).toString()),
    },
    {
      city: 'San Juan',
      zipPrefixes: ['1500', '1501', '1502', '1503', '1504'],
    },
    {
      city: 'Taguig',
      zipPrefixes: Array.from({ length: 20 }, (_, i) =>
        (1630 + i).toString(),
      ).concat(Array.from({ length: 10 }, (_, i) => (1640 + i).toString())),
    },
    {
      city: 'Valenzuela',
      zipPrefixes: Array.from({ length: 9 }, (_, i) => (1440 + i).toString()),
    },
  ],

  'Ilocos Norte': [
    { city: 'Laoag City', zipPrefixes: ['290', '2900'] },
    { city: 'Batac City', zipPrefixes: ['2906'] },
    { city: 'Burgos', zipPrefixes: ['2913'] },
  ],
  'Ilocos Sur': [
    { city: 'Vigan City', zipPrefixes: ['2700'] },
    { city: 'Candon City', zipPrefixes: ['2710'] },
    { city: 'Cervantes', zipPrefixes: ['2722'] },
  ],
  'La Union': [
    { city: 'San Fernando City', zipPrefixes: ['250', '2500'] },
    { city: 'Agoo', zipPrefixes: ['2504'] },
  ],
  Pangasinan: [
    { city: 'Dagupan City', zipPrefixes: ['2400'] },
    { city: 'San Carlos City', zipPrefixes: ['2420'] },
    { city: 'Urdaneta City', zipPrefixes: ['2428'] },
  ],

  Cagayan: [
    { city: 'Tuguegarao City', zipPrefixes: ['3500'] },
    { city: 'Aparri', zipPrefixes: ['3515'] },
  ],
  Isabela: [
    { city: 'Ilagan City', zipPrefixes: ['3300'] },
    { city: 'Cauayan City', zipPrefixes: ['3305'] },
    { city: 'Santiago City', zipPrefixes: ['3311'] },
  ],
  'Nueva Vizcaya': [
    { city: 'Bayombong', zipPrefixes: ['3700'] },
    { city: 'Solano', zipPrefixes: ['3709'] },
  ],
  Quirino: [
    { city: 'Cabarroguis', zipPrefixes: ['3400'] },
    { city: 'Diffun', zipPrefixes: ['3401'] },
  ],

  Bataan: [
    { city: 'Balanga City', zipPrefixes: ['2100'] },
    { city: 'Orani', zipPrefixes: ['2112'] },
  ],
  Bulacan: [
    { city: 'Malolos City', zipPrefixes: ['3000'] },
    { city: 'Meycauayan City', zipPrefixes: ['3020'] },
    { city: 'San Jose del Monte City', zipPrefixes: ['3023'] },
  ],
  'Nueva Ecija': [
    { city: 'Cabanatuan City', zipPrefixes: ['3100'] },
    { city: 'San Jose City', zipPrefixes: ['3121'] },
  ],
  Pampanga: [
    { city: 'Angeles City', zipPrefixes: ['2000'] },
    { city: 'San Fernando City', zipPrefixes: ['2000'] },
  ],
  Tarlac: [
    { city: 'Tarlac City', zipPrefixes: ['2300'] },
    { city: 'Capas', zipPrefixes: ['2315'] },
  ],
  Zambales: [
    { city: 'Olongapo City', zipPrefixes: ['2200'] },
    { city: 'Iba', zipPrefixes: ['2201'] },
  ],
  Aurora: [
    { city: 'Baler', zipPrefixes: ['3200'] },
    { city: 'Maria Aurora', zipPrefixes: ['3202'] },
  ],

  Batangas: [
    { city: 'Batangas City', zipPrefixes: ['4200'] },
    { city: 'Lipa City', zipPrefixes: ['4217'] },
    { city: 'Tanauan City', zipPrefixes: ['4232'] },
  ],
  Cavite: [
    { city: 'Bacoor City', zipPrefixes: ['4102'] },
    { city: 'Dasmariñas City', zipPrefixes: ['4114'] },
    { city: 'General Trias City', zipPrefixes: ['4107'] },
  ],
  Laguna: [
    { city: 'Calamba City', zipPrefixes: ['4027'] },
    { city: 'San Pablo City', zipPrefixes: ['4000'] },
    { city: 'Santa Rosa City', zipPrefixes: ['4026'] },
  ],
  Quezon: [
    { city: 'Lucena City', zipPrefixes: ['4301'] },
    { city: 'Tayabas City', zipPrefixes: ['4327'] },
    { city: 'Candelaria', zipPrefixes: ['4323'] },
  ],
  Rizal: [
    { city: 'Antipolo City', zipPrefixes: ['1870', '1871', '1872'] },
    { city: 'Cainta', zipPrefixes: ['190', '1900'] },
    { city: 'Taytay', zipPrefixes: ['192', '1920'] },
  ],

  Albay: [
    { city: 'Legazpi City', zipPrefixes: ['4500'] },
    { city: 'Ligao City', zipPrefixes: ['4504'] },
  ],
  'Camarines Norte': [{ city: 'Daet', zipPrefixes: ['4600'] }],
  'Camarines Sur': [
    { city: 'Naga City', zipPrefixes: ['4400'] },
    { city: 'Iriga City', zipPrefixes: ['4431'] },
  ],
  Catanduanes: [{ city: 'Virac', zipPrefixes: ['4800'] }],
  Masbate: [{ city: 'Masbate City', zipPrefixes: ['5400'] }],
  Sorsogon: [{ city: 'Sorsogon City', zipPrefixes: ['4700'] }],

  Marinduque: [{ city: 'Boac', zipPrefixes: ['4900'] }],
  'Occidental Mindoro': [{ city: 'Mamburao', zipPrefixes: ['5106'] }],
  'Oriental Mindoro': [
    { city: 'Calapan City', zipPrefixes: ['5200'] },
    { city: 'Puerto Galera', zipPrefixes: ['5203'] },
  ],
  Palawan: [{ city: 'Puerto Princesa City', zipPrefixes: ['5300'] }],
  Romblon: [{ city: 'Romblon', zipPrefixes: ['5500'] }],
}

export type LuzonLocations = typeof luzonLocations
