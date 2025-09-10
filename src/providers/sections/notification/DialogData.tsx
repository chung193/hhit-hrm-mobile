import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const DialogData = ({ visible, title, text, onOk, onCancel }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{text}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>Cancel</Button>
                    <Button onPress={onOk}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default DialogData;