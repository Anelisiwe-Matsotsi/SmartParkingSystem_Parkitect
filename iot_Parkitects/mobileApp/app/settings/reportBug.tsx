import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import FeatherIcon from '@expo/vector-icons/Feather';
import { ThemedText } from '@/components/themed-text';
import { useAccessibility } from '@/context/accessibilityContext';

export default function ReportBugScreen() {
  const router = useRouter();
  const { theme, triggerHaptic, triggerScreenReader } = useAccessibility();

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Login / Account',
    'Parking',
    'Location',
    'Notifications',
    'App Error',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!category) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      triggerScreenReader('Please select a bug category');
      Alert.alert('Missing Category', 'Please select a bug category.');
      return;
    }

    if (!description.trim()) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      triggerScreenReader('Please describe the problem you experienced');
      Alert.alert('Missing Description', 'Please describe the problem you experienced.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend connection will be added here.
      // For now, the report is validated and submitted locally.

      triggerHaptic();

      triggerScreenReader('Bug report submitted');

      Alert.alert(
        'Bug Report Submitted',
        'Thank you for helping us improve Parkitech.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );

      setCategory('');
      setDescription('');
    } catch (error) {
      console.error('Bug report error:', error);

      Alert.alert(
        'Error',
        'Unable to submit your bug report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <FeatherIcon
            color={theme.heading}
            name="arrow-left"
            size={22}
          />
        </TouchableOpacity>

        <ThemedText numberOfLines={1} style={[styles.headerTitle, { color: theme.heading }]}>
          Report a Bug
        </ThemedText>

        <View style={styles.headerAction} />
      </View>

      <ScrollView removeClippedSubviews={false}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.intro}>
          Help us improve Parkitech by telling us about a problem you
          experienced while using the app.
        </ThemedText>

        {/* BUG DETAILS */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            BUG DETAILS
          </ThemedText>

          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>

            {/* CATEGORY */}
            <View style={styles.inputSection}>
              <ThemedText style={[styles.inputLabel, { color: theme.heading }]}>
                Bug Category
              </ThemedText>

              <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setShowCategories(!showCategories)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    styles.dropdownText,
                    { color: theme.heading },
                    !category && styles.placeholderText,
                  ]}
                >
                  {category || 'Select a category'}
                </ThemedText>

                <FeatherIcon
                  color="#64748B"
                  name={showCategories ? 'chevron-up' : 'chevron-down'}
                  size={18}
                />
              </TouchableOpacity>

              {showCategories && (
                <View style={[styles.dropdownOptions, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.dropdownOption, { borderBottomColor: theme.border }]}
                      onPress={() => {
                        setCategory(item);
                        setShowCategories(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <ThemedText style={[styles.dropdownOptionText, { color: theme.heading }]}>
                        {item}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputSection}>
              <ThemedText style={[styles.inputLabel, { color: theme.heading }]}>
                What went wrong?
              </ThemedText>

              <TextInput
                multiline
                numberOfLines={6}
                value={description}
                onChangeText={setDescription}
                placeholder="Please describe the problem you experienced..."
                placeholderTextColor={theme.muted}
                textAlignVertical="top"
                style={[styles.descriptionInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              />
            </View>

            {/* SUBMIT */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
              </ThemedText>
            </TouchableOpacity>

          </View>
        </View>

        {/* INFORMATION */}
        <View style={styles.infoBox}>
          <FeatherIcon
            color="#0D5265"
            name="info"
            size={20}
          />

          <ThemedText style={styles.infoText}>
            Please provide as much detail as possible. This helps us
            understand and resolve the problem more quickly.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 50,
  },

  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  intro: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginBottom: 8,
  },

  section: {
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },

  inputSection: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },

  dropdown: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  dropdownText: {
    fontSize: 15,
    color: '#0F172A',
  },

  placeholderText: {
    color: '#94A3B8',
  },

  dropdownOptions: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  dropdownOptionText: {
    fontSize: 15,
    color: '#0F172A',
  },

  descriptionInput: {
    minHeight: 130,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 15,
    color: '#0F172A',
  },

  submitButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0D5265',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    gap: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#0D5265',
  },
});