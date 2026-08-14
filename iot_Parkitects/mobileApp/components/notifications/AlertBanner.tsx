import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

type AlertBannerProps = {
  title: string;
  message: string;
  icon?: keyof typeof FeatherIcon.glyphMap;
  iconColor?: string;
  onDismiss: () => void;
};

export default function AlertBanner({
  title,
  message,
  icon = 'bell',
  iconColor = '#0B5D6B',
  onDismiss,
}: AlertBannerProps) {
  return (
    <View style={styles.alert}>

      {/* ICON */}
      <View
        style={[
          styles.alertIcon,
          {
            backgroundColor: iconColor,
            borderColor: iconColor,
          },
        ]}
      >
        <FeatherIcon
          color="#fff"
          name={icon}
          size={30}
        />
      </View>

      {/* TEXT */}
      <View style={styles.alertBody}>
        <Text style={styles.alertTitle}>
          {title}
        </Text>

        <Text style={styles.alertMessage}>
          {message}
        </Text>
      </View>

      {/* CLOSE BUTTON */}
      <TouchableOpacity onPress={onDismiss}>
        <View style={styles.alertClose}>
          <FeatherIcon
            color="#9a9a9a"
            name="x"
            size={24}
          />
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
alert: {
  position: 'absolute',

  top: 10,
  left: 16,
  right: 16,

  flexDirection: 'row',

  backgroundColor: '#FFFFFF',

  borderRadius: 14,

  borderWidth: 1,
  borderColor: '#D1D5DB',

  overflow: 'hidden',

  zIndex: 999,

  elevation: 10,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
},

alertIcon: {
  width: 70,

  backgroundColor: '#116B73',

  alignItems: 'center',
  justifyContent: 'center',
},

alertBody: {
  flex: 1,
  padding: 14,
  paddingRight: 35,
},

alertTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: '#1F2937',
  marginBottom: 4,
},

alertMessage: {
  fontSize: 14,
  lineHeight: 20,
  color: '#9CA3AF',
},

alertClose: {
  position: 'absolute',
  top: 10,
  right: 10,

  padding: 4,
},
});
/**
 * References
 * https://withfra.me/components/alert/alert-top-banner-with-dismiss-button
 */