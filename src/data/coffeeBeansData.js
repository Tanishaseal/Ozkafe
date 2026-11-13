// Official Ozkafe Shelf Coffee Catalog
// Sourced strictly from "Coffee pricing cafe (01-09-2026).pdf"
// All prices represent Selling Price Excluding 5% GST as specified in the PDF.

export const COFFEE_CATEGORIES = [
  {
    "id": "commercial-blends",
    "name": "Commercial Blends",
    "count": 10,
    "subtitle": "House & Espresso Blends"
  },
  {
    "id": "south-indian-filter",
    "name": "South Indian Filter Coffee",
    "count": 2,
    "subtitle": "Traditional Coffee & Chicory Blends"
  },
  {
    "id": "speciality-microlot",
    "name": "Speciality & Microlot Coffee",
    "count": 8,
    "subtitle": "Single-Origin Microlots & Monsooned Malabar"
  },
  {
    "id": "baarbara-estate",
    "name": "Baarbara Estate",
    "count": 2,
    "subtitle": "Single Estate Arabica"
  },
  {
    "id": "harley-estate",
    "name": "Harley Estate",
    "count": 6,
    "subtitle": "Estate Harvests, Barrel-Aged & Cascara"
  },
  {
    "id": "msp-cauvery-peak",
    "name": "MSP Cauvery Peak",
    "count": 3,
    "subtitle": "High-Elevation Estate Harvests"
  },
  {
    "id": "vaishnavi-estate",
    "name": "Vaishnavi Estate",
    "count": 1,
    "subtitle": "Single Origin Robusta"
  },
  {
    "id": "msp-coffee-estate",
    "name": "MSP Coffee Estate",
    "count": 6,
    "subtitle": "Heritage Plantation Lots"
  },
  {
    "id": "nandan-estate",
    "name": "Nandan Estate",
    "count": 3,
    "subtitle": "Artisan Washed & Micro-Roasts"
  },
  {
    "id": "instant-coffee",
    "name": "Instant Coffee",
    "count": 9,
    "subtitle": "Freeze Dried, Spray Dried & Agglomerated"
  },
  {
    "id": "flavoured-instant",
    "name": "Flavoured Instant Coffee",
    "count": 6,
    "subtitle": "Freeze Dried Premium Base"
  },
  {
    "id": "cold-brew",
    "name": "Liquid Cold Brew Concentrate",
    "count": 4,
    "subtitle": "Ready To Drink (RTD: 3x Concentrate)"
  }
];

export const COFFEE_BEANS_DATA = [
  {
    "id": "cb-1",
    "name": "Cowboy blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 47,
      "250g": 226,
      "500g": 445,
      "1 Kg": 873
    }
  },
  {
    "id": "cb-2",
    "name": "Bar Expresso",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 50,
      "250g": 241,
      "500g": 475,
      "1 Kg": 932
    }
  },
  {
    "id": "cb-3",
    "name": "Royal Carrebian Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 53,
      "250g": 256,
      "500g": 505,
      "1 Kg": 990
    }
  },
  {
    "id": "cb-4",
    "name": "Classic House Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 56,
      "250g": 266,
      "500g": 524,
      "1 Kg": 1028
    }
  },
  {
    "id": "cb-5",
    "name": "Australian Breakfast Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 60,
      "250g": 287,
      "500g": 565,
      "1 Kg": 1108
    }
  },
  {
    "id": "cb-6",
    "name": "Arabian Mocha Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 61,
      "250g": 290,
      "500g": 572,
      "1 Kg": 1122
    }
  },
  {
    "id": "cb-7",
    "name": "Classic Arabian Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 63,
      "250g": 300,
      "500g": 591,
      "1 Kg": 1159
    }
  },
  {
    "id": "cb-8",
    "name": "Heritage Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 61,
      "250g": 293,
      "500g": 577,
      "1 Kg": 1132
    }
  },
  {
    "id": "cb-9",
    "name": "Estate Reserve Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 68,
      "250g": 328,
      "500g": 646,
      "1 Kg": 1266
    }
  },
  {
    "id": "cb-10",
    "name": "Master Roaster's Blend",
    "categoryId": "commercial-blends",
    "category": "Commercial Blends",
    "prices": {
      "50g": 67,
      "250g": 321,
      "500g": 633,
      "1 Kg": 1242
    }
  },
  {
    "id": "cb-11",
    "name": "Speciality Filter Coffee 80/20",
    "categoryId": "south-indian-filter",
    "category": "South Indian Filter Coffee",
    "detail": "80% Coffee / 20% Chicory",
    "prices": {
      "50g": 53,
      "250g": 256,
      "500g": 505,
      "1 Kg": 990
    }
  },
  {
    "id": "cb-12",
    "name": "Ozkafe Filter Coffee 60/40",
    "categoryId": "south-indian-filter",
    "category": "South Indian Filter Coffee",
    "detail": "60% Coffee / 40% Chicory",
    "prices": {
      "50g": 42,
      "250g": 202,
      "500g": 398,
      "1 Kg": 780
    }
  },
  {
    "id": "cb-13",
    "name": "Mysore Nuggets (MNEB)",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "detail": "Grade MNEB",
    "prices": {
      "50g": 76,
      "250g": 365,
      "500g": 719,
      "1 Kg": 1409
    }
  },
  {
    "id": "cb-14",
    "name": "Monsoon Malabar",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "detail": "Monsooned Malabar",
    "prices": {
      "50g": 61,
      "250g": 291,
      "500g": 573,
      "1 Kg": 1123
    }
  },
  {
    "id": "cb-15",
    "name": "Deccan Reserve",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "prices": {
      "50g": 81,
      "250g": 386,
      "500g": 761,
      "1 Kg": 1492
    }
  },
  {
    "id": "cb-16",
    "name": "Highland Blend",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "prices": {
      "50g": 93,
      "250g": 447,
      "500g": 881,
      "1 Kg": 1728
    }
  },
  {
    "id": "cb-17",
    "name": "Spice Route",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "prices": {
      "50g": 143,
      "250g": 683,
      "500g": 1347,
      "1 Kg": 2640
    }
  },
  {
    "id": "cb-18",
    "name": "Malabar Gold",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "prices": {
      "50g": 109,
      "250g": 522,
      "500g": 1030,
      "1 Kg": 2019
    }
  },
  {
    "id": "cb-19",
    "name": "Shevaroys Naturals",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "detail": "Natural Process",
    "prices": {
      "50g": 154,
      "250g": 737,
      "500g": 1453,
      "1 Kg": 2848
    }
  },
  {
    "id": "cb-20",
    "name": "Nilgiri Naturals",
    "categoryId": "speciality-microlot",
    "category": "Speciality & Microlot Coffee",
    "detail": "Natural Process",
    "prices": {
      "50g": 109,
      "250g": 522,
      "500g": 1030,
      "1 Kg": 2019
    }
  },
  {
    "id": "cb-21",
    "name": "Baarbara Natural",
    "categoryId": "baarbara-estate",
    "category": "Baarbara Estate",
    "detail": "Natural Process",
    "prices": {
      "50g": 111,
      "250g": 531,
      "500g": 1047,
      "1 Kg": 2052
    }
  },
  {
    "id": "cb-22",
    "name": "Baarbara Washed",
    "categoryId": "baarbara-estate",
    "category": "Baarbara Estate",
    "detail": "Washed Process",
    "prices": {
      "50g": 93,
      "250g": 445,
      "500g": 877,
      "1 Kg": 1720
    }
  },
  {
    "id": "cb-23",
    "name": "Kalledevarapura Estate",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "prices": {
      "50g": 107,
      "250g": 514,
      "500g": 1013,
      "1 Kg": 1986
    }
  },
  {
    "id": "cb-24",
    "name": "Harley Estate",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "prices": {
      "50g": 104,
      "250g": 497,
      "500g": 979,
      "1 Kg": 1919
    }
  },
  {
    "id": "cb-25",
    "name": "Barrel Aged Wine Coffee",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "detail": "Wine Barrel Aged",
    "prices": {
      "50g": 190,
      "250g": 909,
      "500g": 1791,
      "1 Kg": 3512
    }
  },
  {
    "id": "cb-26",
    "name": "Barrel Aged RUM Coffee",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "detail": "RUM Barrel Aged",
    "prices": {
      "50g": 190,
      "250g": 909,
      "500g": 1791,
      "1 Kg": 3512
    }
  },
  {
    "id": "cb-27",
    "name": "Barrel Aged Whisky Coffee",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "detail": "Whisky Barrel Aged",
    "prices": {
      "50g": 190,
      "250g": 909,
      "500g": 1791,
      "1 Kg": 3512
    }
  },
  {
    "id": "cb-28",
    "name": "Cascara Tea",
    "categoryId": "harley-estate",
    "category": "Harley Estate",
    "detail": "Sun-Dried Coffee Cherry Cascara",
    "prices": {
      "50g": 254,
      "250g": 1218,
      "500g": 2400,
      "1 Kg": 4706
    }
  },
  {
    "id": "cb-29",
    "name": "Cauvery Peak Estate Heritage",
    "categoryId": "msp-cauvery-peak",
    "category": "MSP Cauvery Peak",
    "prices": {
      "50g": 86,
      "250g": 411,
      "500g": 810,
      "1 Kg": 1588
    }
  },
  {
    "id": "cb-30",
    "name": "Shevaroys Estate Reserve",
    "categoryId": "msp-cauvery-peak",
    "category": "MSP Cauvery Peak",
    "prices": {
      "50g": 86,
      "250g": 411,
      "500g": 810,
      "1 Kg": 1588
    }
  },
  {
    "id": "cb-31",
    "name": "Glenfell Estate Classic",
    "categoryId": "msp-cauvery-peak",
    "category": "MSP Cauvery Peak",
    "prices": {
      "50g": 86,
      "250g": 411,
      "500g": 810,
      "1 Kg": 1588
    }
  },
  {
    "id": "cb-32",
    "name": "Single Origin Pure Robusta",
    "categoryId": "vaishnavi-estate",
    "category": "Vaishnavi Estate",
    "detail": "100% Pure Robusta",
    "prices": {
      "50g": 86,
      "250g": 411,
      "500g": 810,
      "1 Kg": 1588
    }
  },
  {
    "id": "cb-33",
    "name": "Moganad Natural",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "detail": "Natural Process",
    "prices": {
      "50g": 147,
      "250g": 703,
      "500g": 1385,
      "1 Kg": 2715
    }
  },
  {
    "id": "cb-34",
    "name": "Moganad Washed",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "detail": "Washed Process",
    "prices": {
      "50g": 111,
      "250g": 531,
      "500g": 1047,
      "1 Kg": 2052
    }
  },
  {
    "id": "cb-35",
    "name": "Stanmore Natural",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "detail": "Natural Process",
    "prices": {
      "50g": 147,
      "250g": 703,
      "500g": 1385,
      "1 Kg": 2715
    }
  },
  {
    "id": "cb-36",
    "name": "Stanmore Washed",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "detail": "Washed Process",
    "prices": {
      "50g": 107,
      "250g": 514,
      "500g": 1013,
      "1 Kg": 1986
    }
  },
  {
    "id": "cb-37",
    "name": "Orchadale Natural",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "detail": "Natural Process",
    "prices": {
      "50g": 161,
      "250g": 771,
      "500g": 1520,
      "1 Kg": 2981
    }
  },
  {
    "id": "cb-38",
    "name": "Bison Valley",
    "categoryId": "msp-coffee-estate",
    "category": "MSP Coffee Estate",
    "prices": {
      "50g": 109,
      "250g": 522,
      "500g": 1030,
      "1 Kg": 2019
    }
  },
  {
    "id": "cb-39",
    "name": "Fruit Punch - WA/LR",
    "categoryId": "nandan-estate",
    "category": "Nandan Estate",
    "detail": "Washed / Light Roast",
    "prices": {
      "50g": 180,
      "250g": 865,
      "500g": 1704,
      "1 Kg": 3342
    }
  },
  {
    "id": "cb-40",
    "name": "Roasters Delight - WA/LR",
    "categoryId": "nandan-estate",
    "category": "Nandan Estate",
    "detail": "Washed / Light Roast",
    "prices": {
      "50g": 177,
      "250g": 850,
      "500g": 1676,
      "1 Kg": 3287
    }
  },
  {
    "id": "cb-41",
    "name": "Chocolate Burst - WA/MR",
    "categoryId": "nandan-estate",
    "category": "Nandan Estate",
    "detail": "Washed / Medium Roast",
    "prices": {
      "50g": 180,
      "250g": 865,
      "500g": 1704,
      "1 Kg": 3342
    }
  },
  {
    "id": "cb-42",
    "name": "Freeze Dried Premium",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "100% Coffee",
    "prices": {
      "50g": 155,
      "100g": 290,
      "250g": 700
    }
  },
  {
    "id": "cb-43",
    "name": "Freeze Dried Classic",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "70% Coffee / 30% Chicory",
    "prices": {
      "50g": 143,
      "100g": 265,
      "250g": 638
    }
  },
  {
    "id": "cb-44",
    "name": "Spray Dried Premium",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "100% Coffee",
    "prices": {
      "50g": 103,
      "100g": 187,
      "250g": 442
    }
  },
  {
    "id": "cb-45",
    "name": "Spray Dried Classic",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "70% Coffee / 30% Chicory",
    "prices": {
      "50g": 85,
      "100g": 150,
      "250g": 350
    }
  },
  {
    "id": "cb-46",
    "name": "Spray Dried Strong",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "50% Coffee / 50% Chicory",
    "prices": {
      "50g": 71,
      "100g": 122,
      "250g": 281
    }
  },
  {
    "id": "cb-47",
    "name": "Agglomerated Gold",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "100% Coffee",
    "prices": {
      "50g": 143,
      "100g": 266,
      "250g": 641
    }
  },
  {
    "id": "cb-48",
    "name": "Agglomerated Premium",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "100% Coffee",
    "prices": {
      "50g": 106,
      "100g": 192,
      "250g": 456
    }
  },
  {
    "id": "cb-49",
    "name": "Agglomerated Classic",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "70% Coffee / 30% Chicory",
    "prices": {
      "50g": 88,
      "100g": 156,
      "250g": 365
    }
  },
  {
    "id": "cb-50",
    "name": "Agglomerated Strong",
    "categoryId": "instant-coffee",
    "category": "Instant Coffee",
    "detail": "50% Coffee / 50% Chicory",
    "prices": {
      "50g": 77,
      "100g": 133,
      "250g": 309
    }
  },
  {
    "id": "cb-51",
    "name": "Belgium Chocolate",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 168,
      "100g": 316,
      "250g": 765
    }
  },
  {
    "id": "cb-52",
    "name": "Caramel",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 185,
      "100g": 349,
      "250g": 848
    }
  },
  {
    "id": "cb-53",
    "name": "Vanilla",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 194,
      "100g": 368,
      "250g": 895
    }
  },
  {
    "id": "cb-54",
    "name": "Hazelnut",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 202,
      "100g": 384,
      "250g": 935
    }
  },
  {
    "id": "cb-55",
    "name": "Cinamon",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 218,
      "100g": 417,
      "250g": 1018
    }
  },
  {
    "id": "cb-56",
    "name": "Pumpkin Spice",
    "categoryId": "flavoured-instant",
    "category": "Flavoured Instant Coffee",
    "detail": "Freeze Dried Premium Base",
    "prices": {
      "50g": 198,
      "100g": 375,
      "250g": 914
    }
  },
  {
    "id": "cb-57",
    "name": "Single Origin - Washed",
    "categoryId": "cold-brew",
    "category": "Liquid Cold Brew Concentrate",
    "detail": "RTD: 3x Concentrate",
    "prices": {
      "180 ml": 419,
      "500 ml": 839,
      "1000 ml": 1645
    }
  },
  {
    "id": "cb-58",
    "name": "Single Origin - Naturals",
    "categoryId": "cold-brew",
    "category": "Liquid Cold Brew Concentrate",
    "detail": "RTD: 3x Concentrate",
    "prices": {
      "180 ml": 506,
      "500 ml": 1012,
      "1000 ml": 1985
    }
  },
  {
    "id": "cb-59",
    "name": "Commercial blends Arabica 80%",
    "categoryId": "cold-brew",
    "category": "Liquid Cold Brew Concentrate",
    "detail": "RTD: 3x Concentrate",
    "prices": {
      "180 ml": 297,
      "500 ml": 594,
      "1000 ml": 1165
    }
  },
  {
    "id": "cb-60",
    "name": "Commercial Blend - Arabica 20%",
    "categoryId": "cold-brew",
    "category": "Liquid Cold Brew Concentrate",
    "detail": "RTD: 3x Concentrate",
    "prices": {
      "180 ml": 199,
      "500 ml": 398,
      "1000 ml": 780
    }
  }
];

