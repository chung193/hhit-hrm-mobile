// components/LanguageSwitcher.js
import React from 'react';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const theme = useTheme();
    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
            <Text style={{ color: theme.colors.onBackground, fontSize: 20, marginBottom: 20 }}>
                {i18n.language === 'vi' ? 'Việt Nam' : 'English'}
            </Text>
            <Button mode="contained" onPress={toggleLanguage}>
                {t('toggle_language')}
            </Button>
        </View>
    );
};

export default LanguageSwitcher;
