//(Expo, 2024)
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

type Props = {
  id: string;
  occupied?: boolean;
  disabled?: boolean;
};

export default function ParkingBay({
  id,
  occupied = false,
  disabled = false,
}: Props) {
  return (
    <View style={[styles.bay, disabled && styles.disabledBay]}>
      {occupied && !disabled ? (
        <Image 
          source={require('@/assets/images/car.png')} 
          style={{ width: 50, height: 25, resizeMode: 'contain', opacity: disabled ? 0.3 : 1 }} 
        />
      ) : (
        <View style={styles.empty} />
      )}
      <Text style={[styles.label, disabled && styles.disabledLabel]}>{id}</Text>
    </View>
  );
}

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