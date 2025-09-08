// NetworkProvider.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Snackbar } from 'react-native-paper';

type NetworkContextType = {
    isConnected: boolean;
};

export const NetworkContext = createContext<NetworkContextType>({
    isConnected: true,
});

const NetworkProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected !== isConnected) {
                setIsConnected(!!state.isConnected);
                if (!state.isConnected) setShowSnackbar(true);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [isConnected]);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}

            <Snackbar
                visible={showSnackbar}
                onDismiss={() => setShowSnackbar(false)}
                duration={5000}
                action={{
                    label: 'OK',
                    onPress: () => setShowSnackbar(false),
                }}
                style={{ backgroundColor: '#b71c1c' }}
            >
                Không có kết nối Internet!
            </Snackbar>
        </NetworkContext.Provider>
    );
};

export default NetworkProvider;
