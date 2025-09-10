// src/i18n/languageDetector.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedDataJSON = await AsyncStorage.getItem('user-language');
            const lang = savedDataJSON ?? 'en';
            callback(lang);
        } catch (error) {
            console.log('Error reading language', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lang: string) => {
        try {
            await AsyncStorage.setItem('user-language', lang);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

export default LanguageDetector;
