// ShiftCalendar.tsx (React Native)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Calendar, LocaleConfig, DateObject } from 'react-native-calendars';
import { getPersonalWorkSchedule } from '@services/User'; // đổi path nếu dự án của bro khác
import { useGlobalContext } from '@providers/GlobalProvider';

// ----- Locale tiếng Việt cho react-native-calendars -----
LocaleConfig.locales.vi = {
    monthNames: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

// ----- Màu từng ca -----
const shiftColors: Record<string, string> = {
    '7h': '#2ecc71', // xanh lá
    '19h': '#bdc3c7', // xám
};

type Shift = {
    shift_date: string;          // "2025-09-18" hoặc ISO string
    shift_type: 'HC' | '7h' | '19h';
};

export default function CalendarWork() {
    const { showSnackbar } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
    const [shifts, setShifts] = useState<Shift[]>([]);

    // Gọi API & convert
    const loadData = useCallback(async () => {
        try {
            setRefreshing(true);
            const res = await getPersonalWorkSchedule();
            // API cũ trả res.data.data = [{ shift_date, shift_type }, ...]
            const raw: Shift[] = res?.data?.data ?? [];
            setShifts(raw);
        } catch (err: any) {
            showSnackbar?.(err?.message || 'Lỗi khi lấy lịch trực', 'error');
        } finally {
            setRefreshing(false);
        }
    }, [showSnackbar]);

    useEffect(() => { loadData(); }, [loadData]);

    // Gom theo ngày -> Set các loại ca trong ngày đó
    const shiftMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        for (const s of shifts) {
            // về chuẩn 'YYYY-MM-DD'
            const d = new Date(s.shift_date);
            const dateStr = isNaN(d.getTime())
                ? String(s.shift_date).slice(0, 10)
                : d.toISOString().slice(0, 10);
            if (!map.has(dateStr)) map.set(dateStr, new Set());
            map.get(dateStr)!.add(s.shift_type);
        }
        return map;
    }, [shifts]);

    // Tạo markedDates cho Calendar (markingType="custom")
    const markedDates = useMemo(() => {
        const obj: Record<string, any> = {};
        shiftMap.forEach((types, date) => {
            const has7 = types.has('7h');
            const has19 = types.has('19h');
            let bg = '';
            if (has7 && has19) bg = shiftColors['7h+19h'];
            else if (has7) bg = shiftColors['7h'];
            else if (has19) bg = shiftColors['19h'];
            if (bg) {
                obj[date] = {
                    customStyles: {
                        container: {
                            backgroundColor: bg,
                            borderRadius: 6,
                        },
                        text: {
                            color: '#fff',
                            fontWeight: '600',
                        },
                    },
                };
            }
        });
        return obj;
    }, [shiftMap]);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={loadData} />
            }
            keyboardShouldPersistTaps="handled"
        >
            <Text>Lịch trực cá nhân</Text>
            {/* legend màu ca */}
            <View style={styles.legendRow}>
                <Chip style={[styles.legendChip, { backgroundColor: shiftColors['7h'] }]} textStyle={styles.legendText}>
                    7h
                </Chip>
                <Chip style={[styles.legendChip, { backgroundColor: shiftColors['19h'] }]} textStyle={styles.legendText}>
                    19h
                </Chip>
            </View>

            <Calendar
                // tháng hiện tại; có thể set initialDate nếu muốn
                markingType="custom"
                markedDates={markedDates}
                firstDay={1} // tuần bắt đầu từ T2
                theme={{
                    textSectionTitleColor: '#666',
                    todayTextColor: '#e74c3c',
                    monthTextColor: '#111',
                    arrowColor: '#111',
                    textDayFontWeight: '500',
                    textMonthFontWeight: '700',
                }}
                onDayPress={(d: DateObject) => {
                    const types = shiftMap.get(d.dateString);
                    if (types && types.size > 0) {
                        const msg = Array.from(types).join(', ');
                        showSnackbar?.(`Ca ngày ${d.dateString}: ${msg}`, 'info');
                    } else {
                        showSnackbar?.(`Ngày ${d.dateString}: không có ca`, 'info');
                    }
                }}
            />
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: { padding: 12 },
    card: { borderRadius: 12 },
    legendRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    legendChip: {
        //height: 28,
    },
    legendText: {
        color: '#fff',
        fontWeight: '600',
    },
});
