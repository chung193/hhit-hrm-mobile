import * as React from 'react';
import { Snackbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const SnackbarData = ({ visible, onDismiss, onPress, label, text, type = 'info' }) => {

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            style={[styles[type], { marginBottom: 20 }]}
            action={{
                label: label,
                onPress: () => {
                    // Do something
                    onPress
                },
            }}>
            {text}
        </Snackbar>
    );
};

const styles = StyleSheet.create({
    info: {
        backgroundColor: '#3498db',
    },
    error: {
        backgroundColor: '#c0392b',
    },
    success: {
        backgroundColor: '#27ae60',
    },
});

export default SnackbarData;