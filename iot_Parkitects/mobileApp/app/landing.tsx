import React from 'react';
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


const elements = [
  {
    image: require('@/assets/images/car-1.png'),
    position: [0, 0],
    size: [90, 90],
  },

  {
    image: require('@/assets/images/car-1.png'),
    position: [-120, -120],
    size: [60, 60],
  },

  {
    image: require('@/assets/images/car-1.png'),
    position: [120, 120],
    size: [60, 60],
  },

  {
    icon: 'map-pin',
    position: [-120, 120],
    size: [60, 60],
  },

  {
    icon: 'navigation',
    position: [120, -120],
    size: [60, 60],
  },
];

// ----------------------------------------------------
// PARKING DIAGRAM
// ----------------------------------------------------

function ParkingDiagram() {
  return (
    <View
      style={{
        width: DIAGRAM_SIZE,
        height: DIAGRAM_SIZE,
        position: 'relative',
      }}
    >

      {/* -------------------------------------------- */}
      {/* DASHED CIRCULAR RINGS */}
      {/* -------------------------------------------- */}

      <Svg
        width={DIAGRAM_SIZE}
        height={DIAGRAM_SIZE}
        style={StyleSheet.absoluteFill}
      >

        {/* Outer dashed circle */}
        <Circle
          cx={DIAGRAM_SIZE / 2}
          cy={DIAGRAM_SIZE / 2}
          r={DIAGRAM_SIZE / 2 - 12}
          stroke="#3f4a51"
          strokeWidth={3}
          strokeDasharray="16 16"
          fill="none"
        />

        {/* Inner dashed circle */}
        <Circle
          cx={DIAGRAM_SIZE / 2}
          cy={DIAGRAM_SIZE / 2}
          r={DIAGRAM_SIZE / 2 - 72}
          stroke="#3f4a51"
          strokeWidth={3}
          strokeDasharray="16 16"
          fill="none"
        />

      </Svg>


      {/* -------------------------------------------- */}
      {/* CIRCULAR CARS + ICONS */}
      {/* -------------------------------------------- */}

      {elements.map(
        (
          {
            position: [x, y],
            size: [elementWidth, elementHeight],
            image,
            icon,
          },
          index
        ) => {
          return (
            <View
              key={index}
              style={[
                styles.element,
                {
                  width: elementWidth,
                  height: elementHeight,

                  top:
                    DIAGRAM_SIZE / 2 -
                    elementHeight / 2 +
                    y,

                  left:
                    DIAGRAM_SIZE / 2 -
                    elementWidth / 2 +
                    x,
                },
              ]}
            >

              {/* Car image */}
             {image ? (
     <Image
    style={styles.elementImage}
    source={image}
    resizeMode="contain"
  />
) : (

                /* Icon */
                <FeatherIcon
                  name={icon as any}
                  size={28}
                  color="#4C164C"
                />

              )}

            </View>
          );
        }
      )}

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
            Find Your Parking
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

            {/* LOG IN */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/auth/sign_in')}
            >
              <View style={styles.btnSecondary}>
                <Text style={styles.btnSecondaryText}>
                  Log In
                </Text>
              </View>
            </TouchableOpacity>


            {/* SIGN UP */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/auth/sign_up')}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>

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
    marginTop: 12,
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

});