//(Expo Documentation.2024)
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAccessibility } from '@/context/accessibilityContext';

type Props = {
  id: string;
  occupied?: boolean;
};

export default function ParkingBay({
  id,
  occupied = false,
}: Props) {
  const { theme } = useAccessibility();
  return (
    <View style={[styles.bay, { backgroundColor: theme.surface }]}>
      {occupied ? (
        <Image source={require('@/assets/images/car.png')} style={{ width: 50, height: 25, resizeMode: 'contain' }} />
      ) : (
        <View style={styles.empty} />
      )}
      <Text style={[styles.label, { color: theme.tint }]}>{id}</Text>
    </View>
  );
}

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
});