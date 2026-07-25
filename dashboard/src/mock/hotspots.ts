import { HotspotZone } from '../types';

export const mockHotspots: HotspotZone[] = [
  {
    zoneId: "hz-1",
    name: "Whitefield Tech Park Sector",
    district: "Whitefield",
    lat: 12.9698,
    lng: 77.7499,
    radius: 1200,
    density: 18.4,
    type: "confirmed",
    confidence: 95,
    activeCasesCount: 6,
    crimeTypeBreakdown: {
      "Commercial Burglary": 4,
      "Vehicle Theft": 2
    }
  },
  {
    zoneId: "hz-2",
    name: "Indiranagar 100 Ft Road Commercial Strip",
    district: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    radius: 950,
    density: 22.1,
    type: "confirmed",
    confidence: 92,
    activeCasesCount: 8,
    crimeTypeBreakdown: {
      "Armed Robbery": 3,
      "Commercial Burglary": 3,
      "Snatching": 2
    }
  },
  {
    zoneId: "hz-3",
    name: "Koramangala 4th Block Logistics Hub",
    district: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    radius: 1100,
    density: 14.8,
    type: "confirmed",
    confidence: 88,
    activeCasesCount: 5,
    crimeTypeBreakdown: {
      "Warehouse Heist": 3,
      "Cargo Theft": 2
    }
  },
  {
    zoneId: "hz-4",
    name: "Marathahalli ORR Junction",
    district: "Marathahalli",
    lat: 12.9569,
    lng: 77.7011,
    radius: 1400,
    density: 26.5,
    type: "confirmed",
    confidence: 96,
    activeCasesCount: 9,
    crimeTypeBreakdown: {
      "Armed Heist": 4,
      "Vehicle Ramming": 2,
      "Extortion": 3
    }
  },

  // PREDICTED RISING RISK ZONE (30-DAY FORECAST LAYER)
  {
    zoneId: "hz-pred-1",
    name: "Hoodi - Outer Ring Road Transit Corridor",
    district: "Whitefield / Mahadevapura",
    lat: 12.9912,
    lng: 77.7154,
    radius: 1800,
    density: 12.2,
    type: "predicted",
    confidence: 88,
    predictedTrend: "increasing",
    activeCasesCount: 3,
    crimeTypeBreakdown: {
      "Predicted Night Break-ins": 5,
      "Predicted Warehouse Targets": 3
    },
    boundaryCoordinates: [
      [12.9980, 77.7050],
      [12.9995, 77.7250],
      [12.9830, 77.7290],
      [12.9810, 77.7080],
      [12.9980, 77.7050]
    ]
  },
  {
    zoneId: "hz-pred-2",
    name: "KR Puram Railway Yard Border",
    district: "KR Puram",
    lat: 13.0075,
    lng: 77.6950,
    radius: 1300,
    density: 9.5,
    type: "predicted",
    confidence: 76,
    predictedTrend: "increasing",
    activeCasesCount: 2,
    crimeTypeBreakdown: {
      "Predicted Freight Theft": 4
    },
    boundaryCoordinates: [
      [13.0140, 77.6870],
      [13.0160, 77.7040],
      [13.0000, 77.7060],
      [12.9990, 77.6890],
      [13.0140, 77.6870]
    ]
  }
];
