import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { profile } from '@services/User';
import { UPLOAD_URL } from '../../config/app';

const UserDataSection = (props) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        profile()
            .then(res => {
                setUser(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [user])

    return (
        <DrawerContentScrollView {...props}>
            {user && <View style={styles.userInfoSection}>
                <Image source={{ uri: UPLOAD_URL + '/users/' + user.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.code}>{user.code}</Text>
            </View>}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    userInfoSection: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    code: {
        fontSize: 14,
        color: 'gray',
    },
});

export default UserDataSection;
