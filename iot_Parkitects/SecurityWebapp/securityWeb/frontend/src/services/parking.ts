import type { BayMap, ParkingMap } from "./api";

// Turns "A01", "A-1", "a1" into "A1" so the map ids match the database bay numbers
export const normalizeBay = (raw: string) => {
  const m = String(raw ?? "").trim().match(/^([A-Za-z])\s*-?\s*0*(\d+)$/);
  return m ? `${m[1].toUpperCase()}${m[2]}` : String(raw ?? "").toUpperCase();
};

// Finds the live data for a bay id like "A-01" (returns null if it is not in the data)
export const findBay = (map: ParkingMap | null, bayId: string): BayMap | null => {
  if (!map) return null;
  const wanted = normalizeBay(bayId);
  for (const section of map.sections ?? []) {
    const bay = section.bays?.find((b) => normalizeBay(b.bayNumber) === wanted);
    if (bay) return bay;
  }
  return null;
};