//(Withfra.me, 2022)
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useAccessibility } from '@/context/accessibilityContext';

// importing our custom auth setup
import { auth } from '../../config/firebaseConfig'
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

//THE API BASE URL- TO BE CHANGED (same as tickets one-natasha)
const API_BASE_URL = 'http://92.168.0.183:8080';

// export default function Example() {
//    const router = useRouter();
//   const [form, setForm] = useState({
//     customReminders: true,
//     motivationalMessages: true,
//     progressUpdates: true,
//     notifications: false,
//     microphone: false,
//   });

const textSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

export default function Example() {
    const router = useRouter();
    const {
    textSize, setTextSize,
    colorMode, setColorMode,
    reduceMotion, setReduceMotion,
    screenReader, setScreenReader,
    hapticFeedback, setHapticFeedback,
    theme,
    loadFromServer,
    triggerHaptic,
  } = useAccessibility();

    //(Spencer, 2024)
    useEffect(() => {
        const userAccessibility = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/Settings/user/${currentUser.uid}`);
                if (response.ok) {
                    loadFromServer(await response.json());
                }
            } catch (error) {
                Alert.alert('Error','Failed to load accessibility settings');
            }
        };

        userAccessibility();
    }, []);

    const saveAccessibility = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const existingRes = await fetch(`${API_BASE_URL}/api/Settings/user/${currentUser.uid}`);
            const existing = existingRes.ok ? await existingRes.json() : {};

            await fetch(`${API_BASE_URL}/api/Settings/user/${currentUser.uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...existing, textSize, colorMode, reduceMotion, screenReader, hapticFeedback, userID: currentUser.uid }),
            });
            triggerHaptic();
        } catch (error) {
            Alert.alert('Please try again','Error occured while saving accessibility settings');
        }
    };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
            <FeatherIcon color="#e2f1f3" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: theme.heading }]}>Accessibility</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Adjust how Parkitech looks and feels for you
        </Text>
      </View>

      <ScrollView>
        {/* TEXT SIZE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Text Size</Text>
          <View style={styles.segmentRow}>
            {textSizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => {
                  setTextSize(size);
                  triggerHaptic();
                }}
                style={[
                  styles.segmentBtn,
                  { borderColor: theme.muted },
                  textSize === size && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: textSize === size ? '#fff' : theme.text },
                  ]}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DISPLAY */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Display</Text>

          <View style={[styles.sectionItem, { backgroundColor: theme.surface, borderColor: theme.muted }]}>
            <View style={styles.sectionInfo}>
              <Text style={[styles.sectionName, { color: theme.heading }]}>Dark Mode</Text>
              <Text style={[styles.sectionDescription, { color: theme.muted }]}>
                Switch between light and dark color scheme
              </Text>
            </View>
            <Switch
              onValueChange={(isDark) => {
                setColorMode(isDark ? 'dark' : 'light');
                triggerHaptic();
              }}
              trackColor={{ false: '#757575', true: theme.primary }}
              value={colorMode === 'dark'}
            />
          </View>

          <View style={[styles.sectionItem, { backgroundColor: theme.surface, borderColor: theme.muted }]}>
            <View style={styles.sectionInfo}>
              <Text style={[styles.sectionName, { color: theme.heading }]}>Reduce Motion</Text>
              <Text style={[styles.sectionDescription, { color: theme.muted }]}>
                Minimize animations throughout the app
              </Text>
            </View>
            <Switch
              onValueChange={(v) => {
                setReduceMotion(v);
                triggerHaptic();
              }}
              trackColor={{ false: '#757575', true: theme.primary }}
              value={reduceMotion}
            />
          </View>
        </View>

        {/* ASSISTANCE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Assistance</Text>

          <View style={[styles.sectionItem, { backgroundColor: theme.surface, borderColor: theme.muted }]}>
            <View style={styles.sectionInfo}>
              <Text style={[styles.sectionName, { color: theme.heading }]}>Screen Reader Support</Text>
              <Text style={[styles.sectionDescription, { color: theme.muted }]}>
                Optimize labels and layout for screen readers
              </Text>
            </View>
            <Switch
              onValueChange={(v) => {
                setScreenReader(v);
                triggerHaptic();
              }}
              trackColor={{ false: '#757575', true: theme.primary }}
              value={screenReader}
            />
          </View>

          <View style={[styles.sectionItem, { backgroundColor: theme.surface, borderColor: theme.muted }]}>
            <View style={styles.sectionInfo}>
              <Text style={[styles.sectionName, { color: theme.heading }]}>Haptic Feedback</Text>
              <Text style={[styles.sectionDescription, { color: theme.muted }]}>
                Feel a light tap when interacting with buttons
              </Text>
            </View>
            <Switch
              onValueChange={(v) => setHapticFeedback(v)}
              trackColor={{ false: '#757575', true: theme.primary }}
              value={hapticFeedback}
            />
          </View>

          <Text style={[styles.sectionFooter, { color: theme.muted }]}>
            You can always change these settings later.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.formFooter}>
        <TouchableOpacity onPress={saveAccessibility}>
          <View style={[styles.btn, { backgroundColor: theme.primary }]}>
            <Text style={styles.btnText}>Save Preferences</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 34, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 15, lineHeight: 20, fontWeight: '500' },
  formFooter: { marginTop: 12, marginBottom: 24, paddingHorizontal: 24 },
  header: { paddingHorizontal: 24, marginBottom: 28, marginTop: 28 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerAction: {
    width: 40, height: 40, borderRadius: 9999,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#146564', marginBottom: 16, marginTop: 16,
  },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: 0.19,
  },
  sectionItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 2,
  },
  sectionInfo: { flexGrow: 1, flexShrink: 1, flexBasis: 0, marginRight: 16 },
  sectionName: { fontSize: 15, lineHeight: 20, fontWeight: '600', marginBottom: 4 },
  sectionDescription: { fontSize: 13, lineHeight: 18 },
  sectionFooter: { fontSize: 13, lineHeight: 18, marginTop: 4 },
  segmentRow: { flexDirection: 'row', gap: 10 },
  segmentBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, paddingVertical: 16, paddingHorizontal: 24, marginBottom: 24,
  },
  btnText: { fontSize: 17, lineHeight: 22, fontWeight: 'bold', color: '#fff' },
});

/**
 * References
 * Spencer,P., 2024. The Full stack (React & ASP.NET)- 12 - UseEffect.[video online] Available at: < https://youtu.be/tJxBtmg-92w?si=NYNfh-oL9nZO0EFb > [Accessed 30 August 2026]
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */