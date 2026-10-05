//(Withfra.me, 2022)
 import React, { useState } from 'react';
 import {
 StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
 } from 'react-native';

 import {Feather} from '@expo/vector-icons';

import { Colors } from
'@/constants/theme';
import { Radius } from
'@/constants/radius';
import { Spacing } from
'@/constants/spacing';
import { useAccessibility } from '@/context/accessibilityContext';

 // onSearch returns true when the bay was found (or the box was cleared)
 type Props = {
  onSearch?: (query: string) => boolean;
 };

 export default function SearchBar({ onSearch }: Props) {
    const [text, setText] = useState('');

    // runs the search when the user presses enter on the keyboard or taps the search button
    const submit = () => {
        Keyboard.dismiss();
        if (!onSearch || text.trim() === '') return;

        const found = onSearch(text);
        if (!found) {
            Alert.alert(
                'Bay not found',
                'Enter a bay like A1 or E12.'
            );
        }
    };

    // clearing the box removes the highlight on the map
    const handleChange = (value: string) => {
        setText(value);
        if (value.trim() === '') onSearch?.('');
    };

    return (
        <View style={styles.search}>
            <TextInput
            placeholder="Search for parking bay"
            placeholderTextColor={Colors.light.muted}
            style={styles.searchInput}
            value={text}
            onChangeText={handleChange}
            onSubmitEditing={submit}
            returnKeyType="search"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
        />

        <View style={styles.searchFloating}>
            <TouchableOpacity onPress={submit}>
                <View style={styles.searchButton}>
                    <Feather
                    name="search"
                    size={20}
                    color = "grey"
                />
                </View>
            </TouchableOpacity>
        </View>
           </View>
    );
 }

 const styles = StyleSheet.create({
 search: {
    position: 'relative',
    marginHorizontal:Spacing.lg,
    marginBottom: Spacing.lg,
 },

 searchInput: {
    height: 56,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: Spacing.md,
    color: Colors.light.heading,
    fontSize: 18,
    borderRadius: Radius.pill,
  },
  searchFloating: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },


 searchButton: {
    alignSelf: 'center',
    width: 44,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
/**
 * References
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 10.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */