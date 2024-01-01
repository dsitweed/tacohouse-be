export interface RawRoomsI {
  name: string | number;
  tenants: {
    name: string;
  }[];
  price: number;
  currentElectricity: number;
  beforeElectricity: number;
  electricityPrice: number;
  waterPrice: number;
  environmentPrice: number;
  lightPrice?: number;
  wifiPrice?: number;
  debt?: number;
  total: number;
  area: number;
}

export const chanhRooms = [
  {
    name: 1,
    tenants: [
      {
        name: 'THÌ EM TRƯỞNG',
      },
    ],
    price: 900000,
    currentElectricity: 6458,
    beforeElectricity: 6438,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 1010000,
    area: 15,
  },
  {
    name: 2,
    tenants: [
      {
        name: 'Tuấn',
      },
      {
        name: 'Bông',
      },
    ],
    price: 900000,
    currentElectricity: 4257,
    beforeElectricity: 4227,
    electricityPrice: 3000,
    waterPrice: 80000,
    environmentPrice: 20000,
    total: 1090000,
    area: 15,
  },
  {
    name: 3,
    tenants: [
      {
        name: 'Quang nghệ an',
      },
    ],
    price: 1100000,
    currentElectricity: 1190,
    beforeElectricity: 1091,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 1447000,
    area: 15,
  },
  {
    name: 4,
    tenants: [
      {
        name: 'Nhung Nhâm nghệ an',
      },
    ],
    price: 900000,
    currentElectricity: 9302,
    beforeElectricity: 9247,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 20000,
    total: 1125000,
    area: 15,
  },
  {
    name: 5,
    tenants: [
      {
        name: 'Sự nghệ an',
      },
    ],
    price: 800000,
    currentElectricity: 927,
    beforeElectricity: 891,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 958000,
    area: 15,
  },
  {
    name: 6,
    tenants: [
      {
        name: 'PHẠN THỊ HẠNH.za lô.900',
      },
    ],
    price: 900000,
    currentElectricity: 6322,
    beforeElectricity: 6307,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 995000,
    area: 15,
  },
  {
    name: 7,
    tenants: [
      {
        name: 'Minh Tươi.nghệ an',
      },
    ],
    price: 950000,
    currentElectricity: 2672,
    beforeElectricity: 2566,
    electricityPrice: 3000,
    waterPrice: 80000,
    environmentPrice: 20000,
    total: 1368000,
    area: 15,
  },
  {
    name: 8,
    tenants: [
      {
        name: 'NAM THANH HÓA',
      },
    ],
    price: 800000,
    currentElectricity: 12909,
    beforeElectricity: 12884,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 925000,
    area: 15,
  },
  {
    name: 9,
    tenants: [
      {
        name: 'mẹ Huy Tuyên Quang',
      },
    ],
    price: 800000,
    currentElectricity: 6360,
    beforeElectricity: 6326,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 952000,
    area: 15,
  },
  {
    name: 10,
    tenants: [
      {
        name: 'Hòa Ngà ninh bình',
      },
    ],
    price: 800000,
    currentElectricity: 7569,
    beforeElectricity: 7481,
    electricityPrice: 3000,
    waterPrice: 40000,
    environmentPrice: 10000,
    total: 1114000,
    area: 15,
  },
  {
    name: 11,
    tenants: [
      {
        name: 'VĂN VIỆT',
      },
      {
        name: 'HUYỀN TRANG',
      },
    ],
    price: 1300000,
    currentElectricity: 2815,
    beforeElectricity: 2766,
    electricityPrice: 3000,
    waterPrice: 100000,
    environmentPrice: 30000,
    total: 1577000,
    area: 15,
  },
];
