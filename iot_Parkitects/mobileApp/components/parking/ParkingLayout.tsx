import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ParkingBay from './ParkingBay';
import SectionTabs from './SectionTabs';

export default function ParkingLayout({ mapData }: { mapData: any }) {
  const [activeSection, setActiveSection] = useState('U-View');

  const getSection = (name: string) => {
    return mapData?.sections?.find((s: any) => s.sectionName?.toUpperCase().includes(name.toUpperCase()));
  };

  // Renders an exact horizontal row of bays for the blueprint
  const renderRow = (sectionData: any, prefix: string, startIndex: number, count: number) => {
    const bays = [];
    for (let i = startIndex; i < startIndex + count; i++) {
      const realBay = sectionData?.bays?.find((b: any) => b.bayNumber === `${prefix}${i}` || b.bayNumber === `${prefix}-${i}`);
      bays.push(
        <ParkingBay
          key={`${prefix}-${i}`}
          id={`${prefix}-${i}`}
          occupied={realBay ? realBay.isOccupied : i % 6 === 0} // Live data fallback
        />
      );
    }
    return <View style={styles.parkingRow}>{bays}</View>;
  };

  return (
    <View style={styles.container}>
      {/* THE ONLY TAB BAR */}
      <SectionTabs selectedSection={activeSection} onSelectSection={setActiveSection} />

      {/* HORIZONTAL SCROLL ALLOWS THE MAP TO BE WIDE LIKE A REAL BLUEPRINT */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.blueprintCanvas}>
          
          {/* E, D, C STACKED IN THE CENTER */}
          {(activeSection === 'U-View' || activeSection === 'Section E') && (
            <View style={styles.buildingBlock}>
              <Text style={styles.buildingTitle}>BUILDING E (~80 BAYS)</Text>
              {renderRow(getSection('SECTION E'), 'E', 1, 20)}
              {renderRow(getSection('SECTION E'), 'E', 21, 20)}
              <View style={styles.aisle}><Text style={styles.aisleText}>AISLE</Text></View>
              {renderRow(getSection('SECTION E'), 'E', 41, 20)}
              {renderRow(getSection('SECTION E'), 'E', 61, 20)}
            </View>
          )}

          {(activeSection === 'U-View' || activeSection === 'Section D') && (
            <View style={styles.buildingBlock}>
              <Text style={styles.buildingTitle}>BUILDING D (47 BAYS)</Text>
              {renderRow(getSection('SECTION D'), 'D', 1, 24)}
              <View style={styles.aisle}><Text style={styles.aisleText}>AISLE</Text></View>
              {renderRow(getSection('SECTION D'), 'D', 25, 23)}
            </View>
          )}

          {(activeSection === 'U-View' || activeSection === 'Section C') && (
            <View style={styles.buildingBlock}>
              <Text style={styles.buildingTitle}>BUILDING C (39 BAYS)</Text>
              {renderRow(getSection('SECTION C'), 'C', 1, 20)}
              <View style={styles.aisle}><Text style={styles.aisleText}>AISLE</Text></View>
              {renderRow(getSection('SECTION C'), 'C', 21, 19)}
            </View>
          )}

          {/* BOTTOM SECTION: B ON LEFT, A ON RIGHT */}
          <View style={styles.bottomCampus}>
            {(activeSection === 'U-View' || activeSection === 'Section B') && (
              <View style={styles.buildingBlockSide}>
                <Text style={styles.buildingTitle}>BUILDING B (62 BAYS)</Text>
                {renderRow(getSection('SECTION B'), 'B', 1, 21)}
                {renderRow(getSection('SECTION B'), 'B', 22, 21)}
                {renderRow(getSection('SECTION B'), 'B', 43, 20)}
              </View>
            )}

            {(activeSection === 'U-View' || activeSection === 'Section A') && (
              <View style={[styles.buildingBlockSide, { marginLeft: activeSection === 'U-View' ? 120 : 0 }]}>
                <Text style={styles.buildingTitle}>BUILDING A (32 BAYS)</Text>
                {renderRow(getSection('SECTION A'), 'A', 1, 16)}
                <View style={styles.aisle}><Text style={styles.aisleText}>AISLE</Text></View>
                {renderRow(getSection('SECTION A'), 'A', 17, 16)}
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 20,
    overflow: 'hidden'
  },
  blueprintCanvas: {
    padding: 20,
    // Forces the canvas to be wide enough to fit 24 horizontal bays (24 * ~55px)
    width: 1400, 
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  buildingBlock: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  bottomCampus: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  buildingBlockSide: {
    alignItems: 'center',
  },
  parkingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  buildingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B5D6B',
    marginBottom: 10,
    letterSpacing: 1,
  },
  aisle: {
    width: '80%',
    height: 30,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  aisleText: {
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 6,
  }
});