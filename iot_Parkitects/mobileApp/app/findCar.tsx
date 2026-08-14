import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import FeatherIcon from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const DIAGRAM_SIZE = width - 48;



// ----------------------------------------------------
// PARKING DIAGRAM
// ----------------------------------------------------

function ParkingDiagram() {
  const progress = 65;

  return (
    <View style={styles.progressContainer}>
      <AnimatedCircularProgress
        size={DIAGRAM_SIZE}
        width={18}
        fill={progress}
        tintColor="#8BEF00"
        backgroundColor="#3f4a51"
        rotation={90}
        lineCap="round"
        duration={1000}
      >
        {() => (
          <View style={styles.progressContent}>
            <Text style={styles.distanceText}>50</Text>

            <Text style={styles.feetText}>meters</Text>

            <Text style={styles.accuracyText}>
              Distance ±30 meters
            </Text>

            <FeatherIcon
              name="navigation"
              size={42}
              color="#D9E1E8"
              style={styles.navigationIcon}
            />
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
}


// ----------------------------------------------------
// MAIN SCREEN
// ----------------------------------------------------

export default function LandingScreen() {
  return (
    <LinearGradient
      colors={['#d9dff3', '#FFFFFF']}
      style={styles.gradient}
    >

      <SafeAreaView style={styles.safeArea}>

        <View style={styles.container}>

          {/* ---------------------------------------- */}
          {/* HEADING */}
          {/* ---------------------------------------- */}

          <Text style={styles.title}>
            Find Your Car
          </Text>


          {/* ---------------------------------------- */}
          {/* SUBTITLE */}
          {/* ---------------------------------------- */}

          <Text style={styles.subtitle}>
            Find available parking, know what's
            {'\n'}
            happening, and never arrive late.
          </Text>


          {/* ---------------------------------------- */}
          {/* PARKING DIAGRAM */}
          {/* ---------------------------------------- */}

          <View style={styles.diagram}>
            <ParkingDiagram />
          </View>


          {/* ---------------------------------------- */}
          {/* BUTTONS */}
          {/* ---------------------------------------- */}

          <View style={styles.diagramFooter}>

       


           

          </View>

        </View>

      </SafeAreaView>

    </LinearGradient>
  );
}


// ----------------------------------------------------
// STYLES
// ----------------------------------------------------

const styles = StyleSheet.create({

  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    padding: 24,
  },


  // ----------------------------------------------
  // TITLE
  // ----------------------------------------------

  title: {
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '700',
    color: '#2A2A39',
    marginBottom: 12,
    marginTop: 28,
    paddingRight: 24,
  },


  // ----------------------------------------------
  // SUBTITLE
  // ----------------------------------------------

  subtitle: {
    fontSize: 17,
    lineHeight: 22,
    color: '#434247',
  },


  // ----------------------------------------------
  // CIRCULAR ELEMENTS
  // ----------------------------------------------

  element: {
    position: 'absolute',

    borderRadius: 9999,

    borderWidth: 3,
    borderColor: '#2e5b36',

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 9,
  },


  elementImage: {
    width: '85%',
    height: '85%',
  },


 
  // DIAGRAM

  diagram: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,

    justifyContent: 'center',
    alignItems: 'center',
  },



  // BUTTON AREA

  diagramFooter: {
    paddingVertical: 12,
  },


  // ----------------------------------------------
  // SIGN UP BUTTON
  // ----------------------------------------------

  btn: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 20,

    borderWidth: 1,

    backgroundColor: '#16414c',
    borderColor: '#4C164C',
  },


  btnText: {
    fontSize: 18,
    lineHeight: 26,

    fontWeight: '600',

    color: '#FFFFFF',

    letterSpacing: 0.133,
  },


  // ----------------------------------------------
  // LOG IN BUTTON
  // ----------------------------------------------

  btnSecondary: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 8,

    paddingVertical: 10,
    paddingHorizontal: 20,

    borderWidth: 2,

    backgroundColor: 'transparent',

    borderColor: '#4C164C',

    marginBottom: 12,
  },


  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,

    fontWeight: '600',

    color: '#2a4c16',
  },

  progressContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},

progressContent: {
  alignItems: 'center',
  justifyContent: 'center',
},

distanceText: {
  fontSize: 58,
  fontWeight: '700',
  color: '#2A2A39',
  lineHeight: 64,
},

feetText: {
  fontSize: 22,
  fontWeight: '500',
  color: '#5F6168',
  marginTop: -4,
},

accuracyText: {
  fontSize: 15,
  color: '#4C72C9',
  marginTop: 10,
},

navigationIcon: {
  marginTop: 20,
  transform: [{ rotate: '45deg' }],
},

});