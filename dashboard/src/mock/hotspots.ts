import { HotspotZone } from '../types';

export const mockHotspots: HotspotZone[] = [
  {
    zoneId: "hz-kol-1",
    name: "Park Street & Shakespeare Sarani Sector",
    district: "Kolkata South / Park Street PS",
    lat: 22.5510,
    lng: 88.3524,
    radius: 1100,
    density: 21.4,
    type: "confirmed",
    confidence: 96,
    activeCasesCount: 7,
    crimeTypeBreakdown: {
      "Commercial Burglary": 4,
      "Luxury Goods Theft": 3
    }
  },
  {
    zoneId: "hz-kol-2",
    name: "Salt Lake Sector V IT & Electronics Complex",
    district: "Bidhannagar East / Sector V PS",
    lat: 22.5794,
    lng: 88.4373,
    radius: 1250,
    density: 19.8,
    type: "confirmed",
    confidence: 94,
    activeCasesCount: 8,
    crimeTypeBreakdown: {
      "IT Hardware Warehouse Break-In": 5,
      "High-Value Server Theft": 3
    }
  },
  {
    zoneId: "hz-kol-3",
    name: "Burrabazar & Posta Wholesale Commercial Belt",
    district: "Kolkata North / Burrabazar PS",
    lat: 22.5841,
    lng: 88.3570,
    radius: 950,
    density: 25.2,
    type: "confirmed",
    confidence: 91,
    activeCasesCount: 9,
    crimeTypeBreakdown: {
      "Wholesale Cash Vault Lockbreak": 5,
      "Safe Grinding Heist": 4
    }
  },
  {
    zoneId: "hz-kol-4",
    name: "Howrah Station Commercial Logistics Hub",
    district: "Howrah Precinct / Golabari PS",
    lat: 22.5839,
    lng: 88.3426,
    radius: 1350,
    density: 23.6,
    type: "confirmed",
    confidence: 95,
    activeCasesCount: 10,
    crimeTypeBreakdown: {
      "Cargo Truck Hijack": 6,
      "Transit Cash Van Ramming": 4
    }
  },

  // PREDICTED RISING RISK ZONE (30-DAY FORECAST LAYER FOR KOLKATA)
  {
    zoneId: "hz-pred-kol-1",
    name: "New Town Action Area I - Rajarhat Expressway Corridor",
    district: "New Town Bidhannagar Precinct",
    lat: 22.5890,
    lng: 88.4720,
    radius: 1800,
    density: 13.5,
    type: "predicted",
    confidence: 88,
    predictedTrend: "increasing",
    activeCasesCount: 4,
    crimeTypeBreakdown: {
      "Predicted Night Burglary": 6,
      "Predicted Tech Warehouse Targets": 4
    },
    boundaryCoordinates: [
      [22.5980, 88.4600],
      [22.6080, 88.4820],
      [22.5820, 88.4900],
      [22.5720, 88.4650],
      [22.5980, 88.4600]
    ]
  },
  {
    zoneId: "hz-pred-kol-2",
    name: "Sealdah Freight Yard & Railway Depot Border",
    district: "Kolkata Central / Sealdah PS",
    lat: 22.5660,
    lng: 88.3740,
    radius: 1300,
    density: 11.2,
    type: "predicted",
    confidence: 78,
    predictedTrend: "increasing",
    activeCasesCount: 3,
    crimeTypeBreakdown: {
      "Predicted Goods Cargo Theft": 5
    },
    boundaryCoordinates: [
      [22.5740, 88.3660],
      [22.5780, 88.3840],
      [22.5600, 88.3880],
      [22.5560, 88.3700],
      [22.5740, 88.3660]
    ]
  }
];
