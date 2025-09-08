

import React from 'react';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useAppTheme } from '@core/ThemeContext';

export default function ColorMode() {
    const { isDarkMode, toggleTheme } = useAppTheme();
    const theme = useTheme();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
            <Text style={{ color: theme.colors.onBackground, fontSize: 20, marginBottom: 20 }}>
                Giao diện hiện tại: {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </Text>
            <Button mode="contained" onPress={toggleTheme}>
                Chuyển sang {isDarkMode ? 'Light' : 'Dark'} Mode
            </Button>
        </View>
    );
}
