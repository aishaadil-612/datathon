import { HotspotZone } from '../types';

export const mockHotspots: HotspotZone[] = [
  {
    zoneId: "hz-ka-1",
    name: "Whitefield & ITPL Tech Park Sector",
    district: "Bengaluru City / Whitefield PS (SCRB #KA-104)",
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
    zoneId: "hz-ka-2",
    name: "Indiranagar 100 Ft Road Commercial Strip",
    district: "Bengaluru City / Indiranagar PS (SCRB #KA-082)",
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
    zoneId: "hz-ka-3",
    name: "Koramangala 4th Block Logistics Hub",
    district: "Bengaluru City / Koramangala PS (SCRB #KA-064)",
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
    zoneId: "hz-ka-4",
    name: "Marathahalli - ORR Logistics Corridor",
    district: "Bengaluru City / Marathahalli PS (SCRB #KA-112)",
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
  {
    zoneId: "hz-ka-5",
    name: "Peenya Industrial Area Phase II",
    district: "Bengaluru West / Peenya PS (SCRB #KA-155)",
    lat: 13.0323,
    lng: 77.5256,
    radius: 1300,
    density: 17.2,
    type: "confirmed",
    confidence: 90,
    activeCasesCount: 7,
    crimeTypeBreakdown: {
      "Industrial Cutter Theft": 4,
      "Factory Safe Break-In": 3
    }
  },

  // PREDICTED RISING RISK ZONES (30-DAY FORECAST LAYER FOR KARNATAKA SCRB)
  {
    zoneId: "hz-pred-ka-1",
    name: "Hoodi - Outer Ring Road Transit Corridor",
    district: "Whitefield / Mahadevapura Sub-Division",
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
    zoneId: "hz-pred-ka-2",
    name: "KR Puram Railway Yard Border",
    district: "KR Puram PS (SCRB #KA-120)",
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
