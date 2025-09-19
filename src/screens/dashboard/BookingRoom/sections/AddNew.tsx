// BookingRoomScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
    Card, Text, Button, TextInput, Divider,
    Portal, Dialog, RadioButton, HelperText, ActivityIndicator,
} from 'react-native-paper';
import {
    DatePickerModal,
    TimePickerModal,
    registerTranslation,
} from 'react-native-paper-dates';
import { getAll as getAllRooms } from '@services/Room';
import { addItem } from '@services/BookingRoom';
import { useGlobalContext } from '@providers/GlobalProvider';

registerTranslation('vi', {
    save: 'Lưu',
    selectSingle: 'Chọn ngày',
    selectMultiple: 'Chọn nhiều ngày',
    selectRange: 'Chọn khoảng',
    notAccordingToDateFormat: (inputFormat) => `Định dạng ngày phải là ${inputFormat}`,
    mustBeHigherThan: (date) => `Phải sau ${date}`,
    mustBeLowerThan: (date) => `Phải trước ${date}`,
    mustBeBetween: (start, end) => `Phải trong ${start} - ${end}`,
    dateIsDisabled: 'Ngày không hợp lệ',
    previous: 'Trước',
    next: 'Sau',
    typeInDate: 'Nhập ngày',
    pickDateFromCalendar: 'Chọn từ lịch',
    close: 'Đóng',
});

type Room = { id: string; name: string };

type SubmitPayload = {
    room_id: string;
    date: string;        // 'YYYY-MM-DD'
    start_time: string;  // 'HH:mm'
    end_time: string;    // 'HH:mm'
    purpose: string;
};

type Props = {
    navigation?: any;
    route?: any; // có thể chứa route.params.onSubmit
    onSubmit?: (booking: SubmitPayload) => void;
};

