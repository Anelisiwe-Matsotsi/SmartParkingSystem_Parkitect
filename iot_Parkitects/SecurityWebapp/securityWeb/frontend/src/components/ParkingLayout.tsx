import { useMemo, useState } from "react";
import ParkingBay from "../components/ParkingBay";
import SectionTabs from "../components/SectionTabs";
import { normalizeBay } from "../services/parking";
import type { BayMap, ParkingMap } from "../services/api";

type ParkingLayoutProps = {
  onBayClick: (id: string) => void
  // live data from api/Parking/map (same shape the mobile app uses)
  mapData: ParkingMap | null
}

// Each number in "groups" is a block of bays; an aisle is drawn between blocks
const SECTIONS: Record<string, { prefix: string; title: string; groups: number[] }> = {
  "Section A": { prefix: "A", title: "Building A", groups: [16, 16] },
  "Section B": { prefix: "B", title: "Building B", groups: [62] },
  "Section C": { prefix: "C", title: "Building C", groups: [20, 19] },
  "Section D": { prefix: "D", title: "Building D", groups: [24, 23] },
  "Section E": { prefix: "E", title: "Building E", groups: [40, 40] },
};

export default function ParkingLayout({onBayClick, mapData}: ParkingLayoutProps) {

  const [activeSection, setActiveSection] = useState("Section A");
  const config = SECTIONS[activeSection];

  // every bay from the live data, keyed by its normalized number (A1, E37 ...)
  const bayLookup = useMemo(() => {
    const lookup = new Map<string, BayMap>();
    mapData?.sections?.forEach((section) =>
      section.bays?.forEach((bay) => lookup.set(normalizeBay(bay.bayNumber), bay))
    );
    return lookup;
  }, [mapData]);

  // free bays in this section (bays that are not in the live data yet are not counted)
  const slots = config.groups.reduce((a, b) => a + b, 0);
  let total = 0;
  let freeCount = 0;
  for (let i = 1; i <= slots; i++) {
    const bay = bayLookup.get(`${config.prefix}${i}`);
    if (bay) {
      total++;
      if (!bay.isOccupied) freeCount++;
    }
  }

  let nextBay = 1;

  return (
    <div className="parking-layout">

      <SectionTabs selectedSection={activeSection} onSelectSection={setActiveSection} />

      <div className="section-card">

        <div className="section-header">
          <h3 className="section-title">{config.title}</h3>
          <span className="section-pill">
            {mapData ? `${freeCount} of ${total} free` : "Loading..."}
          </span>
        </div>

        {config.groups.map((count, groupIndex) => {
          const start = nextBay;
          nextBay += count;

          return (
            <div key={groupIndex}>

              {/* Road / aisle */}
              {groupIndex > 0 && (
                <div className="section-aisle"><span>AISLE</span></div>
              )}

              <div className="section-grid">
                {Array.from({ length: count }, (_, k) => {
                  const i = start + k;
                  const realBay = bayLookup.get(`${config.prefix}${i}`);
                  return (
                    <ParkingBay
                      key={`${config.prefix}-${i}`}
                      id={`${config.prefix}-${String(i).padStart(2, "0")}`}
                      occupied={realBay ? realBay.isOccupied : false} // bays missing from the data show as empty
                      onClick={onBayClick}
                    />
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
{/*
  References
 Yilmaz.2018. car park. (Version 2.0) [Source code] Available at: <https://codepen.io/tenkyu/pen/zaJwaR> [Accessed 17 Aug. 2026].
  Racisz, T. 2020. Creating an interactive map with React and Firebase. (Version 2.0) [Source code] .Available at: <https://medium.com/@travisracisz/creating-an-interactive-map-with-react-and-firebase-fa183cef15c9 > [Accessed 5 Aug. 2026].
  */}