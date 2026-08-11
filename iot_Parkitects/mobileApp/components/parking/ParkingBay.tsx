import React from "react";
import { View, Text, StyleSheet,Image } from "react-native";
 import {Feather} from '@expo/vector-icons';

type Props = {
  id: string;
  occupied?: boolean;
};

export default function ParkingBay({
  id,
  occupied = false,
}: Props) {
  return (
    <View style={styles.bay}>
      {occupied ? (
        <Image source={require('@/assets/images/car.png') } style={{ width:260, height:30,  resizeMode:'contain'}} />
      ) : (
        <View style={styles.empty} />
      )}

      <Text style={styles.label}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bay: {
    width: 70,
    height: 62,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EAF0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  empty: {
    width: 18,
    height: 18,
  },

  label: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "600",
    color: "#0B5D6B",
  },
});