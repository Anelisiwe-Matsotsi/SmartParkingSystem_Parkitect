import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/theme';

type TextSize = 'small' | 'medium' | 'large';
type ColorMode = 'light' | 'dark';

const scaleMap: Record<TextSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.25,
};

interface AccessibilityState {
  textSize: TextSize;
  colorMode: ColorMode;
  reduceMotion: boolean;
  screenReader: boolean;
  hapticFeedback: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  scale: number;
  theme: typeof Colors.light;
  osReduceMotionEnabled: boolean;
  osScreenReaderEnabled: boolean;
  setTextSize: (v: TextSize) => void;
  setColorMode: (v: ColorMode) => void;
  setReduceMotion: (v: boolean) => void;
  setScreenReader: (v: boolean) => void;
  setHapticFeedback: (v: boolean) => void;
  loadFromServer: (settings: Partial<AccessibilityState>) => void;
  triggerHaptic: (style?: Haptics.ImpactFeedbackStyle) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [colorMode, setColorMode] = useState<ColorMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // OS-level state — read-only, can't be toggled by the app, only detected
  const [osReduceMotionEnabled, setOsReduceMotionEnabled] = useState(false);
  const [osScreenReaderEnabled, setOsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setOsReduceMotionEnabled);
    AccessibilityInfo.isScreenReaderEnabled().then(setOsScreenReaderEnabled);

    const reduceMotionSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setOsReduceMotionEnabled
    );
    const screenReaderSub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setOsScreenReaderEnabled
    );

    return () => {
      reduceMotionSub.remove();
      screenReaderSub.remove();
    };
  }, []);

  const loadFromServer = useCallback((settings: Partial<AccessibilityState>) => {
    if (settings.textSize) setTextSize(settings.textSize);
    if (settings.colorMode) setColorMode(settings.colorMode);
    if (settings.reduceMotion !== undefined) setReduceMotion(settings.reduceMotion);
    if (settings.screenReader !== undefined) setScreenReader(settings.screenReader);
    if (settings.hapticFeedback !== undefined) setHapticFeedback(settings.hapticFeedback);
  }, []);

  const triggerHaptic = useCallback(
    (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
      if (hapticFeedback) {
        Haptics.impactAsync(style);
      }
    },
    [hapticFeedback]
  );

  const scale = scaleMap[textSize];
  const theme = Colors[colorMode];

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        colorMode,
        reduceMotion,
        screenReader,
        hapticFeedback,
        scale,
        theme,
        osReduceMotionEnabled,
        osScreenReaderEnabled,
        setTextSize,
        setColorMode,
        setReduceMotion,
        setScreenReader,
        setHapticFeedback,
        loadFromServer,
        triggerHaptic,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const message = useContext(AccessibilityContext);
  if (!message) {
    throw new Error('accessibility Error');
  }
  return message;
}