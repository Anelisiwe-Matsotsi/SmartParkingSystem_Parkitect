import { View, StyleSheet } from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import { useAccessibility } from '@/context/accessibilityContext';
// (Expo, 2024; Firebase, 2026)
import React, { useMemo, useState, useEffect } from 'react';
import ParkingBay from './ParkingBay';
import SectionTabs from './SectionTabs';
// Firebase config import for user authentication (Firebase, 2026)
import { auth } from '@/config/firebaseConfig';

// Each number in "groups" is a block of bays; an aisle is drawn between blocks
const SECTIONS: Record<string, { prefix: string; title: string; groups: number[] }> = {
  'Section A': { prefix: 'A', title: 'Building A', groups: [16, 16] },
  'Section B': { prefix: 'B', title: 'Building B', groups: [62] },
  'Section C': { prefix: 'C', title: 'Building C', groups: [20, 19] },
  'Section D': { prefix: 'D', title: 'Building D', groups: [24, 23] },
  'Section E': { prefix: 'E', title: 'Building E', groups: [40, 40] },
};

// "A-03", "A03" and "a3" all become "A3" so they match the generated ids
const normalize = (raw: string) => {
  const m = String(raw ?? '').trim().match(/^([A-Za-z])\s*-?\s*0*(\d+)$/);
  return m ? `${m[1].toUpperCase()}${m[2]}` : String(raw ?? '').toUpperCase();
};

export default function ParkingLayout({ mapData }: { mapData: any }) {
  const { theme } = useAccessibility();
  // Manages active section state using hooks (Expo, 2024)
  const [activeSection, setActiveSection] = useState('Section A');
  const config = SECTIONS[activeSection];

  // Holds the users actual role from the backend
  const [userRole, setUserRole] = useState<string>('Student'); 

  // Fetches the users profile to check if they are a Lecturer
  useEffect(() => {
    const fetchUserRole = async () => {
      // Fetches the current authenticated users UID (Firebase, 2026)
      const firebaseUid = auth?.currentUser?.uid;
      if (!firebaseUid) return;

      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/User/profile/${firebaseUid}`);
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.userRole); // Sets 'Student' or 'Lecturer'
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const section = mapData?.sections?.find((s: any) =>
    s.sectionName?.toUpperCase().includes(activeSection.toUpperCase())
  );

  // Look up bays by normalized number instead of searching the array for every bay
  const bayLookup = useMemo(() => {
    const map = new Map<string, any>();
    section?.bays?.forEach((b: any) => map.set(normalize(b.bayNumber), b));
    return map;
  }, [section]);

  const isOccupied = (i: number) => {
    const realBay = bayLookup.get(`${config.prefix}${i}`);
    return realBay ? realBay.isOccupied : true; // live data fallback
  };

  const total = config.groups.reduce((a, b) => a + b, 0);
  let freeCount = 0;
  for (let i = 1; i <= total; i++) if (!isOccupied(i)) freeCount++;

  let nextBay = 1;

  // Determines if the current section should be disabled based on actual role
  const isSectionDisabled = activeSection === 'Section E' && userRole !== 'Lecturer';

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <SectionTabs selectedSection={activeSection} onSelectSection={setActiveSection} />

      <View style={[styles.sectionCard, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.tint }]}>{config.title} {isSectionDisabled ? "(Lecturer Only)" : ""}</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {isSectionDisabled ? "0" : freeCount} of {total} free
            </Text>
          </View>
        </View>

        {config.groups.map((count, groupIndex) => {
          const start = nextBay;
          nextBay += count;

          return (
            <View key={groupIndex}>
              {groupIndex > 0 && (
                <View style={styles.aisle}>
                  <Text style={styles.aisleText}>AISLE</Text>
                </View>
              )}
              <View style={styles.bayGrid}>
                {Array.from({ length: count }, (_, k) => {
                  const i = start + k;
                  return (
                    <ParkingBay
                      key={`${config.prefix}-${i}`}
                      id={`${config.prefix}-${i}`}
                      occupied={isSectionDisabled ? true : isOccupied(i)} // Forces occupied if disabled
                      disabled={isSectionDisabled} // Passes the disabled prop to gray it out
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginHorizontal: 8,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B5D6B',
    letterSpacing: 0.5,
  },
  pill: {
    backgroundColor: '#E8F7F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B5D6B',
  },
  bayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  aisle: {
    height: 26,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  aisleText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 6,
  },
});

/*
 * References
 * Expo, 2024. React Native Core Components. (Version 10.0) [Source Code] Available at: < https://reactnative.dev/docs/components-and-apis > [Accessed 28 September 2026]
 * Firebase, 2026. Firebase Authentication. (Version 10.0) [Source Code] Available at: < https://firebase.google.com/docs/auth > [Accessed 28 September 2026]
 */