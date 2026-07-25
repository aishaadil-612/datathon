import { GraphEntity } from '../types';

export const mockEntities: GraphEntity[] = [
  // Suspect Persons
  {
    id: "p1",
    type: "person",
    label: "Rajesh Kumar",
    sublabel: "Alias 'Raja' (Gang Leader)",
    riskLevel: "high",
    attributes: {
      age: 34,
      priorConvictions: 4,
      status: "Prime Suspect / Absconding",
      phone: "+91 98450 11204",
      knownAlias: "Raja Bhai",
      associatedGang: "Kalyan Syndicate"
    }
  },
  {
    id: "p2",
    type: "person",
    label: "Vikram Singh",
    sublabel: "Key Lieutenant / Driver",
    riskLevel: "high",
    attributes: {
      age: 29,
      priorConvictions: 2,
      status: "Detained for Questioning",
      phone: "+91 98452 88401",
      licenseNo: "KA-03-2022-909"
    }
  },
  {
    id: "p3",
    type: "person",
    label: "Suresh Gowda",
    sublabel: "Logistics & Fence Operator",
    riskLevel: "medium",
    attributes: {
      age: 41,
      priorConvictions: 1,
      status: "Under Surveillance",
      phone: "+91 99001 44521",
      businessName: "Gowda Pawn & Scrap, Hoodi"
    }
  },

  // Cases
  {
    id: "c1",
    type: "case",
    label: "FIR-2026-0489",
    sublabel: "Whitefield Electronics Burglary",
    riskLevel: "high",
    attributes: {
      district: "Whitefield",
      dateTime: "2026-07-02",
      lossAmount: "₹42 Lakhs",
      status: "Under Investigation"
    }
  },
  {
    id: "c2",
    type: "case",
    label: "FIR-2026-0512",
    sublabel: "Indiranagar Gold Heist",
    riskLevel: "high",
    attributes: {
      district: "Indiranagar",
      dateTime: "2026-07-09",
      lossAmount: "3.2 kg Gold Bullion",
      status: "Under Investigation"
    }
  },
  {
    id: "c3",
    type: "case",
    label: "FIR-2026-0534",
    sublabel: "Koramangala Warehouse Heist",
    riskLevel: "medium",
    attributes: {
      district: "Koramangala",
      dateTime: "2026-07-15",
      lossAmount: "₹28 Lakhs Microprocessors",
      status: "Open"
    }
  },
  {
    id: "c4",
    type: "case",
    label: "FIR-2026-0560",
    sublabel: "Marathahalli Cash Van Interception",
    riskLevel: "high",
    attributes: {
      district: "Marathahalli",
      dateTime: "2026-07-20",
      lossAmount: "₹65 Lakhs Cash",
      status: "Charge Sheeted"
    }
  },

  // Vehicles
  {
    id: "v1",
    type: "vehicle",
    label: "KA-03-MN-4921",
    sublabel: "Silver Mahindra XUV700",
    riskLevel: "high",
    attributes: {
      registeredOwner: "Suresh Gowda",
      chassisNo: "MAH700XUV98124",
      anprHits: 14,
      color: "Metallic Silver"
    }
  },

  // Locations
  {
    id: "l1",
    type: "location",
    label: "Whitefield Tech Park Hub",
    sublabel: "Incident Location (FIR-0489)",
    riskLevel: "medium",
    attributes: {
      lat: 12.9698,
      lng: 77.7499,
      zone: "Whitefield Sector 3"
    }
  },
  {
    id: "l2",
    type: "location",
    label: "Hoodi ORR Safehouse",
    sublabel: "Stolen Goods Drop Point",
    riskLevel: "high",
    attributes: {
      lat: 12.9912,
      lng: 77.7154,
      zone: "Hoodi Industrial Area"
    }
  },

  // Organization / Gang
  {
    id: "o1",
    type: "organization",
    label: "Kalyan Criminal Syndicate",
    sublabel: "Organized Interstate Robbery Network",
    riskLevel: "high",
    attributes: {
      estimatedMembers: 8,
      primaryTarget: "High Value Retail & Vaults",
      activeSince: "2024"
    }
  },

  // Weapon
  {
    id: "w1",
    type: "weapon",
    label: "DeWalt Heavy Angle Grinder",
    sublabel: "Industrial Cutting Equipment",
    riskLevel: "medium",
    attributes: {
      serialNo: "DW-98214-CUT",
      recoveredAt: "Hoodi Hideout Raid",
      matchedInCases: "FIR-0489, FIR-0512, FIR-0534"
    }
  }
];
