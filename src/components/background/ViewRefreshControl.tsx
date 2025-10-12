import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

type ViewRefreshControlProps = {
    refreshing?: boolean;
    onRefresh?: () => void;
    children?: React.ReactNode;
    style?: any;
    contentContainerStyle?: any;
};

const ViewRefreshControl = ({
    refreshing = false,
    children = null,
    onRefresh = () => { },
    style,
    contentContainerStyle,
}: ViewRefreshControlProps) => {
    return (
        <ScrollView
            style={style}
            contentContainerStyle={[styles.scrollView, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
            }>
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 10,
    },
});

export default ViewRefreshControl;
