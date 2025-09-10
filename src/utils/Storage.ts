import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('access_token', token);
    } catch (e) {
        console.error('Failed to save the token.', e);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (token !== null) {
            return token;
        }
    } catch (e) {
        console.error('Failed to load token.', e);
    }
};


export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('access_token');
    } catch (e) {
        console.error('Failed to remove token.', e);
    }
};
