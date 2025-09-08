// Home.tsx
import React, { useEffect } from 'react';
import { MainBackground } from '@components/background';
import { profile } from '@services/User';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MAIN_COLOR, SUB_COLOR, UPLOAD_URL } from '../../config/app';

const Profile = () => {
    const [data, setData] = React.useState(null);
    useEffect(() => {
        profile()
            .then(response => {
                setData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);
    return (data ? <MainBackground>
        <View style={styles.header}>
            <Image source={{ uri: UPLOAD_URL + '/users/' + data.avatar }} style={styles.avatar} />
            <View>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.email}>{data.position_name}</Text>
            </View>
        </View>
        <View style={styles.subHeader}>
            <View style={styles.viewSubLine}>
                <Text style={styles.strongText}>Email</Text>
                <Text style={styles.subLine}>{data.email}</Text>
            </View>
            <View style={styles.viewSubLine}>
                <Text style={styles.strongText}>Mã nhân viên</Text>
                <Text style={styles.subLine}>{data.code}</Text>
            </View>
            <View style={styles.viewSubLine}>
                <Text style={styles.strongText}>Ngày sinh: </Text>
                <Text style={styles.subLine}>{data.bd}</Text>
            </View>

            <View style={styles.viewSubLine}>
                <Text style={styles.strongText}>Số điện thoại: </Text>
                <Text style={styles.subLine}>{data.phone}</Text>
            </View>
            <View style={styles.viewSubLine}>
                <Text style={styles.strongText}>Giới tính: </Text>
                <Text style={styles.subLine}>{data.gender ? 'Nam' : 'Nữ'}</Text>
            </View>
        </View>
    </MainBackground> : null);
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        //backgroundColor: '#e3f2fd',
        marginBottom: 10,
    },
    subHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginRight: 12,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    email: {
        fontSize: 16,
        color: '#555',
    },
    viewSubLine: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: MAIN_COLOR,
    },
    subLine: {
        fontSize: 16,
        width: '60%',
    },
    strongText: {
        fontWeight: 'bold',
        color: MAIN_COLOR,
        width: '40%',
    },
});
export default Profile;