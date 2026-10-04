import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { AccessibilityInfo, InteractionManager, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/theme';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

//(Cusick, 2025)
//declaring the types of color and size options the user has
type TextSize = 'small' | 'medium' | 'large';
type ColorMode = 'light' | 'dark';

//(Mimo, 2026)
//text views are giving size already
const scaleMap: Record<TextSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.25,
};

//(Schult, 2022)
//interface decalres all the accessibility options they will have to be saved to the DB
interface AccessibilityState {
  textSize: TextSize;
  colorMode: ColorMode;
  reduceMotion: boolean;
  screenReader: boolean;
  hapticFeedback: boolean;
}

//(Schult, 2022)
interface AccessibilityContextValue extends AccessibilityState {
  scale: number;
  theme: typeof Colors.light;
  osReduceMotionEnabled: boolean;
  osScreenReaderEnabled: boolean;
  shouldReduceMotion: boolean;
  setTextSize: (v: TextSize) => void;
  setColorMode: (v: ColorMode) => void;
  setReduceMotion: (v: boolean) => void;
  setScreenReader: (v: boolean) => void;
  setHapticFeedback: (v: boolean) => void;
  loadFromServer: (settings: Partial<AccessibilityState> & { theme?: string }) => void;
  triggerScreenReader: (text: string) => void;
  triggerHaptic: (style?: Haptics.ImpactFeedbackStyle) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);
//(Senturk, 2026)
//pass elements as children, making the components acts as a wrapper
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  //(React Native, 2026)
  //AccessibilityInfo API is used to make the motion and screen reader work
  //we query the current state of the screen to be notified when it changes
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [colorMode, setColorMode] = useState<ColorMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // OS-level state — read-only, can't be toggled by the app, only detected
  const [osReduceMotionEnabled, setOsReduceMotionEnabled] = useState(false);
  const [osScreenReaderEnabled, setOsScreenReaderEnabled] = useState(false);

  //(React Native, 2026)
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setOsReduceMotionEnabled);
    AccessibilityInfo.isScreenReaderEnabled().then(setOsScreenReaderEnabled);

    //activates when enabled by user
    const reduceMotionSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setOsReduceMotionEnabled
    );

    //screen reading starts when enabled by user
    const screenReaderSub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setOsScreenReaderEnabled
    );

    //(React Native, 2026)
    return () => {
      reduceMotionSub.remove();
      screenReaderSub.remove();
    };
  }, []);

  //(Patel, 2025)
  //calls the loadfromserver to load the settings that have been chosen by the user and saved otherwise default settings are left the same
  const loadFromServer = useCallback((settings: Partial<AccessibilityState> & { theme?: string }) => {
    if (settings.textSize && ['small', 'medium', 'large'].includes(settings.textSize)) {
      setTextSize(settings.textSize);
    }
    const savedMode = settings.theme ?? settings.colorMode;
    if (savedMode === 'light' || savedMode === 'dark') setColorMode(savedMode);
    //(Balasubramanian, 2023)
    if (settings.reduceMotion !== undefined) setReduceMotion(settings.reduceMotion);
    if (settings.screenReader !== undefined) setScreenReader(settings.screenReader);
    if (settings.hapticFeedback !== undefined) setHapticFeedback(settings.hapticFeedback);
  }, []);

  // Back to defaults (used when nobody is signed in, so one user's theme never leaks to the next)
  const systemSchemeRef = useRef(systemScheme);
  systemSchemeRef.current = systemScheme;

  const resetToDefaults = useCallback(() => {
    setTextSize('medium');
    setColorMode(systemSchemeRef.current === 'dark' ? 'dark' : 'light');
    setReduceMotion(false);
    setScreenReader(false);
    setHapticFeedback(true);
  }, []);

  // Which user the current settings belong to, and which user's settings have finished loading.
  // Saving to AsyncStorage only happens when these match, so defaults can never overwrite a saved cache.
  const [uid, setUid] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Guards against an older sign-in/sign-out finishing after a newer one
  const authRunRef = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const run = ++authRunRef.current;
      setUid(user?.uid ?? null);
      setLoadedFor(null); // pause saving until this user's settings are loaded

      // Wait for the screen transition to finish before changing theme/motion,
      // otherwise the whole app restyles while Android is still mounting the next screen.
      InteractionManager.runAfterInteractions(async () => {
        if (run !== authRunRef.current) return;

        if (!user) {
          resetToDefaults();
          return;
        }

        try {
          // 1) this user's cached copy (fast, works offline)
          const cached = await AsyncStorage.getItem(`accessibilitySettings:${user.uid}`);
          if (run !== authRunRef.current) return;
          if (cached) loadFromServer(JSON.parse(cached));

          // 2) the server copy wins if available
          const response = await fetch(`${API_BASE_URL}/api/Settings/user/${user.uid}`);
          if (run !== authRunRef.current) return;
          if (response.ok) {
            loadFromServer(await response.json());
          }
        } catch (error) {
          console.warn('Could not load accessibility settings', error);
        } finally {
          if (run === authRunRef.current) setLoadedFor(user.uid);
        }
      });
    });

    return unsubscribe;
  }, [loadFromServer, resetToDefaults]);

  // Save this user's settings on the phone (keyed by uid, not shared between users)
  useEffect(() => {
    if (!uid || loadedFor !== uid) return;
    AsyncStorage.setItem(
      `accessibilitySettings:${uid}`,
      JSON.stringify({ textSize, colorMode, reduceMotion, screenReader, hapticFeedback })
    ).catch((error) => console.warn('Could not save accessibility settings', error));
  }, [uid, loadedFor, textSize, colorMode, reduceMotion, screenReader, hapticFeedback]);

  //(Balasubramanian, 2023)
  const triggerHaptic = useCallback(
    (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
      if (hapticFeedback) {
        Haptics.impactAsync(style);
      }
    },
    [hapticFeedback]
  );

  //(Balasubramanian, 2023)
  const triggerScreenReader = useCallback(
    (text: string) => {
      if (screenReader && !osScreenReaderEnabled) {
        Speech.stop();
        Speech.speak(text);
      }
    },
    [screenReader, osScreenReaderEnabled]
  );

  const scale = scaleMap[textSize];
  const theme = Colors[colorMode];
  const shouldReduceMotion = reduceMotion || osReduceMotionEnabled;

  //(Senturk, 2026)
  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        colorMode,
        reduceMotion,
        shouldReduceMotion,
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
        triggerScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

//(StackOverflow, 2025)
export function useAccessibility() {
  const message = useContext(AccessibilityContext);
  if (!message) {
    throw new Error('accessibility Error');
  }
  return message;
}

/* References

Balasubramanian, K., 2023. Haptics in React Native: Creating a useHaptic() Hook. (Version 2.0) [Source Code] Available at: < https://medium.com/timeless/implementing-haptic-feedback-in-react-native-writing-a-usehaptic-hook-6b8612675599 > [Accessed 3 September 2026]
Cusick, J., 2025. Flexible typography in react. (Version 2.0) [Source Code] Available at: < https://joshcusick.substack.com/p/flexible-typography-in-react > [Accessed 4 September 2026]
Mimo, 2026. Typescript record type: syntax, use cases, and examples. (Version 2.0) [Source Code] Available at: < https://mimo.org/glossary/typescript/record-type > [Accessed 4 September 2026]
React Native, 2026. AccessibilityInfo. (Version 2.0) [Source Code] Available at: < https://reactnative.dev/docs/accessibilityinfo > [Accessed 3 September 2026]
Patel, R., 2025. Utility types in typescript. (Version 2.0) [Source Code] Available at: < https://dev.to/rushi-patel/utility-types-in-typescript-a-detailed-explanation-2m9p > [Accessed 4 September 2026]
Senturk, A., 2026. AccessibilityProvider.tsx. (Version 2.0) [Source Code] Available at: < https://gitlab.opencode.de/bad-belzig/smart-village-app/-/blob/master/src/AccessibilityProvider.tsx?ref_type=heads  > [Accessed 3 September 2026]
Schult, J., 2022. Accessibility-Demo. (Version 2.0) [Source Code] Available at: < https://github.com/jonnyschult/accessibility-demo > [Accessed 3 September 2026]
StackOverflow, 2025. React useContext method. (Version 2.0) [Source Code] Available at: < https://stackoverflow.com/questions/79371800/react-usecontext-method > [Accessed 3 September 2026]
*/