import * as React from 'react';
import { Snackbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type Props = {
    visible: boolean;
    onDismiss?: () => void;
    onPress?: () => void;
    label?: string;
    text?: string;
    type?: 'info' | 'error' | 'success' | string;
    duration?: number;
    style?: any;
};

const SnackbarData: React.FC<Props> = ({
    visible,
    onDismiss,
    onPress,
    label,
    text = '',
    type = 'info',
    duration = 3000,
    style,
}) => {
    const styleForType = styles[type as keyof typeof styles] ?? styles.info;

    const action = React.useMemo(() => {
        if (!label && !onPress) return undefined;
        return {
            label: label ?? 'OK',
            onPress: () => {
                onPress?.();
                // Không gọi onDismiss ở đây nữa vì Provider đã lo hide
            },
        };
    }, [label, onPress]);

    return (
        <Snackbar
            visible={!!visible}
            onDismiss={() => onDismiss?.()}             // <- Quan trọng
            style={[styleForType, { marginBottom: 20 }, style]}
            duration={duration}
            action={action}
        >
            {text}
        </Snackbar>
    );
};

const styles = StyleSheet.create({
    info: { backgroundColor: '#3498db' },
    error: { backgroundColor: '#c0392b' },
    success: { backgroundColor: '#27ae60' },
});

export default React.memo(SnackbarData);
