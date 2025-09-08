import React, { memo } from 'react';
import { Logo } from '@components/logo';
import { Header } from '@components/header';
import { Button } from '@components/button';
import { Paragraph } from '@components/paragraph';
import { Background } from '@components/background';
import { Navigation } from '@types';

type Props = {
    navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => (
    <Background>
        <Logo />
        <Header>Login Template</Header>

        <Paragraph>
            The easiest way to start with your amazing application.
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
            Login
        </Button>
        <Button
            mode="outlined"
            onPress={() => navigation.navigate('RegisterScreen')}
        >
            Sign Up
        </Button>
    </Background>
);

export default memo(HomeScreen);