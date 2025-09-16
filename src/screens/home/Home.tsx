import React, { memo } from 'react';
import { Logo } from '@components/logo';
import { Header } from '@components/header';
import { Button } from '@components/button';
import { Paragraph } from '@components/paragraph';
import { Background } from '@components/background';
import { Navigation } from '@types';
import { useTranslation } from 'react-i18next';
import { IconButton, SegmentedButtons, useTheme } from 'react-native-paper';
import { View } from 'react-native';

type Props = { navigation: Navigation };

const HomeScreen = ({ navigation }: Props) => {
    const { i18n, t } = useTranslation();
    const theme = useTheme();

    // Khởi tạo theo ngôn ngữ hiện tại thay vì '' để nút hiển thị đúng
    const initialLang = i18n.language?.startsWith('vi') ? 'vi' : 'en';
    const [value, setValue] = React.useState<'vi' | 'en'>(initialLang);

    const changeLang = (v: 'vi' | 'en') => {
        setValue(v);
        // đổi ngôn ngữ ngay
        i18n.changeLanguage(v);
    };

    return (
        <Background>
            <Logo />
            <Header>{t('welcome')}</Header>

            <Paragraph>{t('description')}</Paragraph>

            {/* Nên bọc 1 view để có width/spacing rõ ràng */}
            <View style={{ width: '100%', paddingHorizontal: 16, marginTop: 16 }}>
                <SegmentedButtons
                    value={value}
                    onValueChange={(v) => changeLang(v as 'vi' | 'en')} // onValueChange trả về string
                    buttons={[
                        { value: 'vi', label: 'Tiếng Việt' },
                        { value: 'en', label: 'English' },
                    ]}
                    density="regular"
                />
            </View>

            {/* IconButton: thêm containerColor để tương phản, iconColor rõ ràng */}
            <IconButton
                icon="arrow-right"
                mode="contained"                       // cần Paper v5+
                size={24}
                containerColor={theme.colors.primary}  // nền rõ
                iconColor="white"                      // icon tương phản
                style={{ marginTop: 16 }}
                onPress={() => navigation.navigate('LoginScreen')}
            />
        </Background>
    );
};

export default memo(HomeScreen);
