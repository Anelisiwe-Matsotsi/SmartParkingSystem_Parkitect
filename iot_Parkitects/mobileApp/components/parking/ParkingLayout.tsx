import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ParkingBay from "./ParkingBay";

export default function ParkingLayout() {
  return (
    <View style={styles.container}>

     

      <View style={styles.map}>

        <View>

          <ParkingBay id="A-01" occupied />
          <ParkingBay id="A-02" />
          <ParkingBay id="A-03" occupied />
          <ParkingBay id="A-04" />
          <ParkingBay id="A-05" />

        </View>

        <View style={styles.road}>

          <Text style={styles.roadText}>AISLE</Text>

          <Text style={styles.entry}>ENTRY</Text>

        </View>

        <View>

          <ParkingBay id="A-06" />
          <ParkingBay id="A-07" occupied />
          <ParkingBay id="A-08" />
          <ParkingBay id="A-09" occupied />
          <ParkingBay id="A-10" />

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 20,
    marginTop: 0,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
   
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  map: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  road: {
    width: 70,
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  roadText: {
    transform: [{ rotate: "-90deg" }],
    color: "#A3AAB8",
    fontWeight: "700",
    letterSpacing: 4,
    position: "absolute",
  },

  entry: {
    position: "absolute",
    bottom: 8,
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "700",
  },

});