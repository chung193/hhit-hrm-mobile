// WorkSchedule.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { profile } from '@services/User';
import { useGlobalContext } from '@providers/GlobalProvider';
import ViewRefreshControl from '@components/background/ViewRefreshControl';

type Shift = { shift_date: string; shift_type: 'HC' | '7h' | '19h' };
type ProfileData = { name: string; upcoming_shifts?: Shift[] };

const WorkSchedule: React.FC = () => {
    const [data, setData] = useState<ProfileData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { showSnackbar, hideLoading } = useGlobalContext();

    // “dập” loader global nếu ai đó đã bật trước đó
    useEffect(() => { hideLoading?.(); }, [hideLoading]);

    const renderType = (type?: Shift['shift_type']) => {
        switch (type) {
            case 'HC': return 'Hành chính';
            case '7h': return 'Ca ngày';
            case '19h': return 'Ca đêm';
            default: return '';
        }
    };

    const formatDate = (d?: string) => {
        if (!d) return '';
        try { return new Date(d).toLocaleDateString('vi-VN'); }
        catch { return d; }
    };

    const loadData = useCallback(async () => {
        setRefreshing(true);              // 👈 bật spinner
        try {
            const res = await profile();
            const nextData: ProfileData = res?.data?.data ?? null;
            setData(nextData);
        } catch (err: any) {
            showSnackbar?.(err?.message || 'Lỗi tải dữ liệu', 'error');
        } finally {
            setRefreshing(false);           // 👈 TẮT spinner
            hideLoading?.();               // 👈 dập loader global (nếu có)
        }
    }, [showSnackbar, hideLoading]);

    useEffect(() => { loadData(); }, [loadData]);

    const first = data?.upcoming_shifts?.[0];

    return (
        <ViewRefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            contentContainerStyle={styles.container}
        >
            {data ? (
                <>
                    <View style={styles.titleRow}>
                        <View style={styles.redBar} />
                        <Text variant="titleLarge" style={styles.titleText}>
                            Lịch trực {data.name}
                        </Text>
                    </View>

                    {first ? (
                        <>
                            <View style={styles.shiftBox}>
                                <Text variant="bodyMedium">
                                    <Text style={styles.bold}>Ngày </Text>
                                    {formatDate(first.shift_date)}
                                </Text>
                                <Text variant="bodyMedium">{renderType(first.shift_type)}</Text>
                            </View>
                            <Divider />

                            {(data.upcoming_shifts?.length ?? 0) > 1 &&
                                data.upcoming_shifts!.slice(1).map((item, idx) => (
                                    <View key={`${item.shift_date}-${idx}`}>
                                        <View style={styles.shiftBox}>
                                            <Text variant="bodyMedium">
                                                Ngày {formatDate(item.shift_date)}
                                            </Text>
                                            <Text variant="bodyMedium">{renderType(item.shift_type)}</Text>
                                        </View>
                                        <Divider />
                                    </View>
                                ))}
                        </>
                    ) : (
                        <Text variant="bodyMedium">Chưa có thông tin mục này</Text>
                    )}
                </>
            ) : (
                !refreshing && <Text variant="bodyMedium">Đang tải dữ liệu…</Text>
            )}
        </ViewRefreshControl>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    redBar: { width: 4, height: 26, backgroundColor: '#e74c3c', borderRadius: 2, marginRight: 10 },
    titleText: { letterSpacing: 0.3 },
    shiftBox: { paddingVertical: 12, gap: 4 },
    bold: { fontWeight: 'bold' },
});

export default WorkSchedule;
