import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Example() {
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <TouchableOpacity
        onPress={() => {
          // handle onPress
        }}
        style={styles.headerBack}>
        <FeatherIcon color="#1d1d1d" name="arrow-left" size={24} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>

        <Text style={styles.headerSubtitle}>
          Manage your personal and login information here.
        </Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Username</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>ST1026609</Text>
              </View>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Name</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>John Doe</Text>

                <FeatherIcon
                  color="#C6C6C6"
                  name="chevron-right"
                  size={20} />
              </TouchableOpacity>
            </View>

          

          
           
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Information</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Email</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>john@example.com</Text>

                <FeatherIcon
                  color="#C6C6C6"
                  name="chevron-right"
                  size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={styles.rowLabel}>Update password</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon
                  color="#C6C6C6"
                  name="chevron-right"
                  size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        
         
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 15,
      marginTop: 6,
  },
  headerBack: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    marginTop: 6,
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B8B8B',
    marginRight: 4,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowValueSuccess: {
    fontWeight: '600',
    color: '#35C759',
    marginRight: 8,
  },
  rowValueWarning: {
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
});