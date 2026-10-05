// grouped the bays together for search
export const SECTIONS: Record<string, { prefix: string; title: string; groups: number[] }> = {
  'Section A': { prefix: 'A', title: 'Building A', groups: [16, 16] },
  'Section B': { prefix: 'B', title: 'Building B', groups: [62] },
  'Section C': { prefix: 'C', title: 'Building C', groups: [20, 19] },
  'Section D': { prefix: 'D', title: 'Building D', groups: [24, 23] },
  'Section E': { prefix: 'E', title: 'Building E', groups: [40, 40] },
};

// "A-03", "A03" and "a3" all become "A3" so they match the generated ids
export const normalize = (raw: string) => {
  const m = String(raw ?? '').trim().match(/^([A-Za-z])\s*-?\s*0*(\d+)$/);
  return m ? `${m[1].toUpperCase()}${m[2]}` : String(raw ?? '').toUpperCase();
};

// Turns what the user typed ("e1", "E-01", " e 12 ") into the section tab and bay to show,
// or null if that bay is not in the layout
export const parseBaySearch = (query: string): { section: string; bay: string } | null => {
  const m = String(query ?? '').trim().match(/^([A-Za-z])\s*-?\s*0*(\d+)$/);
  if (!m) return null;

  const prefix = m[1].toUpperCase();
  const number = parseInt(m[2], 10);

  const section = Object.keys(SECTIONS).find((key) => SECTIONS[key].prefix === prefix);
  if (!section || number < 1) return null;

  const total = SECTIONS[section].groups.reduce((a, b) => a + b, 0);
  if (number > total) return null;

  return { section, bay: `${prefix}${number}` };
};