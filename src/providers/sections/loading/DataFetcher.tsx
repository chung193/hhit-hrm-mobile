import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';


const DataFetcher: React.FC = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={MD2Colors.blue800} size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
    </View>
)

const styles = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'white'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DataFetcher;