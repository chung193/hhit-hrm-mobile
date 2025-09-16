import React, { createContext, useState, useContext, useCallback } from "react";
import DataFetcher from "./sections/loading/DataFetcher";
import DialogData from "./sections/notification/DialogData";
import SnackbarData from "./sections/notification/SnackbarData";
import AppModal from "./sections/modal/AppModal";

const GlobalContext = createContext<any>(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    const [modal, setModal] = useState({
        visible: false,
        content: null as any,
        onClose: () => { },
        onOpen: () => { },
    });

    const openModal = (content: any = null, onClose = () => { }, onOpen = () => { }) => {
        setModal({ visible: true, content, onClose, onOpen });
    };
    const closeModal = () => setModal({ visible: false, content: null, onClose: () => { }, onOpen: () => { } });

    const [dialog, setDialog] = useState({
        visible: false,
        text: "",
        title: "",
        onOk: () => { },
        onCancel: () => { },
    });
    const showDialog = (title: string, text: string, onOk: () => void, onCancel: () => void) => {
        setDialog({ visible: true, text, title, onOk, onCancel });
    };
    const hideDialog = () => setDialog({ visible: false, text: "", title: "", onOk: () => { }, onCancel: () => { } });

    // 🔧 Snackbar state: thêm duration + key để ép remount khi cần
    const [snackbar, setSnackbar] = useState({
        key: 0,
        visible: false,
        type: "info" as "info" | "error" | "success",
        label: "",
        text: "",
        duration: 3000,
        onPress: undefined as undefined | (() => void),
        onDismiss: undefined as undefined | (() => void),
    });

    // API thân thiện: bắt buộc text; các tham số khác tùy chọn
    const showSnackbar = (
        text: string,
        type: "info" | "error" | "success" = "info",
        label?: string,
        onDismiss?: () => void,
        onPress?: () => void,
        duration: number = 3000
    ) => {
        setSnackbar({
            key: Date.now(),         // giúp hiển thị lại khi text trùng
            visible: true,
            type,
            text,
            label: label ?? "",
            duration,
            onPress,
            onDismiss,
        });
    };

    const hideSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            visible: false,
        }));
    };

    // 🔒 Luôn đảm bảo dismiss sẽ đóng snackbar (kể cả khi dev quên set onDismiss)
    const handleDismiss = useCallback(() => {
        try {
            snackbar.onDismiss?.();
        } finally {
            hideSnackbar();
        }
    }, [snackbar.onDismiss]);

    const handlePress = useCallback(() => {
        try {
            snackbar.onPress?.();
        } finally {
            // tùy ý: thường UX muốn ẩn khi bấm action
            hideSnackbar();
        }
    }, [snackbar.onPress]);

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

            {/* 👇 Dùng key để remount khi cần */}
            <SnackbarData
                key={snackbar.key}
                visible={snackbar.visible}
                type={snackbar.type}
                text={snackbar.text}
                label={snackbar.label}
                duration={snackbar.duration}
                onPress={handlePress}
                onDismiss={handleDismiss}
            />

            <AppModal visible={modal.visible} content={modal.content} onOpen={modal.onOpen} onClose={modal.onClose} />
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
