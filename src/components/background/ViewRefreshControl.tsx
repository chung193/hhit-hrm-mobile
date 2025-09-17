import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

type ViewRefreshControlProps = {
    refreshing?: boolean;
    onRefresh?: () => void;
    children?: React.ReactNode;
};

const ViewRefreshControl = ({
    refreshing = false,
    children = null,
    onRefresh = () => { },
}: ViewRefreshControlProps) => {
    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        padding: 10
    },
});

export default ViewRefreshControl;