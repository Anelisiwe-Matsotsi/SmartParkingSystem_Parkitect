/**
 * Everything the app needs from Bluetooth Low Energy, in one place:
 *  1. A single, lazily created BleManager
 *  2. Permission checks (silent) and permission requests (shows the system dialog)
 *  3. Bluetooth on/off state
 *  4. A short "scan and average" that returns the nearest parking beacons
 *
 * Requires: npx expo install react-native-ble-plx   (dev build only, not Expo Go)
 */
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';

// The ESP32 advertises as PARK_BEACON_NODE_1, PARK_BEACON_NODE_2, ...
const BEACON_PREFIX = 'Parkitects Beacon';

// Ignore beacons weaker than this (very far away). Tune it while testing in the lot.
const MIN_RSSI = -90;

/* 1. Manager                                                                  */

// Created on first use, not at import time. On iOS, creating a BleManager is
// what triggers the Bluetooth permission prompt, so we don't want it to fire
// just because some file imported this module.
let manager: BleManager | null = null;

export function getBleManager(): BleManager {
  if (!manager) manager = new BleManager();
  return manager;
}


/* 2. Permissions                                                              */

// Android 12+ (API 31+) uses BLUETOOTH_SCAN + BLUETOOTH_CONNECT. We also ask for
// precise location, because we use beacon proximity to work out where someone
// parked (so the "neverForLocation" flag is NOT set). Android 11 and below need
// location for BLE scanning anyway.
//
// They are asked in groups, in this order:
//   1. "Nearby devices" (BLUETOOTH_SCAN + BLUETOOTH_CONNECT), Android 12+ only
//   2. Location
const androidPermissionGroups = () => {
  const P = PermissionsAndroid.PERMISSIONS;
  return Number(Platform.Version) >= 31
    ? [[P.BLUETOOTH_SCAN, P.BLUETOOTH_CONNECT], [P.ACCESS_FINE_LOCATION]]
    : [[P.ACCESS_FINE_LOCATION]];
};

const androidPermissions = () => androidPermissionGroups().flat();

/**
 * Silent check: never shows a dialog. Use it to decide what the UI should show.
 * iOS has no separate runtime check here; the Bluetooth *state* tells us
 * whether it's authorised (see isBluetoothOn).
 */
export async function hasBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const checks = await Promise.all(
    androidPermissions().map(permission => PermissionsAndroid.check(permission))
  );
  return checks.every(Boolean);
}

export type PermissionResult = 'granted' | 'denied' | 'blocked';

/**
 * Shows the system dialog when needed.
 *  - 'granted' : good to go
 *  - 'denied'  : user said no this time, we can ask again later
 *  - 'blocked' : user chose "don't ask again", the only way forward is system settings
 */
export async function requestBlePermissions(): Promise<PermissionResult> {
  if (Platform.OS !== 'android') return 'granted'; // iOS asks when the manager is first used

  for (const group of androidPermissionGroups()) {
    const results = await PermissionsAndroid.requestMultiple(group);

    // Temporary: shows in the Metro terminal which permission the system answered, and how.
    console.log('[BLE] Android', Platform.Version, 'permission results:', results);

    const values = Object.values(results);
    if (values.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) return 'blocked';
    if (!values.every(v => v === PermissionsAndroid.RESULTS.GRANTED)) return 'denied';
  }
  return 'granted';
}


/* 3. Bluetooth state                                                          */

export async function isBluetoothOn(): Promise<boolean> {
  return (await getBleManager().state()) === State.PoweredOn;
}

/**
 * Android can ask the system to switch Bluetooth on (shows a small dialog).
 * iOS cannot, so this returns false there and the caller should open Settings.
 */
export async function tryEnableBluetooth(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    await getBleManager().enable();
    return true;
  } catch {
    return false;
  }
}

/* 4. Scanning for parking beacons                                             */

export type NearbyNode = {
  name: string;    // "PARK_BEACON_NODE_1"  (what the ESP32 advertises)
  nodeKey: string; // "Node_01"             (the key used in Firebase)
  label: string;   // "Node 1"              (what we show the user)
  rssi: number;    // averaged signal strength in dBm, closer to 0 = closer
};

// "PARK_BEACON_NODE_1" -> "Node_01"
export const toFirebaseNodeKey = (name: string) =>
  `Node_${name.split('_').pop()!.padStart(2, '0')}`;

// "PARK_BEACON_NODE_1" -> "Node 1"
export const toNodeLabel = (name: string) => `Node ${name.split('_').pop()}`;

export function stopScan() {
  getBleManager().stopDeviceScan();
}

/**
 * Scans for `durationMs`, collects every RSSI reading per beacon, averages them,
 * and returns the beacons sorted strongest (closest) first.
 * Call stopScan() if the screen closes early.
 */
export function scanNearbyNodes(durationMs = 4000): Promise<NearbyNode[]> {
  const readings = new Map<string, number[]>();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      stopScan();
      const nodes = [...readings.entries()]
        .map(([name, values]) => ({
          name,
          nodeKey: toFirebaseNodeKey(name),
          label: toNodeLabel(name),
          rssi: values.reduce((sum, v) => sum + v, 0) / values.length,
        }))
        .filter(node => node.rssi >= MIN_RSSI)
        .sort((a, b) => b.rssi - a.rssi);
      resolve(nodes);
    }, durationMs);

    // allowDuplicates matters on iOS; Android reports repeat adverts by default.
    getBleManager().startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
      if (error) {
        clearTimeout(timer);
        stopScan();
        reject(error);
        return;
      }

      const name = device?.localName ?? device?.name;
      if (!name || !name.startsWith(BEACON_PREFIX) || device?.rssi == null) return;

      const list = readings.get(name);
      if (list) list.push(device.rssi);
      else readings.set(name, [device.rssi]);
    });
  });
}
//https://dev.to/harmonyos/estimating-distance-to-ble-beacons-using-rssi-and-txpower-in-harmonyos-2nic
//https://dotintent.github.io/react-native-ble-plx/