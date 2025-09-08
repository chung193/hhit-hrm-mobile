import { View, Text, TouchableOpacity } from 'react-native';
import { List, MD3Colors } from 'react-native-paper';
import * as React from 'react';
import { Navigation } from '@types';

function Settings({ navigation }) {
    return (
        <>
            <TouchableOpacity onPress={() => navigation.navigate('ColorMode')}>
                <List.Item
                    title="Giao diện"
                    description="Chế độ tối"
                    left={props => <List.Icon {...props} icon="drawing" />}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('LanguageSwitcher')}>
                <List.Item
                    title="Ngôn ngữ"
                    description="Ngôn ngữ ứng dụng"
                    left={props => <List.Icon {...props} icon="web" />}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <List.Item
                    title="Cài đặt"
                    description=""
                    left={props => <List.Icon {...props} icon="cog" />}
                />
            </TouchableOpacity>
        </>
    );
}

export default Settings;