import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

const INPUT_OFFSET = 160;

export default function Example() {
    const router = useRouter();
  const [form, setForm] = useState({
    location: false,
    photos: false,
    notifications: false,
  });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Allow access
        </Text>

        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="more-vertical"
              size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView>
        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>
            To continue using the app, you have to allow access to your location
            and Blutooth.
          </Text>
        </View>

        <View style={styles.formToggle}>
          <View style={styles.formLabel}>
            <Text style={styles.formLabelText}>Blutooth</Text>

            <Text style={styles.formLabelSubtext}>Required to use the app</Text>
          </View>

          <Switch
            onValueChange={photos => setForm({ ...form, photos })}
            trackColor={{ true: '#4C164C' }}
            value={form.photos} />
        </View>

        <View style={styles.formToggle}>
          <View style={styles.formLabel}>
            <Text style={styles.formLabelText}>Location</Text>

            <Text style={styles.formLabelSubtext}>(Optional)</Text>
          </View>

          <Switch
            onValueChange={location => setForm({ ...form, location })}
            trackColor={{ true: '#4C164C' }}
            value={form.location} />
        </View>


        <View style={styles.formAction}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
              router.push('/(tabs)');
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.formFooter}>
          You can adjust these permissions later.
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
    marginTop:32,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  formHeader: {
    backgroundColor: '#E8E8E8',
    padding: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CFCFCF',
  },
  formHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#54565f',
  },
  formToggle: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  formLabel: {
    width: INPUT_OFFSET,
    justifyContent: 'center',
  },
  formLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#54565f',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  formLabelSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  formAction: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  formFooter: {
    paddingHorizontal: 16,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#44465a',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#163c4c',
    borderColor: '#4C164C',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.133,
  },
});