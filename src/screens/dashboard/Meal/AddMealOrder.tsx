import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons, Text, Button, Chip } from 'react-native-paper';
import { Calendar, DateObject } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useGlobalContext } from '@providers/GlobalProvider';
import { getAllMeal, deleteMultiMeal, updateMeal, mealOrderUser, searchMeal, mealAddOrder, getMealOrderFilter } from '@services/Meal'
import { profile } from '@services/User';
import ViewRefreshControl from '@components/background/ViewRefreshControl';
import { BackButton } from '@components/backButton';

type MealOption = { value: string; label: string };

const AddMealOrder = () => {
    const navigation = useNavigation();
    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();
    const [user, setUser] = React.useState(null);
    const [mealType, setMealType] = React.useState<string | null>(null);
    const [mealTypes, setMealTypes] = React.useState<MealOption[]>([]);
    const [marked, setMarked] = React.useState<Record<string, any>>({});
    const [saving, setSaving] = React.useState(false);
    const [textError, setTextError] = React.useState<string[] | null>([]);
    const [textSuccess, setTextSuccess] = React.useState<string[] | null>([]);

    // tháng đang hiển thị trên Calendar
    const [visibleMonth, setVisibleMonth] = React.useState<{ year: number; month: number }>({
        year: dayjs().year(),
        month: dayjs().month() + 1, // 1..12
    });

    const today = dayjs().format('YYYY-MM-DD');

    const loadData = () => {
        showLoading?.();
        Promise.all([getAllMeal({}), profile()])
            .then((res: any) => {
                const opts: MealOption[] = (res[0]?.data?.data ?? []).map((item: any) => ({
                    value: String(item?.id ?? ''),
                    label: String(item?.name ?? ''),
                }));

                setMealTypes(opts);

                // Nếu chỉ có 1 lựa chọn → auto-select đúng value
                if (opts.length === 1) setMealType(opts[0].value);

                // Nếu đang có mealType nhưng không còn trong danh sách mới → reset
                if (opts.length > 1 && mealType && !opts.some(o => o.value === mealType)) {
                    setMealType(null);
                }
                setUser(res[1]?.data?.data ?? null);
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

    function canRegisterMeal(registerDateStr) {
        const now = new Date();
        const currentHour = now.getHours();
        const cutoffHour = 16;

        // Ngày người dùng muốn đăng ký (ví dụ: '2025-04-18')
        const registerDate = new Date(registerDateStr);
        registerDate.setHours(0, 0, 0, 0);

        // Hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ngày mai
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        // Nếu đăng ký cho ngày sau ngày mai → luôn hợp lệ
        if (registerDate > tomorrow) {
            return true;
        }

        // Nếu đăng ký cho ngày mai và hiện tại chưa quá 16h → hợp lệ
        if (registerDate.getTime() === tomorrow.getTime() && currentHour < cutoffHour) {
            return true;
        }

        // Các trường hợp còn lại → không hợp lệ
        return false;
    }

    function filterValidRegisterDates(datesArray) {
        return datesArray.filter(dateStr => canRegisterMeal(dateStr));
    }

    function resetForm() {
        setMarked({});
        setWeekendNote('');
        setSaving(false);
        setTextError([]);
        setTextSuccess([]);
    }

    function showResultMessage(textSuccess, textError) {
        if (textSuccess) {
            setTextSuccess(textSuccess);
        }
        if (textError) {
            setTextError(textError); // Reset sau khi hiển thị
        }
    }

    const handleSave = async () => {
        if (!canSave) return;
        try {
            let data = {
                meal_id: mealType,
                dates: [] as string[],
                user_id: user?.id
            };
            if (Array.isArray(selectedDates)) {
                data.dates = filterValidRegisterDates(selectedDates)
            } else {
                console.log("data không phải là mảng:", selectedDates);
            }

            console.log('dữ liệu', data)

            mealAddOrder(data)
                .then(res => {
                    console.log('dữ liệu', res.data.data)
                    loadData()
                    resetForm()
                    showResultMessage(res.data.data.success, res.data.data.error)
                    showSnackbar('Lưu thành công!', 'success')
                })
                .catch(err => {
                    showSnackbar(err.message, 'error')
                    console.log(err)
                })
            setSaving(true);
        } catch (e) {
            console.error(e);
            showSnackbar?.('Lưu thất bại, thử lại!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ViewRefreshControl onRefresh={resetForm}>
            <BackButton goBack={() => {
                navigation.goBack()
            }} />
            {textError.length > 0 && <Text variant="titleSmall" style={{ color: 'red', marginBottom: 6 }}>Đăng ký không thành công cho ngày: </Text>}
            {
                textError.length > 0 && textError.map((element, idx) => (
                    <Text key={idx} style={{ color: 'red', marginBottom: 8 }}> • {element}</Text>
                ))
            }
            {textSuccess.length > 0 && <Text variant="titleSmall" style={{ color: 'green', marginBottom: 6 }}>Đăng ký thành công cho ngày: </Text>}
            {
                textSuccess.length > 0 && textSuccess.map((element, id) => (
                    <Text key={id} style={{ color: 'green', marginBottom: 8 }}> • {element}</Text>
                ))
            }
            <Text variant="titleSmall" style={{ marginBottom: 6 }}>Loại bữa</Text>

            {mealTypes.length > 1 ? (
                <SegmentedButtons
                    value={mealType ?? ''}
                    onValueChange={v => setMealType(v.value)}
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
        </ViewRefreshControl>
    );
};

export default AddMealOrder;
