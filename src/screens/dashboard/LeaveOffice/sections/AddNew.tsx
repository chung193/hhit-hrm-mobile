// AddLeaveRequestScreen.tsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import {
    Text, Button, TextInput, Card, Divider,
    Portal, Dialog, RadioButton
} from 'react-native-paper';
import { DatePickerModal, TimePickerModal, registerTranslation } from 'react-native-paper-dates';
import { profile } from '@services/User';
import { getAllCatalogRequest } from '@services/CatalogRequest'; // giữ đúng path anh đang dùng
import { getManagerGroup } from '@services/Group';               // giữ đúng path anh đang dùng
import { useGlobalContext } from '@providers/GlobalProvider';
import { createRequest } from '@services/Request'
import { BackButton } from '@components/backButton';
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

type CatalogItem = { id: string; name: string };
type Approver = { id: string; name: string };
type User = { id: string; name?: string;[k: string]: any };

const BUSINESS_START = 8;
const BUSINESS_END = 17;

const AddLeaveRequestScreen: React.FC<{ route?: any; navigation?: any }> = ({ navigation }) => {
    const { showSnackbar, showLoading, hideLoading } = useGlobalContext();

    const [user, setUser] = useState<User | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const [catalogRequestList, setCatalogRequestList] = useState<CatalogItem[]>([]);
    const [userList, setUserList] = useState<Approver[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [approvedBy, setApprovedBy] = useState<string>('');
    const [details, setDetails] = useState<string>('');

    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());

    // Dialogs thay cho Menu
    const [catDialogVisible, setCatDialogVisible] = useState(false);
    const [approverDialogVisible, setApproverDialogVisible] = useState(false);

    // Date/Time modals
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);

    // giữ ref cho hàm context để tránh loop
    const showSnackbarRef = useRef(showSnackbar);
    const showLoadingRef = useRef(showLoading);
    const hideLoadingRef = useRef(hideLoading);
    useEffect(() => { showSnackbarRef.current = showSnackbar; }, [showSnackbar]);
    useEffect(() => { showLoadingRef.current = showLoading; }, [showLoading]);
    useEffect(() => { hideLoadingRef.current = hideLoading; }, [hideLoading]);

    const formatDate = (d?: Date) => (d ? d.toLocaleDateString('vi-VN') : '');
    const formatTime = (d?: Date) => (d ? d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '');

    const selectedCategoryLabel = useMemo(
        () => catalogRequestList.find((x) => x.id === selectedCategory)?.name ?? 'Chọn danh mục nghỉ phép',
        [catalogRequestList, selectedCategory]
    );
    const selectedApproverLabel = useMemo(
        () => userList.find((x) => x.id === approvedBy)?.name ?? 'Chọn người duyệt',
        [userList, approvedBy]
    );

    // fetch 1 lần, tránh deps gây loop
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setRefreshing(true);
                showLoadingRef.current?.();
                const [p, c, g] = await Promise.all([
                    profile(),
                    getAllCatalogRequest(),
                    getManagerGroup('9e3efc4a-5075-491b-969f-f0371fbfb3ea'),
                ]);
                if (!mounted) return;
                setUser(p?.data?.data ?? null);
                setCatalogRequestList(c?.data?.data ?? []);
                setUserList(g?.data?.data ?? []);
            } catch (err: any) {
                showSnackbarRef.current?.(err?.response?.data?.message || err?.message || 'Lỗi tải dữ liệu', 'error');
            } finally {
                if (mounted) setRefreshing(false);
                hideLoadingRef.current?.();
            }
        })();
        return () => { mounted = false; };
    }, []);

    const onRefresh = () => {
        let mounted = true;
        (async () => {
            try {
                setRefreshing(true);
                showLoadingRef.current?.();
                const [p, c, g] = await Promise.all([
                    profile(),
                    getAllCatalogRequest(),
                    getManagerGroup('9e3efc4a-5075-491b-969f-f0371fbfb3ea'),
                ]);
                if (!mounted) return;
                setUser(p?.data?.data ?? null);
                setCatalogRequestList(c?.data?.data ?? []);
                setUserList(g?.data?.data ?? []);
            } catch (err: any) {
                showSnackbarRef.current?.(err?.response?.data?.message || err?.message || 'Lỗi tải dữ liệu', 'error');
            } finally {
                if (mounted) setRefreshing(false);
                hideLoadingRef.current?.();
            }
        })();
    };

    const businessHours = useMemo(() => {
        if (!(start && end) || +start >= +end) return 0;
        let total = 0;
        let cur = new Date(start);
        cur.setHours(BUSINESS_START, 0, 0, 0);
        while (+cur < +end) {
            const hour = cur.getHours();
            if (+cur > +start && hour >= BUSINESS_START && hour < BUSINESS_END) total++;
            cur = new Date(cur.getTime() + 60 * 60 * 1000);
        }
        return total;
    }, [start, end]);

    const formatYMD = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const onSubmit = () => {
        if (!user?.id) return showSnackbarRef.current?.('Thiếu thông tin người dùng', 'error');
        if (!selectedCategory) return showSnackbarRef.current?.('Chọn danh mục nghỉ phép', 'error');
        if (!approvedBy) return showSnackbarRef.current?.('Chọn người duyệt', 'error');
        if (+start >= +end) return showSnackbarRef.current?.('Thời gian bắt đầu phải trước kết thúc', 'error');

        const payload = {
            user_id: user.id,
            approved_by: approvedBy,
            category_id: selectedCategory,
            content: details,
            start_time: formatYMD(start),
            end_time: formatYMD(end),
        };

        //externalSubmit(payload);
        createRequest(payload)
            .then((res) => {
                showSnackbar('Đăng ký thành công', 'success')
            })
            .catch((err) => {
                console.log('Lỗi ', err)
                showSnackbar('Lỗi đăng ký', 'error')
            })
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyboardShouldPersistTaps="handled"
            >
                <Card style={styles.card}>
                    <BackButton goBack={() => {
                        navigation.navigate('Request')
                    }} />
                    <Card.Title title="Tạo mới đơn nghỉ phép" />
                    <Card.Content>
                        {/* Danh mục nghỉ phép */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Danh mục nghỉ phép</Text>
                            <Button mode="outlined" onPress={() => setCatDialogVisible(true)} style={{ alignSelf: 'flex-start' }}>
                                {selectedCategoryLabel}
                            </Button>
                        </View>

                        {/* Người duyệt */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Gửi tới</Text>
                            <Button mode="outlined" onPress={() => setApproverDialogVisible(true)} style={{ alignSelf: 'flex-start' }}>
                                {selectedApproverLabel}
                            </Button>
                        </View>

                        {/* Nội dung */}
                        <TextInput
                            label="Nội dung"
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            value={details}
                            onChangeText={setDetails}
                            style={{ marginTop: 8 }}
                        />

                        <Divider style={{ marginVertical: 12 }} />

                        {/* Bắt đầu */}
                        <Text style={styles.label}>Bắt đầu</Text>
                        <View style={styles.inlineRow}>
                            <Button mode="outlined" onPress={() => setOpenStartDate(true)} style={styles.flex1}>
                                {formatDate(start) || 'Chọn ngày'}
                            </Button>
                            <Button mode="outlined" onPress={() => setOpenStartTime(true)} style={styles.flex1}>
                                {formatTime(start) || 'Chọn giờ'}
                            </Button>
                        </View>

                        {/* Kết thúc */}
                        <Text style={[styles.label, { marginTop: 8 }]}>Kết thúc</Text>
                        <View style={styles.inlineRow}>
                            <Button mode="outlined" onPress={() => setOpenEndDate(true)} style={styles.flex1}>
                                {formatDate(end) || 'Chọn ngày'}
                            </Button>
                            <Button mode="outlined" onPress={() => setOpenEndTime(true)} style={styles.flex1}>
                                {formatTime(end) || 'Chọn giờ'}
                            </Button>
                        </View>

                        {/* Date/Time pickers */}
                        <DatePickerModal
                            locale="vi"
                            mode="single"
                            visible={openStartDate}
                            date={start}
                            onDismiss={() => setOpenStartDate(false)}
                            onConfirm={({ date }) => {
                                if (date) {
                                    const d = new Date(start);
                                    d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                    setStart(d);
                                }
                                setOpenStartDate(false);
                            }}
                        />
                        <TimePickerModal
                            visible={openStartTime}
                            onDismiss={() => setOpenStartTime(false)}
                            onConfirm={({ hours, minutes }) => {
                                const d = new Date(start);
                                d.setHours(hours, minutes, 0, 0);
                                setStart(d);
                                setOpenStartTime(false);
                            }}
                            label="Giờ bắt đầu"
                        />

                        <DatePickerModal
                            locale="vi"
                            mode="single"
                            visible={openEndDate}
                            date={end}
                            onDismiss={() => setOpenEndDate(false)}
                            onConfirm={({ date }) => {
                                if (date) {
                                    const d = new Date(end);
                                    d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                    setEnd(d);
                                }
                                setOpenEndDate(false);
                            }}
                        />
                        <TimePickerModal
                            visible={openEndTime}
                            onDismiss={() => setOpenEndTime(false)}
                            onConfirm={({ hours, minutes }) => {
                                const d = new Date(end);
                                d.setHours(hours, minutes, 0, 0);
                                setEnd(d);
                                setOpenEndTime(false);
                            }}
                            label="Giờ kết thúc"
                        />

                        {/* Tổng số giờ */}
                        <View style={{ marginTop: 12 }}>
                            <Text>
                                <Text style={{ fontWeight: 'bold' }}>Số giờ: </Text>{businessHours} giờ
                            </Text>
                        </View>

                        {/* Submit */}
                        <Button mode="contained" style={{ marginTop: 16 }} onPress={onSubmit}>
                            Gửi đi
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* ===== DIALOG CHỌN DANH MỤC ===== */}
            <Portal>
                <Dialog visible={catDialogVisible} onDismiss={() => setCatDialogVisible(false)}>
                    <Dialog.Title>Chọn danh mục nghỉ phép</Dialog.Title>
                    <Dialog.ScrollArea style={{ maxHeight: 360, paddingHorizontal: 0 }}>
                        <RadioButton.Group
                            onValueChange={(val) => {
                                setSelectedCategory(val);
                                setCatDialogVisible(false);
                            }}
                            value={selectedCategory}
                        >
                            <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
                                {catalogRequestList.map((opt) => (
                                    <RadioButton.Item
                                        key={opt.id}
                                        label={opt.name}
                                        value={opt.id}
                                        position="leading"
                                        style={{ paddingHorizontal: 16 }}
                                    />
                                ))}
                            </ScrollView>
                        </RadioButton.Group>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setCatDialogVisible(false)}>Đóng</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* ===== DIALOG CHỌN NGƯỜI DUYỆT ===== */}
            <Portal>
                <Dialog visible={approverDialogVisible} onDismiss={() => setApproverDialogVisible(false)}>
                    <Dialog.Title>Chọn người duyệt</Dialog.Title>
                    <Dialog.ScrollArea style={{ maxHeight: 360, paddingHorizontal: 0 }}>
                        <RadioButton.Group
                            onValueChange={(val) => {
                                setApprovedBy(val);
                                setApproverDialogVisible(false);
                            }}
                            value={approvedBy}
                        >
                            <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
                                {userList.map((opt) => (
                                    <RadioButton.Item
                                        key={opt.id}
                                        label={opt.name}
                                        value={opt.id}
                                        position="leading"
                                        style={{ paddingHorizontal: 16 }}
                                    />
                                ))}
                            </ScrollView>
                        </RadioButton.Group>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setApproverDialogVisible(false)}>Đóng</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12 },
    card: { borderRadius: 12 },
    field: { marginBottom: 12 },
    label: { marginBottom: 6, fontWeight: '600' },
    inlineRow: { flexDirection: 'row', gap: 8 },
    flex1: { flex: 1 },
});

export default AddLeaveRequestScreen;
