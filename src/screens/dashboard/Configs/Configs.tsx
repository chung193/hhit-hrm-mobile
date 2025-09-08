// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './sections/Settings';
import ColorMode from './sections/ColorMode';
import LanguageSwitcher from './sections/LanguageSwitcher';

const Stack = createNativeStackNavigator();

function ConfigStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Setting" component={Settings}
                options={{
                    headerShown: false,
                    headerTitle: 'Cài đặt',
                    drawerLabel: 'Cài đặt'
                }} />
            <Stack.Screen name="LanguageSwitcher" component={LanguageSwitcher}
                options={{
                    headerShown: false,
                    headerTitle: 'Thay đổi ngôn ngữ',
                    drawerLabel: 'Thay đổi ngôn ngữ'
                }} />
            <Stack.Screen name="ColorMode" component={ColorMode}
                options={{
                    headerShown: false,
                    headerTitle: 'Chế độ tối',
                    drawerLabel: 'Chế độ tối'
                }} />
        </Stack.Navigator>
    );
}

export default function Configs() {
    return (
        <>
            <ConfigStack />
        </>
    );
}