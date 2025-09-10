// ConfigScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Text, Switch, Surface } from 'react-native-paper';
import { useThemeContext } from './ThemeContext';

const ConfigScreen = () => {
    const { isDarkMode, toggleTheme } = useThemeContext();

    return (
        <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text variant="titleLarge" style={{ marginBottom: 16 }}>
                Giao diện {isDarkMode ? 'Tối' : 'Sáng'}
            </Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </Surface>
    );
};

export default ConfigScreen;
