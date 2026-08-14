import React from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

const items = [
  {
    label: 'ALERT',
    users: 250,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'Daily Parking Rule',
    users: 827,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'Complaint',
    users: 72,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'ALERT',
    users: 24,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'Complaint',
    users: 9,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'ALERT',
    users: 239,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
];

export default function Example() {
     const router = useRouter();
  const [value, setValue] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.container}>
      
 <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
                router.push('/findCar');
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
          
        </View>
          <Text style={styles.title}>Notifications</Text>
        {items.map(({ label, users, description }, index) => {
          const isActive = value === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setValue(index);
              }}>
              <View style={[styles.radio, isActive && styles.radioActive]}>
                <View style={styles.radioTop}>
                  <Text style={styles.radioLabel}>#{label}</Text>

                  <Text style={styles.radioUsers}>
                    <Text style={{ fontWeight: '700' }}>{users}</Text> bays
                  </Text>
                </View>

                <Text style={styles.radioDescription}>{description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
    marginTop: 30,
  },
  /** Radio */
  radio: {
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 40,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    width: 350,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: '#d1d4d7',
  },
  radioTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  radioUsers: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#848a96',
  },

   headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 60,
  },
});