const AddNew: React.FC<Props> = ({ route }) => {
    // rooms từ API
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [roomsErr, setRoomsErr] = useState<string>('');

    // form state
    const [roomId, setRoomId] = useState('');
    const [purpose, setPurpose] = useState('');
    const [dateObj, setDateObj] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('10:00');

    // dialogs
    const [roomDlg, setRoomDlg] = useState(false);
    const [openDate, setOpenDate] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const { showSnackbar: showSnack, showNotification } = useGlobalContext();
    // errors
    const [err, setErr] = useState<string>('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoadingRooms(true);
                setRoomsErr('');
                const res = await getAllRooms();
                const list =
                    Array.isArray(res?.data?.data) ? res.data.data :
                        Array.isArray(res?.data) ? res.data : [];
                setRooms(list as Room[]);
            } catch (e: any) {
                setRooms([]);
                setRoomsErr(e?.message || 'Không tải được danh sách phòng');
            } finally {
                setLoadingRooms(false);
            }
        };
        fetchRooms();
    }, []);

    const roomLabel = useMemo(
        () => rooms.find(r => r.id === roomId)?.name ?? 'Chọn phòng họp',
        [rooms, roomId]
    );

    const ymd = (d?: Date) => {
        if (!d) return '';
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const toHM = (h: number, m: number) =>
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const parseHM = (s: string) => {
        const [h, m] = s.split(':').map(n => parseInt(n, 10));
        return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
    };

    const isTimeRangeValid = (start: string, end: string) => {
        const { h: sh, m: sm } = parseHM(start);
        const { h: eh, m: em } = parseHM(end);
        const s = sh * 60 + sm;
        const e = eh * 60 + em;
        return e > s;
    };

    const handleSubmit = () => {
        setErr('');
        if (!roomId) return setErr('Vui lòng chọn phòng họp.');
        if (!dateObj) return setErr('Vui lòng chọn ngày.');
        if (!purpose.trim()) return setErr('Vui lòng nhập mục đích.');
        if (!isTimeRangeValid(startTime, endTime)) {
            return setErr('Giờ kết thúc phải sau giờ bắt đầu.');
        }

        const payload: SubmitPayload = {
            room_id: roomId,
            date: ymd(dateObj),
            start_time: startTime,
            end_time: endTime,
            purpose: purpose.trim(),
        };
        addItem(payload)
            .then(res => { showSnack(res.data.message, "success") })
            .catch(err => { showSnack("Có lỗi xảy ra", "error") })
    };

    // hiển thị thời gian đẹp
    const displayDate = useMemo(
        () => (dateObj ? dateObj.toLocaleDateString('vi-VN') : 'Chọn ngày'),
        [dateObj]
    );

    return (
        <>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Card style={styles.card}>
                    <Card.Title title="Thêm lịch phòng họp" />
                    <Card.Content>
                        {/* Phòng họp */}
                        <Text style={styles.label}>Phòng họp</Text>
                        <Button
                            mode="outlined"
                            onPress={() => setRoomDlg(true)}
                            style={styles.btn}
                            disabled={loadingRooms || (!!roomsErr && rooms.length === 0)}
                        >
                            {loadingRooms ? 'Đang tải phòng...' : roomLabel}
                        </Button>
                        {!!roomsErr && (
                            <HelperText type="error" visible style={{ marginTop: 4 }}>
                                {roomsErr}
                            </HelperText>
                        )}

                        {/* Ngày */}
                        <Text style={[styles.label, { marginTop: 10 }]}>Ngày</Text>
                        <Button mode="outlined" onPress={() => setOpenDate(true)} style={styles.btn}>
                            {displayDate}
                        </Button>

                        <Divider style={{ marginVertical: 12 }} />

                        {/* Giờ bắt đầu / kết thúc */}
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Giờ bắt đầu</Text>
                                <Button mode="outlined" onPress={() => setOpenStart(true)}>{startTime}</Button>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Giờ kết thúc</Text>
                                <Button mode="outlined" onPress={() => setOpenEnd(true)}>{endTime}</Button>
                            </View>
                        </View>

                        {/* Mục đích */}
                        <TextInput
                            label="Mục đích"
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            value={purpose}
                            onChangeText={setPurpose}
                            style={{ marginTop: 12 }}
                        />

                        {!!err && (
                            <HelperText type="error" visible={!!err} style={{ marginTop: 8 }}>
                                {err}
                            </HelperText>
                        )}

                        <Button mode="contained" style={{ marginTop: 16 }} onPress={handleSubmit}>
                            Thêm vào lịch
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* Dialog chọn phòng */}
            <Portal>
                <Dialog visible={roomDlg} onDismiss={() => setRoomDlg(false)}>
                    <Dialog.Title>Chọn phòng họp</Dialog.Title>
                    <Dialog.ScrollArea style={{ maxHeight: 360, paddingHorizontal: 0 }}>
                        {loadingRooms ? (
                            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                                <ActivityIndicator />
                                <Text style={{ marginTop: 8 }}>Đang tải phòng...</Text>
                            </View>
                        ) : rooms.length === 0 ? (
                            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                                <Text>Chưa có phòng nào.</Text>
                            </View>
                        ) : (
                            <RadioButton.Group
                                onValueChange={(val) => {
                                    setRoomId(val);
                                    setRoomDlg(false);
                                }}
                                value={roomId}
                            >
                                <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
                                    {rooms.map((r) => (
                                        <RadioButton.Item
                                            key={r.id}
                                            label={r.name}
                                            value={r.id}
                                            position="leading"
                                            style={{ paddingHorizontal: 16 }}
                                        />
                                    ))}
                                </ScrollView>
                            </RadioButton.Group>
                        )}
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setRoomDlg(false)}>Đóng</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* DatePicker */}
            <DatePickerModal
                locale="vi"
                mode="single"
                visible={openDate}
                date={dateObj ?? new Date()}
                onDismiss={() => setOpenDate(false)}
                onConfirm={({ date }) => {
                    if (date) setDateObj(date);
                    setOpenDate(false);
                }}
            />

            {/* Time pickers */}
            <TimePickerModal
                visible={openStart}
                onDismiss={() => setOpenStart(false)}
                onConfirm={({ hours, minutes }) => {
                    setStartTime(toHM(hours, minutes));
                    setOpenStart(false);
                }}
                label="Giờ bắt đầu"
            />
            <TimePickerModal
                visible={openEnd}
                onDismiss={() => setOpenEnd(false)}
                onConfirm={({ hours, minutes }) => {
                    setEndTime(toHM(hours, minutes));
                    setOpenEnd(false);
                }}
                label="Giờ kết thúc"
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12 },
    card: { borderRadius: 12 },
    label: { marginBottom: 6, fontWeight: '600' },
    btn: { alignSelf: 'flex-start' },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },
});

export default AddNew;
