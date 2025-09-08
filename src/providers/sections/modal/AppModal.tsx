import * as React from 'react';
import { Modal, Portal, Text } from 'react-native-paper';

const AppModal = ({ visible = false, content = null, onOpen = () => { }, onClose = () => { } }) => {

    React.useEffect(() => {
        if (visible) {
            onOpen();
        }
    }, [visible, onOpen]);

    const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 };
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={containerStyle}>
                {content}
            </Modal>
        </Portal >
    );
};

export default AppModal;