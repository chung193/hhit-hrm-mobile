import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons, Text, Button, Chip } from 'react-native-paper';
import { Calendar, DateObject } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { getAllMeal } from '@services/Meal';
import { useGlobalContext } from '@providers/GlobalProvider';

type MealOption = { value: string; label: string };

const AddMealOrder = () => {
    const navigation = useNavigation();
    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();

    const [mealType, setMealType] = React.useState<string | null>(null);
    const [mealTypes, setMealTypes] = React.useState<MealOption[]>([]);
    const [marked, setMarked] = React.useState<Record<string, any>>({});
    const [saving, setSaving] = React.useState(false);

    // tháng đang hiển thị trên Calendar
    const [visibleMonth, setVisibleMonth] = React.useState<{ year: number; month: number }>({
        year: dayjs().year(),
        month: dayjs().month() + 1, // 1..12
    });

    const today = dayjs().format('YYYY-MM-DD');

    const loadData = () => {
        showLoading?.();
        getAllMeal({})
            .then((res: any) => {
                const opts: MealOption[] = (res?.data?.data ?? []).map((item: any) => ({
                    value: String(item?.name ?? ''),
                    label: String(item?.name ?? ''),
                }));

                setMealTypes(opts);

                // Nếu chỉ có 1 lựa chọn → auto-select đúng value
                if (opts.length === 1) setMealType(opts[0].value);

                // Nếu đang có mealType nhưng không còn trong danh sách mới → reset
                if (opts.length > 1 && mealType && !opts.some(o => o.value === mealType)) {
                    setMealType(null);
                }
            })
            .catch((err: any) => {
                console.error('Error fetching meal types:', err);
                showSnackbar?.('Không tải được loại bữa ăn');
            })
            .finally(() => {
                hideLoading?.();
            });
    };

    React.useEffect(() => {
        loadData();
    }, []);


    // Toggle từng ngày (không cho chọn quá khứ)
    const toggle = (day: DateObject) => {
        if (day.dateString < today) return;
        setMarked(prev => {
            const next = { ...prev };
            if (next[day.dateString]) delete next[day.dateString];
            else next[day.dateString] = { selected: true, selectedColor: '#2c4397' };
            return next;
        });
    };

    const selectedDates = React.useMemo(() => Object.keys(marked).sort(), [marked]);
    const canSave = !!mealType && selectedDates.length > 0;

    // NÚT "CHỌN CẢ THÁNG NÀY"
    const [weekendNote, setWeekendNote] = React.useState<string>('');
    const pickWholeVisibleMonth = () => {
        const ym = dayjs(`${visibleMonth.year}-${String(visibleMonth.month).padStart(2, '0')}-01`);
        const end = ym.endOf('month');
        let cur = ym;

        const nextMarked: Record<string, any> = {};
        let weekendCount = 0;

        while (cur.isBefore(end) || cur.isSame(end, 'day')) {
            const d = cur.format('YYYY-MM-DD');
            if (!cur.isBefore(dayjs(), 'day')) {
                const wk = cur.day(); // 0=CN, 6=T7
                if (wk === 0 || wk === 6) weekendCount++;
                nextMarked[d] = { selected: true, selectedColor: '#2c4397' };
            }
            cur = cur.add(1, 'day');
        }

        // Nếu muốn cộng dồn với lựa chọn cũ: setMarked(prev => ({...prev, ...nextMarked}));
        setMarked(nextMarked);
        setWeekendNote(
            weekendCount > 0 ? `Lưu ý: có ${weekendCount} ngày rơi vào cuối tuần (T7/CN).` : ''
        );
    };

    const handleSave = async () => {
        if (!canSave) return;
        try {
            setSaving(true);
            const payload = { mealType, dates: selectedDates };
            console.log('SAVE >>', payload);
            showSnackbar?.('Lưu thành công!');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            showSnackbar?.('Lưu thất bại, thử lại!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 12 }} keyboardShouldPersistTaps="handled">

            <Text variant="titleSmall" style={{ marginBottom: 6 }}>Loại bữa</Text>

            {mealTypes.length > 1 ? (
                <SegmentedButtons
                    value={mealType ?? ''}
                    onValueChange={v => setMealType(v)}
                    buttons={mealTypes}
                    style={{ marginBottom: 12 }}
                />
            ) : mealTypes.length === 1 ? (
                // Chỉ 1 lựa chọn → hiển thị đọc-chỉ
                <Chip icon="food" selected style={{ marginBottom: 12 }}>
                    {mealTypes[0].label}
                </Chip>
            ) : null}

            {/* Nút chọn cả tháng đang hiển thị */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <Button mode="outlined" icon="calendar-month" onPress={pickWholeVisibleMonth}>
                    Chọn cả tháng này
                </Button>
            </View>

            <Text variant="titleSmall" style={{ marginBottom: 6 }}>Chọn ngày</Text>

            <Calendar
                onDayPress={toggle}
                markedDates={marked}
                minDate={today}
                onMonthChange={m => setVisibleMonth({ year: m.year, month: m.month })}
            />

            {!!weekendNote && (
                <Text style={{ color: '#d97706', marginTop: 8 }}>{weekendNote}</Text>
            )}

            <Text style={{ marginTop: 12 }}>Đã chọn: {selectedDates.length} ngày</Text>

            <Button
                mode="contained"
                style={{ marginTop: 16 }}
                onPress={handleSave}
                disabled={!canSave || saving}
                loading={saving}
            >
                Lưu đơn {selectedDates.length ? `(${selectedDates.length} ngày)` : ''}
            </Button>
        </ScrollView>
    );
};

export default AddMealOrder;