// ============================================================================
// Partitioned Datasets by Navigation Page (Sourced from Coffee Pricing PDF)
// ============================================================================

// 1. Commercial Page: Only Commercial Blends and South Indian Filter Coffee
export const COMMERCIAL_CATEGORIES = COFFEE_CATEGORIES.filter(cat => 
  ['commercial-blends', 'south-indian-filter'].includes(cat.id)
);
export const COMMERCIAL_COFFEES = COFFEE_BEANS_DATA.filter(coffee => 
  ['commercial-blends', 'south-indian-filter'].includes(coffee.categoryId)
);

// 2. Single Origin Page: All Single Origin & Estate Harvests till Nandan Estate
export const SINGLE_ORIGIN_CATEGORIES = COFFEE_CATEGORIES.filter(cat => 
  [
    'speciality-microlot',
    'baarbara-estate',
    'harley-estate',
    'msp-cauvery-peak',
    'vaishnavi-estate',
    'msp-coffee-estate',
    'nandan-estate'
  ].includes(cat.id)
);
export const SINGLE_ORIGIN_COFFEES = COFFEE_BEANS_DATA.filter(coffee => 
  [
    'speciality-microlot',
    'baarbara-estate',
    'harley-estate',
    'msp-cauvery-peak',
    'vaishnavi-estate',
    'msp-coffee-estate',
    'nandan-estate'
  ].includes(coffee.categoryId)
);

// 3. Instant Coffee Page: Page 2 of the PDF (Instant, Flavoured Instant, Liquid Cold Brew)
export const INSTANT_COFFEE_CATEGORIES = COFFEE_CATEGORIES.filter(cat => 
  ['instant-coffee', 'flavoured-instant', 'cold-brew'].includes(cat.id)
);
export const INSTANT_COFFEES = COFFEE_BEANS_DATA.filter(coffee => 
  ['instant-coffee', 'flavoured-instant', 'cold-brew'].includes(coffee.categoryId)
);

