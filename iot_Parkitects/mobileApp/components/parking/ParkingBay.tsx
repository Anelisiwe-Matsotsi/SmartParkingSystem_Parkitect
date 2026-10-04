//(Expo, 2024)
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAccessibility } from '@/context/accessibilityContext';

type Props = {
  id: string;
  occupied?: boolean;
  disabled?: boolean;
};

function ParkingBay({
  id,
  occupied = false,
  disabled = false,
}: Props) {
  const { theme, colorMode } = useAccessibility();
  return (
    <View style={[styles.bay, { backgroundColor: theme.surface }]}>
      {/* Always render the same two children (car + label) and only change opacity.
          Swapping an Image for an empty View on every poll is what stresses Fabric. */}
      <Image
        source={require('@/assets/images/car.png')}
        style={[
          styles.car,
          { opacity: occupied ? 1 : 0 },
          colorMode === 'dark' ? { tintColor: theme.muted } : null,
        ]}
      />
      <Text style={[styles.label, { color: theme.tint }]}>{id}</Text>
    </View>
  );
}

// memo: a bay only re-renders when its own id/occupied changes (or the theme context changes)
export default React.memo(ParkingBay);

// Stylesheet for UI elements (Expo, 2024)
const styles = StyleSheet.create({
  bay: {
    width: 55,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EAF0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  car: {
    width: 50,
    height: 25,
    resizeMode: 'contain',
  },
  disabledBay: {
    backgroundColor: '#F1F5F9', 
    borderColor: '#CBD5E1', 
  },
  empty: {
    width: 14,
    height: 14,
  },
  label: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "600",
    color: "#0B5D6B",
  },
  disabledLabel: {
    color: '#94A3B8', 
  }
});

/*
 * References
 * Expo, 2024. React Native Core Components. (Version 10.0) [Source Code] Available at: < https://reactnative.dev/docs/components-and-apis > [Accessed 28 September 2026]
 */