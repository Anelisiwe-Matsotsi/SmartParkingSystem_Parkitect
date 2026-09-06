import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import FeatherIcon from '@expo/vector-icons/Feather';

interface RuleItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const RULES: RuleItem[] = [
  {
    id: '1',
    icon: 'map-pin',
    title: 'Designated Bays Only',
    description: 'Vehicles must be parked only in designated and clearly marked parking bays.',
  },
  {
    id: '2',
    icon: 'activity',
    title: 'Speed Limit',
    description: 'Vehicles to drive 20km/h in the parking lot',
  },
  {
    id: '3',
    icon: 'alert-triangle',
    title: 'Restricted Bays',
    description: 'Do not park in staff, pick and drop, or disability bays without valid reasoning.',
  },
  {
    id: '4',
    icon: 'clock',
    title: 'Time Limits',
    description: 'Do not park in the pick and drop zone for more than 10 minutes',
  },
  {
    id: '5',
    icon: 'shield',
    title: 'Report Disputes',
    description: 'Any parking issues should be reported to campus security or log a ticket in the app',
  },
  {
    id: '6',
    icon: 'compass',
    title: 'Follow Road Signs',
    description: 'Do not drive in the opposite direction of the road sign arrows.',
  },
  {
    id: '7',
    icon: 'volume-x',
    title: 'Noise Levels',
    description: 'Do not make noise with car speakers in the parking lot.',
  },
  {
    id: '8',
    icon: 'lightbulb-off',
    title: 'Head Lights',
    description: 'Make sure that your vehicle lights are turned off.',
  },
];

export default function RulesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FeatherIcon name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.screenTitle}>Parking Lot Rules</Text>

        {RULES.map((item) => (
          <View key={item.id} style={styles.ruleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.iconBadge}>
                  <FeatherIcon name={item.icon} size={16} color="#0D5265" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              {item.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    marginTop: 23,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 20,
  },

  /* Rule Cards */
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E8F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    paddingLeft: 38,
  },
});

/**
 * References
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */