import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasBlePermissions, isBluetoothOn } from '../../utils/ble';
import { useRouter } from 'expo-router';
import { registerForPushNotificationsAsync } from '../../utils/pushNotifications';
import FeatherIcon from '@expo/vector-icons/Feather';
import {
StyleSheet,
View,
Image,
Text as RNText,
TouchableOpacity,
InteractionManager,
TextInput,
Alert // pulling in alerts to show login errors (React Native, 2026)
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { ThemedText as Text } from '@/components/themed-text';
import { useAccessibility } from '@/context/accessibilityContext';
// importing the login function from firebase
import {
signInWithEmailAndPassword,
} from 'firebase/auth';
// importing our custom auth setup
import { auth } from '../../config/firebaseConfig';
export default function SignIn() {
const router = useRouter();
const { theme, triggerHaptic, triggerScreenReader } = useAccessibility();
const [form, setForm] = useState({
userNumber: '',
password: '',
});
const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

// this fires when the user presses the login button
const handleLogin = async () => {
triggerHaptic();
if (!form.userNumber || !form.password)
{
Alert.alert('Oops', 'Please fill in both your user number and password.');
return;
}
setIsLoading(true);
try
{
// hits the .net backend to find the email associated with this user number
const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/User/resolve-email/${form.userNumber}`;
const response = await fetch(apiUrl);
if (!response.ok)
{
Alert.alert('Login Failed', 'User number not found.');
setIsLoading(false);
return;
}
const data = await response.json();
const resolvedEmail = data.email;
// checks the found email and password against firebase (Firebase, 2026)
await signInWithEmailAndPassword(auth, resolvedEmail, form.password);
const uid = auth.currentUser?.uid;

// 1) Ask for the notification permission NOW, while this screen is stable and nothing is navigating.
//    We wait for the user to answer the dialog before moving on.
if (uid) {
try {
await registerForPushNotificationsAsync(uid);
} catch (e) {
console.warn('Push registration failed', e);
}
// let the Android dialog finish closing before any screen change starts
await new Promise(resolve => setTimeout(resolve, 400));
}

// 2) Work out the ONE screen to go to, so there is never a second redirect right behind the first
let destination = '/permissions';
if (uid) {
try {
const confirmedBefore = await AsyncStorage.getItem(`permsConfirmed:${uid}`);
const bluetoothReady = (await hasBlePermissions()) && (await isBluetoothOn());
if (confirmedBefore && bluetoothReady) destination = '/(tabs)';
} catch (e) {
console.warn('Could not check saved permissions', e);
}
}

// 3) One navigation. We do NOT call setIsLoading(false) on success, because this screen is leaving
router.replace(destination as any);
}
catch (error: any)
{
// wrong password or user number throws an alert
triggerScreenReader('Login failed');
Alert.alert('Login Failed', 'Invalid user number or password. Please try again.');
setIsLoading(false); // Unlock button (only when login failed)
}
};
return (
<SafeAreaView style={{ flex: 1 }}>
<View style={[styles.container, { backgroundColor: theme.background }]}>
<View style={styles.header}>
<View style={styles.logoContainer}>
<Image
alt="App Logo"
resizeMode="contain"
style={styles.headerImg}
source={require('@/assets/images/parki-splash.png')}/>
</View>
<Text style={[styles.title, { color: theme.heading }]}>
Sign in to <RNText style={{ color: '#118091' }}>Parkitech</RNText>
</Text>
<Text style={[styles.subtitle, { color: theme.muted }]}>
Find your parking
</Text>
</View>
<View style={styles.form}>
<View style={styles.input}>
<Text style={[styles.inputLabel, { color: theme.heading }]}>User Number</Text>
<TextInput
autoCapitalize="none"
autoCorrect={false}
clearButtonMode="while-editing"
keyboardType="email-address"
onChangeText={userNumber => setForm({ ...form, userNumber })}
placeholder="ST___________/LR___________"
placeholderTextColor={theme.muted}
style={[styles.inputControl, { backgroundColor: theme.surface, color: theme.text }]}
value={form.userNumber} />
</View>
<View style={styles.input}>
<Text style={[styles.inputLabel, { color: theme.heading }]}>Password</Text>
<View style={[styles.passwordContainer, { backgroundColor: theme.surface }]}>
<TextInput
autoCorrect={false}
clearButtonMode="while-editing"
onChangeText={password => setForm({ ...form, password })}
placeholder=""
placeholderTextColor={theme.muted}
style={[styles.passwordInput, { color: theme.text }]}
secureTextEntry={!showPassword}
value={form.password}
/>
<TouchableOpacity
onPressIn={() => setShowPassword(true)}
onPressOut={() => setShowPassword(false)}
style={styles.eyeButton}
>
<FeatherIcon
name={showPassword ? 'eye' : 'eye-off'}
size={22}
color="#6b7280"
/>
</TouchableOpacity>
</View>
</View>
<View style={styles.formAction}>
<TouchableOpacity
// routing through our new login function (Firebase, 2026)
onPress={handleLogin}
disabled={isLoading}
>
<View style={[styles.btn, isLoading && { opacity: 0.7 }]}>
<Text style={styles.btnText}>
{isLoading ? 'Signing in...' : 'Sign in'}
</Text>
</View>
</TouchableOpacity>
</View>
<TouchableOpacity
onPress={() => router.push('/auth/forgot_password')}
activeOpacity={0.7}
>
<Text style={[styles.formLink, { color: theme.tint }]}>Forgot password?</Text>
</TouchableOpacity>
</View>
</View>
<TouchableOpacity
onPress={() => {
// handle link
router.push('/auth/sign_up');
}}>
<Text style={[styles.formFooter, { color: theme.text }]}>
Don't have an account?{' '}
<RNText style={{ textDecorationLine: 'underline', color: theme.tint }}>Sign up</RNText>
</Text>
</TouchableOpacity>
</SafeAreaView>
);
}
const styles = StyleSheet.create({
container: {
flexGrow: 1,
flexShrink: 1,
flexBasis: 0,
padding: 24,
backgroundColor: Colors.light.background,
},
title: {
fontSize: 31,
fontWeight: '700',
color: '#1D2A32',
marginBottom: 6,
},
subtitle: {
fontSize: 15,
fontWeight: '500',
color: '#929292',
},
header: {
alignItems: 'center',
justifyContent: 'center',
marginVertical: 36,
},
headerImg: {
width: '100%',
height: '100%',
alignSelf: 'center',
marginBottom: 36,
},
logoContainer: {
width: '60%',
height: 200,
marginLeft:10,
borderRadius:30,
overflow: 'hidden',
},
/** Form */
form: {
flexGrow: 1,
flexShrink: 1,
flexBasis: 0,
},
formAction: {
marginTop: 4,
marginBottom: 16,
},
formLink: {
fontSize: 16,
fontWeight: '600',
color: '#09486e',
textAlign: 'center',
},
formFooter: {
marginBottom: 24,
paddingVertical: 24,
fontSize: 15,
fontWeight: '600',
color: '#222',
textAlign: 'center',
letterSpacing: 0.15,
},
input: {
marginBottom: 16,
},
inputLabel: {
fontSize: 17,
fontWeight: '600',
color: '#222',
marginBottom: 8,
},
inputControl: {
height: 50,
backgroundColor: '#fff',
paddingHorizontal: 16,
borderRadius: 12,
fontSize: 15,
fontWeight: '500',
color: '#222',
borderWidth: 1,
borderColor: '#C9D3DB',
borderStyle: 'solid',
},
btn: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
borderRadius: 30,
paddingVertical: 10,
paddingHorizontal: 20,
borderWidth: 1,
backgroundColor: '#0c4b64',
borderColor: '#a8ddd4',
},
btnText: {
fontSize: 18,
lineHeight: 26,
fontWeight: '600',
color: '#fff',
},
passwordContainer: {
height: 50,
backgroundColor: '#fff',
borderRadius: 12,
borderWidth: 1,
borderColor: '#C9D3DB',
flexDirection: 'row',
alignItems: 'center',
},
passwordInput: {
flex: 1,
height: 50,
paddingHorizontal: 16,
fontSize: 15,
fontWeight: '500',
color: '#222',
},
eyeButton: {
paddingHorizontal: 14,
height: 50,
alignItems: 'center',
justifyContent: 'center',
},
});