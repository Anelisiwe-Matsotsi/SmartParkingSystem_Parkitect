//(Expo Documentation.2024)
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAccessibility } from '@/context/accessibilityContext';

type Props = {
  id: string;
  occupied?: boolean;
};

function ParkingBay({
  id,
  occupied = false,
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
  label: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "600",
    color: "#0B5D6B",
  },
});