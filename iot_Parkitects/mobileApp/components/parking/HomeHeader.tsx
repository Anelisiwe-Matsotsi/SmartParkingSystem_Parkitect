//(Withfra.me, 2022)
import React from "react";
import { useRouter } from 'expo-router';
import  {useState} from 'react';
import AlertBanner from '@/components/notifications/AlertBanner'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Linking
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  requestBlePermissions,
  isBluetoothOn,
  tryEnableBluetooth,
  scanNearbyNodes,
} from '@/utils/ble';
import SearchBar from "./SearchBar";

export default function HomeHeader() {
  const router = useRouter();
  const availableSpaces = 3;
  const [showAlert, setShowAlert] = useState(true);
  const [scanning, setScanning] = useState(false);
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        
   {/** * Header (Withfra.me, 2022) */}     
<View style={styles.topRow}>
  

 
  <TouchableOpacity style={styles.locationBadge}>
    <View style={styles.locationDot} />
    <Text style={styles.locationText}>LIVE</Text>
  </TouchableOpacity>


  <View style={styles.rightButtons}>

    {/* Notifications */}
    <TouchableOpacity style={styles.iconButton}
        onPress={() => router.push('/notifications')}>
      <Feather name="bell" size={18} color="#111827" />
      
    </TouchableOpacity>

    {/* User Initials */}
    <TouchableOpacity
      style={styles.avatarButton}
      onPress={() => router.push('/settings/setting')}
    >
      <Text style={styles.avatarText}>MA</Text>
    </TouchableOpacity>

  </View>

</View>

       

        {/* Heading */}
        <Text style={styles.heading}>
          {availableSpaces} Bays Left
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Go to Moffet and main
        </Text>
  <TouchableOpacity
  onPress={async () => {
    const mapsUrl =
      "https://maps.app.goo.gl/rJiNs9tSvVf75Tqf9?g_st=aw";

    try {
      await Linking.openURL(mapsUrl);
    } catch (error) {
      console.error("Could not open maps:", error);

      Alert.alert(
        "Unable to open maps",
        "Something went wrong while opening the parking location."
      );
    }
  }}
  style={styles.headerAction}
>
  <Feather
    color="#e2f1f3"
    name="arrow-right"
    size={24}
  />
</TouchableOpacity>

          <TouchableOpacity
  style={styles.parkingButton}
 onPress={async () => {
  try {
    setScanning(true);

    const permissionResult = await requestBlePermissions();

    if (permissionResult === 'blocked') {
      Alert.alert(
        'Bluetooth permission blocked',
        'Please enable Bluetooth permissions for Parkitects in your phone settings.'
      );
      return;
    }

    if (permissionResult === 'denied') {
      Alert.alert(
        'Bluetooth permission required',
        'Parkitects needs Bluetooth permission to find your parking bay.'
      );
      return;
    }

    const bluetoothOn = await isBluetoothOn();

    if (!bluetoothOn) {
      const enabled = await tryEnableBluetooth();

      if (!enabled) {
        Alert.alert(
          'Bluetooth is off',
          'Please turn on Bluetooth and try again.'
        );
        return;
      }
    }

    const nodes = await scanNearbyNodes();

    if (nodes.length === 0) {
      Alert.alert(
        'No parking bays found',
        'We could not detect a nearby parking beacon. Try moving closer to your parking bay and scan again.'
      );
      return;
    }

    const message = nodes
      .map(
        node =>
          `${node.label}\nRSSI: ${node.rssi.toFixed(1)} dBm`
      )
      .join('\n\n');

    Alert.alert(
      'Nearby parking bays',
      message
    );

  } catch (error) {
    console.error('[BLE] Scan failed:', error);

    Alert.alert(
      'Bluetooth scan failed',
      'Something went wrong while looking for nearby parking bays.'
    );
  } finally {
    setScanning(false);
  }
}}
>
  <Feather name="map-pin" size={18} color="#FFFFFF" />

  <View style={styles.parkingButtonText}>
   <Text style={styles.parkingButtonTitle}>
  {scanning ? 'Finding your parking bay...' : 'Where did you park?'}
</Text>

    <Text style={styles.parkingButtonSubtitle}>
      Find your nearby parking bay
    </Text>
  </View>

  <Feather name="chevron-right" size={20} color="#FFFFFF" />
</TouchableOpacity>
        {/* Search Bar Container */}
        <View style={styles.search}>
          <SearchBar />
        </View>
       

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F7FAFB", // Neutral background contrast for page
  },

  container: {
    backgroundColor:     "#13384Bff", 
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 20,
    marginBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 28,

    // Soft elevation shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB", 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
    marginRight: 6,
  },

  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  liveText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#22C55E",
    letterSpacing: 0.8,
  },

  heading: {
    fontSize: 26,
    fontWeight: "800", // Strong heavy title weight
    color: "#b11010",
    letterSpacing: -0.5,
    alignItems:'center',
    marginLeft:100,
  },

  subtitle: {
      marginLeft:90,
    fontSize: 12,
    fontWeight: "500",
    color: "#9cafa7",
    marginTop: 4,
    marginBottom: 16,
  },

  search: {
    marginTop: 6,
     marginBottom: -20,
  },


  rightButtons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

avatarButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#E8EEF1",
  justifyContent: "center",
  alignItems: "center",
},

avatarText: {
  fontSize: 13,
  fontWeight: "700",
  color: "#13384B",
},

 headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#146564',
    marginBottom: 16,
      marginTop: 1,
      marginLeft:135,
  },
  parkingButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#146564",
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 14,
  marginTop: 8,
  marginBottom: 12,
},

parkingButtonText: {
  flex: 1,
  marginLeft: 12,
},

parkingButtonTitle: {
  fontSize: 15,
  fontWeight: "700",
  color: "#FFFFFF",
},

parkingButtonSubtitle: {
  fontSize: 11,
  color: "#D9EEEE",
  marginTop: 3,
},
});
/**
 * References
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */