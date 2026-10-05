//(Withfra.me, 2022)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { registerForPushNotificationsAsync } from '../../utils/pushNotifications';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  Alert // importing Alert so we can pop up error messages easily (React Native, 2026)
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';
import { ThemedText as Text } from '@/components/themed-text';
import { useAccessibility } from '@/context/accessibilityContext';

// pulling in the specific firebase registration function (Firebase, 2026a)
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// importing our custom auth setup
import { auth } from '../../config/firebaseConfig';
// Google Sign in (React Native Google Sign In, 2026)
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SignUp() {
  const router = useRouter();
  const { theme, triggerHaptic, triggerScreenReader } = useAccessibility();
  const [isLoading, setIsLoading] = useState(false); // loading state for the registration process
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    userRole: 'Student', // default role for new users
    userNumber: ''
  });

  // Configures Google Sign in (React Native Google Sign In, 2026)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleRegister = async () => {
    triggerHaptic();
    // checks that they dont submit blank forms
    if (!form.name ||!form.email || !form.password || !form.userNumber) {
      Alert.alert('Hold up!', 'Please enter your name, email, password and user number.');
      return;
    }

    setIsLoading(true);

    try {
      // Creates the secure account in Firebase
      // sends the email and password to firebase to create the account
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUid = userCredential.user.uid; // Grab the secure ID
      
      // Syncs the profile data to our .NET SQL Database
      // Pulls the IP address from the local .env file (Expo, 2026)
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/User/sync`;

      const backendResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUid,
          userNumber: form.userNumber,
          name: form.name,
          email: form.email,
          userRole: form.userRole
        })
      });

      if (!backendResponse.ok) 
      {
        const errorText = await backendResponse.text();
        await userCredential.user.delete(); // deletes the firebase account if the backend fails to sync
        throw new Error(`Server returned error: ${errorText}`);
      }
      
      await registerForPushNotificationsAsync(firebaseUid); //push notification token given after user registers
      Alert.alert('Success!', 'Your account has been created.');
      
      // takes them to the sign in page so they can log in
      router.push('/auth/sign_in');
    } 
    catch (error: any) 
    {
      // if firebase complains about a weak password or existing email, this tells the user
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In Logic (Firebase, 2026b)
  const handleGoogleSignIn = async () => {
    try 
    {
      // Prompts the user to sign in with Google
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken;
      
      if (!idToken) 
      {
          throw new Error("No ID Token found");
      }

      // Creates a Firebase credential with the Google ID token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Signs in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUid = userCredential.user.uid;

      // Because Google doesnt give us a "User Number" or "Role", we sync default/empty values
      // The user is then redirected to an "Onboarding" screen after this to collect their Student/Staff number
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/User/sync`;
      const backendResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUid,
          userNumber: `G-${Date.now()}`,
          name: userCredential.user.displayName || "Google User",
          email: userCredential.user.email,
          userRole: 'Student' // default
        })
      });

      if (!backendResponse.ok) 
      {
        throw new Error(`Failed to sync Google user to database.`);
      }

      await registerForPushNotificationsAsync(firebaseUid);
      
      // Navigates to the main app layout
      router.replace('/permissions' as any);

    } catch (error: any) {
      console.error(error);
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAwareScrollView>
        <View style={styles.logoContainer}>
          <Image
            alt="My Shop logo"
            resizeMode="cover"
            source={require('@/assets/images/parki-splash.png')}
            style={styles.logoImg} />
        </View>
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.heading }]}>Create a new account</Text>

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Please put all of your information below to create a new account.
          </Text>

          <View style={styles.input}>
            <TextInput
              clearButtonMode="while-editing"
              onChangeText={name => setForm({ ...form, name })}
              placeholder="Full Name"
              placeholderTextColor={theme.muted}
              style={[styles.inputControl, { backgroundColor: theme.surface, color: theme.text }]}
              value={form.name} />
          </View>

          <View style={styles.input}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="Email Address"
              placeholderTextColor={theme.muted}
              style={[styles.inputControl, { backgroundColor: theme.surface, color: theme.text }]}
              value={form.email} />
          </View>

          {/* custom radio button layout for role selection */}
          <View style={styles.radioContainer}>
            <TouchableOpacity 
              style={[styles.radioButton, { backgroundColor: theme.surface, borderColor: theme.border }, form.userRole === 'Student' && styles.radioSelected]} 
              onPress={() => setForm({ ...form, userRole: 'Student' })}
            >
              <Text style={form.userRole === 'Student' ? styles.textSelected : [styles.textUnselected, { color: theme.muted }]}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.radioButton, { backgroundColor: theme.surface, borderColor: theme.border }, form.userRole === 'Lecturer' && styles.radioSelected]} 
              onPress={() => setForm({ ...form, userRole: 'Lecturer' })}
            >
              <Text style={form.userRole === 'Lecturer' ? styles.textSelected : [styles.textUnselected, { color: theme.muted }]}>Lecturer</Text>
            </TouchableOpacity>
          </View>

          {/* dynamic input that changes based on the selected radio button */}
          <View style={styles.input}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={userNumber => setForm({ ...form, userNumber })}
              placeholder={form.userRole === 'Student' ? "Student Number" : "Lecturer / Staff ID"}
              placeholderTextColor={theme.muted}
              style={[styles.inputControl, { backgroundColor: theme.surface, color: theme.text }]}
              value={form.userNumber} />
          </View>

          <View style={styles.input}>
  <View style={[styles.passwordContainer, { backgroundColor: theme.surface }]}>
    <TextInput
      autoCorrect={false}
      clearButtonMode="while-editing"
      onChangeText={password => setForm({ ...form, password })}
      placeholder="Password"
      placeholderTextColor={theme.muted}
      secureTextEntry={!showPassword}
      style={[styles.passwordInput, { color: theme.text }]}
      value={form.password}
    />

    <TouchableOpacity
      onPressIn={() => setShowPassword(true)}
      onPressOut={() => setShowPassword(false)}
      style={styles.eyeButton}
    >
      <MaterialCommunityIcons
        name={showPassword ? 'eye' : 'eye-off'}
        size={22}
        color="#6b7280"
      />
    </TouchableOpacity>
  </View>
</View>

          <TouchableOpacity
          // routing through our new signup function (Firebase, 2026)
            onPress={handleRegister}
            disabled={isLoading} // disbaled when loading to prevent multiple submissions
            >
            <View style={[styles.btn, isLoading && { opacity: 0.7 }]}>
              <Text style={styles.btnText}>
                {isLoading ? 'Creating Account...' : 'Sign up now'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push('/auth/sign_in');
            }}>
            <Text style={[styles.formFooter, { color: theme.text }]}>
              Already have an account?
              <RNText style={{ color: theme.tint }}> Log in</RNText>
            </Text>
          </TouchableOpacity>

          <View style={styles.formSpacer}>
            <Text style={[styles.formSpacerText, { backgroundColor: theme.background, color: theme.text }]}>Or Sign up with</Text>

            <View style={styles.formSpacerDivider} />
          </View>

          <View style={styles.btnGroup}>
           
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              style={{ flex: 1, paddingHorizontal: 6 }}>
              <View style={styles.btnGoogle}>
                <MaterialCommunityIcons
                  color="#fff"
                  name="google"
                  size={18}
                  style={{ marginRight: 12 }} />

                <Text style={styles.btnGoogleText}>Google</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: '60%',
    height: 200,
    marginTop:40,
    marginLeft:80,
    borderRadius:30,
    overflow: 'hidden',
    
  },
  logoImg: {
    width: '100%',
     height: '100%',
    
   
    
  },
  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#989898',
    marginBottom: 16,
    textAlign: 'center',
  },
  /** Form */
  form: {
    paddingHorizontal: 24,
  },
  formFooter: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    textAlign: 'center',
   
  },
  formSpacer: {
    marginTop: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    lineHeight: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    zIndex: 9,
  },
  formSpacerDivider: {
    borderBottomWidth: 2,
    borderColor: '#eff1f5',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  /** Input */
  input: {
    marginBottom: 12,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#EFF1F5',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  /** Radio Buttons */
  radioContainer: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  radioButton: 
  { 
    flex: 0.48, 
    paddingVertical: 10, 
    borderWidth: 1, 
    borderColor: '#C9D3DB', 
    borderRadius: 12, 
    alignItems: 'center', 
    backgroundColor: '#EFF1F5' 
  },
  radioSelected: 
  { 
    backgroundColor: '#0c4b64', 
    borderColor: '#0c4b64' 
  },
  textSelected: 
  { 
    color: '#fff', 
    fontWeight: '600' 
  },
  textUnselected: 
  { 
    color: '#A5A5AE', 
    fontWeight: '500'
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
    backgroundColor: '#0c4b64',
    borderColor: '#a8ddd4',
    marginTop: 24,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginHorizontal: -6,
  },
 
  
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#0c6064',
    borderColor: '#a8ddd4',
  },
  btnGoogleText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },

  passwordContainer: {
  height: 44,
  backgroundColor: '#EFF1F5',
  borderRadius: 12,
  flexDirection: 'row',
  alignItems: 'center',
},

passwordInput: {
  flex: 1,
  height: 44,
  paddingHorizontal: 16,
  fontSize: 15,
  fontWeight: '500',
  color: '#222',
},

eyeButton: {
  height: 44,
  paddingHorizontal: 14,
  alignItems: 'center',
  justifyContent: 'center',
},

});
/**
 * References
 * Expo, 2026. Environment variables in Expo. [online] Available at: <https://docs.expo.dev/guides/environment-variables/> [Accessed 30 August 2026].
 * Firebase, 2026a. Password Authentication. [source code]. Available: <https://firebase.google.com/docs/auth/web/password-auth> [Accessed 28 August 2026].
 * Firebase, 2026b. Authenticate Using Google with React Native. (Version 10.0) [Source Code] Available at: <https://firebase.google.com/docs/auth/react-native/google-signin> [Accessed 22 September 2026].
 * React Native, 2026. Alert. [source code]. Available: <https://reactnative.dev/docs/alert> [Accessed 28 August 2026].
 * React Native Google Sign In, 2026. Google Sign In. (Version 10.0) [Source Code] Available at: <https://react-native-google-signin.github.io/docs/setting-up/expo> [Accessed 22 September 2026].
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */