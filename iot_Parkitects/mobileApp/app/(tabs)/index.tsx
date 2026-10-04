//(Expo Documentation.2024)
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlertBanner from '@/components/notifications/AlertBanner' 
import HomeHeader from '@/components/parking/HomeHeader';
import ParkingLayout from '@/components/parking/ParkingLayout';
import { Colors } from '@/constants/theme';
import { useAccessibility } from '@/context/accessibilityContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [showAlert, setShowAlert] = useState(true);
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, triggerScreenReader } = useAccessibility();

  const lastJson = useRef('');
  // Fetch the data globally on the home screen
  const fetchMapData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Parking/map`);
      if (res.ok) {
        const text = await res.text();
        if (text !== lastJson.current) {   // only update when the data actually changed
        lastJson.current = text;
        setMapData(JSON.parse(text));
      }
    }
    } catch (err) {
      console.warn('Map Fetch Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
    const interval = setInterval(fetchMapData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Extract total available bays for the header
  const availableBays = mapData?.availableBays ?? 0;
  const isLimited = availableBays > 0 && availableBays <= 15;

  useEffect(() => {
    if (!loading) {
      triggerScreenReader(`Home screen. ${availableBays} bays left`);
    }
  }, [loading]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView removeClippedSubviews={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Pass live data to Header */}
        <HomeHeader availableSpaces={availableBays} />
        
        {isLimited && showAlert && (
          <AlertBanner
            title="LIMITED BAYS"
            message={`The campus parking only has ${availableBays} bays available`}
            icon="clock"
            onDismiss={() => setShowAlert(false)}
          />
        )}
        
        {/* Pass live data to the Map Layout. NO DUPLICATE TABS HERE! */}
        {loading ? (
          <ActivityIndicator size="large" color="#146564" style={{ marginTop: 40 }} />
        ) : (
          <ParkingLayout mapData={mapData} />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingBottom: 24,
  }
});