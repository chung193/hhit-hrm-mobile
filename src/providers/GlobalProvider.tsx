import React, { createContext, useState, useContext } from "react";
import DataFetcher from "./sections/loading/DataFetcher";
import DialogData from "./sections/notification/DialogData";
import SnackbarData from "./sections/notification/SnackbarData";
import AppModal from "./sections/modal/AppModal";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false)

    const showLoading = () => {
        setLoading(true);
    };

    const hideLoading = () => {
        setLoading(false);
    };

    const [modal, setModal] = useState({
        visible: false,
        content: null,
        onClose: () => { },
        onOpen: () => { }
    })

    const openModal = (
        content = null,
        onClose = () => { },
        onOpen = () => { }
    ) => {
        setModal({
            visible: true,
            content,
            onClose,
            onOpen
        })
    }

    const closeModal = () => {
        setModal({
            visible: false,
            content: null,
            onClose: () => { },
            onOpen: () => { }
        })
    }

    const [dialog, setDialog] = useState({
        visible: false,
        text: '',
        title: "",
        onOk: () => { },
        onCancel: () => { }
    })

    const showDialog = (
        title: string,
        text: string,
        onOk: () => void,
        onCancel: () => void
    ) => {
        setDialog({
            visible: true,
            text,
            title,
            onOk,
            onCancel
        });
    };

    const hideDialog = () => {
        setDialog({
            visible: false,
            text: '',
            title: '',
            onOk: () => { },
            onCancel: () => { }
        });
    };

    const [snackbar, setSnackbar] = useState({
        visible: false,
        label: '',
        text: '',
        onPress: () => { },
        onDismiss: () => { }
    })

    const showSnackbar = (
        text: string,
        label: string,
        onDismiss: () => void,
        onPress: () => void
    ) => {
        setSnackbar({
            visible: true,
            text,
            label,
            onPress,
            onDismiss
        });
    }

    const hideSnackbar = () => {
        setSnackbar({
            visible: false,
            label: '',
            text: '',
            onPress: () => { },
            onDismiss: () => { }
        });
    }
    return (
        <GlobalContext.Provider
            value={{
                showLoading,
                hideLoading,
                showDialog,
                hideDialog,
                showSnackbar,
                hideSnackbar,
                openModal,
                closeModal,
            }}
        >
            {children}
            {loading && <DataFetcher />}
            <DialogData
                title={dialog.title}
                visible={dialog.visible}
                text={dialog.text}
                onOk={dialog.onOk}
                onCancel={dialog.onCancel}
            />

            <SnackbarData
                visible={snackbar.visible}
                onDismiss={snackbar.onDismiss}
                text={snackbar.text}
                label={snackbar.label}
                onPress={snackbar.onPress}
            />

            <AppModal
                visible={modal.visible}
                content={modal.content}
                onOpen={modal.onOpen}
                onClose={modal.onClose}
            />
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
