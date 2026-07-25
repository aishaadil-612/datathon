import { GraphRelationship } from '../types';

export const mockRelationships: GraphRelationship[] = [
  // Person to Organization / Leadership
  {
    id: "r1",
    source: "p1",
    target: "o1",
    type: "leads",
    confidence: 96,
    evidenced: true,
    description: "Identified as primary ringleader of Kalyan Syndicate across multiple state dossiers."
  },
  {
    id: "r2",
    source: "p2",
    target: "p1",
    type: "associated_with",
    confidence: 90,
    evidenced: true,
    description: "Over 140 inter-phone calls logged between Rajesh and Vikram during crime windows."
  },

  // Vehicle relationships (Solid = Direct ANPR / Evidence; Dashed = MO linkage)
  {
    id: "r3",
    source: "p3",
    target: "v1",
    type: "owns",
    confidence: 100,
    evidenced: true,
    description: "Registered owner of silver Mahindra XUV700 (KA-03-MN-4921) per RTO records."
  },
  {
    id: "r4",
    source: "p1",
    target: "v1",
    type: "operates",
    confidence: 92,
    evidenced: true,
    description: "CCTV facial matching confirmed Rajesh driving KA-03-MN-4921 post Indiranagar heist."
  },
  {
    id: "r5",
    source: "v1",
    target: "c1",
    type: "spotted_at_scene",
    confidence: 88,
    evidenced: true,
    description: "ANPR hit #882 on Whitefield Main Road 6 minutes post burglary."
  },
  {
    id: "r6",
    source: "v1",
    target: "c2",
    type: "spotted_at_scene",
    confidence: 94,
    evidenced: true,
    description: "Captured on 100 Ft Road ANPR camera 03:32 AM with obfuscated rear plate."
  },
  {
    id: "r7",
    source: "v1",
    target: "c3",
    type: "linked_by_mo",
    confidence: 78,
    evidenced: false,
    description: "Tire tread width matches 225mm All-Terrain profile recorded at Koramangala site."
  },
  {
    id: "r8",
    source: "v1",
    target: "c4",
    type: "rammed_vehicle",
    confidence: 95,
    evidenced: true,
    description: "Paint transfer analysis from cash van bumper matches Metallic Silver paint code."
  },

  // Weapon / Tool linkages (Inferred MO pattern vs Physical Recovery)
  {
    id: "r9",
    source: "w1",
    target: "c1",
    type: "tool_matched_mo",
    confidence: 89,
    evidenced: false,
    description: "Kerf width (2.4mm) on shutter lock matches DeWalt 9-inch diamond cutting blade."
  },
  {
    id: "r10",
    source: "w1",
    target: "c2",
    type: "tool_matched_mo",
    confidence: 91,
    evidenced: false,
    description: "Metallic slag chemistry recovered at gold vault matches DeWalt blade alloy."
  },
  {
    id: "r11",
    source: "w1",
    target: "l2",
    type: "recovered_at",
    confidence: 100,
    evidenced: true,
    description: "Seized during police search at Hoodi ORR Warehouse on 2026-07-21."
  },

  // Suspect to Case links
  {
    id: "r12",
    source: "p1",
    target: "c1",
    type: "suspect_in",
    confidence: 91,
    evidenced: true,
    description: "Cell tower ping matching suspect's primary SIM at 02:46 AM near Tech Park."
  },
  {
    id: "r13",
    source: "p1",
    target: "c4",
    type: "charged_in",
    confidence: 98,
    evidenced: true,
    description: "Latent thumbprint recovered from weapon handle seized after Marathahalli heist."
  },
  {
    id: "r14",
    source: "p3",
    target: "l2",
    type: "operates_location",
    confidence: 95,
    evidenced: true,
    description: "Lease agreement for Hoodi industrial yard signed in Suresh Gowda's name."
  }
];
