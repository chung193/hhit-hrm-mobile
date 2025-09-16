import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Background } from '@components/background';
import { Logo } from '@components/logo';
import { Header } from '@components/header';
import { Button } from '@components/button';
import { TextInput } from '@components/textInput';
import { BackButton } from '@components/backButton';
import { theme } from '@core/theme';
import { emailValidator, passwordValidator, codeValidator } from '@core/utils';
import { Navigation } from '@types';
import { login } from '@services/Auth';
import { saveToken } from '@utils/Storage';
import { useGlobalContext } from '@providers/GlobalProvider';
import { useTranslation } from 'react-i18next';

type Props = {
    navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
    const { i18n, t } = useTranslation();
    const [email, setEmail] = useState({ value: 'HHIT0114', error: '' });
    const [password, setPassword] = useState({ value: 'HHIT0114', error: '' });
    const { showLoading, hideLoading, showSnackbar, hideSnackbar } = useGlobalContext();
    const _onLoginPressed = () => {
        const codeError = codeValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (codeError || passwordError) {
            setEmail({ ...email, error: codeError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        showLoading();
        login({ email: email.value, password: password.value })
            .then((res) => {
                console.log('Login successful:', res);
                saveToken(res.data.data.access_token);
                hideLoading();
                navigation.navigate('Dashboard');
            })
            .catch((error) => {
                hideLoading();
                showSnackbar('Login failed.Please try again.');
                console.error('Login error:', error);
            });
    };

    return (
        <Background>
            <Logo />
            <Header>{t('screen.login.welcome')}</Header>

            <TextInput
                label={t('screen.login.email')}
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <TextInput
                label={t('screen.login.password')}
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                    <Text style={styles.label}>{t('screen.login.forgot_password')}</Text>
                </TouchableOpacity>
            </View>

            <Button mode="contained" onPress={_onLoginPressed}>
                {t('screen.login.login')}
            </Button>

            {/* <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View> */}
        </Background>
    );
};

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(LoginScreen);