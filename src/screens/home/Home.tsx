import React, { memo } from 'react';
import { Logo } from '@components/logo';
import { Header } from '@components/header';
import { Button } from '@components/button';
import { Paragraph } from '@components/paragraph';
import { Background } from '@components/background';
import { Navigation } from '@types';
import { useTranslation } from 'react-i18next';

type Props = {
    navigation: Navigation;
};


const HomeScreen = ({ navigation }: Props) => {
    const { i18n, t } = useTranslation();

    return (
        <Background>
            <Logo />
            <Header>{t('welcome')}</Header>

            <Paragraph>
                {t('description')}
            </Paragraph>
            <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
                {t('login')}
            </Button>
            {/* <Button
                mode="outlined"
                onPress={() => navigation.navigate('RegisterScreen')}
            >
                {t('sign_up')}
            </Button> */}
        </Background>
    )
};

export default memo(HomeScreen);