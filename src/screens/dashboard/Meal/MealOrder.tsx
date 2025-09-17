import * as React from 'react';
import { DataTable, Chip, Button, Checkbox } from 'react-native-paper';
import { mealOrderUser, deleteMultiMeal } from '@services/Meal';
import { useGlobalContext } from '@providers/GlobalProvider';
import { QRImage } from '@components/qrcode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewRefreshControl from '@components/background/ViewRefreshControl';

const HEADER_CELL_WIDTH = 56;

const MealOrder = () => {
    const navigation = useNavigation<{ navigate: (route: 'AddMealOrder' | 'MealRate') => void }>();
    const [orders, setOrders] = React.useState<any[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);

    const [selectedMap, setSelectedMap] = React.useState<Record<string, boolean>>({});
    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();

    const loadData = () => {
        mealOrderUser()
            .then((res: any) => {
                const list = res?.data?.data ?? [];
                setOrders(list);
                setSelectedMap((prev) => {
                    const next: Record<string, boolean> = {};
                    list.forEach((o: any) => { if (prev[o.id]) next[o.id] = true; });
                    return next;
                });
            })
            .catch((err: any) => showSnackbar(err?.message || 'Lỗi tải dữ liệu', 'error'));
    };

    React.useEffect(() => { loadData(); }, []);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, orders.length);
    const currentPageItems = React.useMemo(() => orders.slice(from, to), [orders, from, to]);

    React.useEffect(() => { setPage(0); }, [itemsPerPage]);

    const handleAddOrder = () => {
        // @ts-ignore
        navigation.navigate('AddMealOrder');
    };

    const isSelected = (id: string) => !!selectedMap[id];
    const toggleRow = (item: any) => {
        setSelectedMap((prev) => {
            const next = { ...prev };
            if (next[item.id]) delete next[item.id]; else next[item.id] = true;
            return next;
        });
    };

    // header checkbox state
    const numSelectedOnPage = currentPageItems.filter((it) => selectedMap[it.id]).length;
    const allSelectedOnPage = currentPageItems.length > 0 && numSelectedOnPage === currentPageItems.length;
    const noneSelectedOnPage = numSelectedOnPage === 0;
    const headerStatus: 'checked' | 'unchecked' | 'indeterminate' =
        allSelectedOnPage ? 'checked' : noneSelectedOnPage ? 'unchecked' : 'indeterminate';

    const toggleSelectAllOnPage = () => {
        setSelectedMap((prev) => {
            const next = { ...prev };
            if (allSelectedOnPage) {
                currentPageItems.forEach((it) => { delete next[it.id]; });
            } else {
                currentPageItems.forEach((it) => { next[it.id] = true; });
            }
            return next;
        });
    };

    const selectedIds: string[] = React.useMemo(
        () => orders.filter((o) => selectedMap[o.id]).map((o) => o.id),
        [orders, selectedMap]
    );
    const hasSelection = selectedIds.length > 0;

    const handleDelete = async () => {
        if (!hasSelection) return showSnackbar('Chưa chọn ngày nào.', 'info');
        try {
            showLoading?.();
            await deleteMultiMeal(selectedIds);
            showSnackbar('Đã xoá các ngày đã chọn hợp lệ (có thể có ngày không xoá được).', 'success');
            setSelectedMap({});
            loadData();
        } catch (e: any) {
            showSnackbar(e?.message || 'Xoá thất bại', 'error');
        } finally {
            hideLoading?.();
        }
    };

    return (
        <ViewRefreshControl onRefresh={loadData}>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={handleAddOrder}>
                    Đăng ký
                </Button>
                <Button mode="contained-tonal" icon="star" style={styles.button} onPress={() => {
                    navigation.navigate('MealRate');
                }}>
                    Đánh giá
                </Button>
                <Button
                    mode="contained"
                    icon="delete"
                    style={styles.button}
                    disabled={!hasSelection}
                    onPress={handleDelete}
                >
                    Xóa {hasSelection ? `(${selectedIds.length})` : ''}
                </Button>
            </View>

            <DataTable>
                {/* Dùng Cell cho ô checkbox header để không bị Text cắt */}
                <DataTable.Header style={styles.headerRow}>
                    <DataTable.Cell style={styles.checkboxCellHeader}>
                        <Checkbox status={headerStatus} onPress={toggleSelectAllOnPage} />
                    </DataTable.Cell>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Mã QR</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Ngày</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Trạng thái</DataTable.Title>
                </DataTable.Header>

                {currentPageItems.map((item: any) => (
                    <DataTable.Row key={item.id} style={{ height: 120 }}>
                        <DataTable.Cell style={styles.checkboxCellBody}>
                            <Checkbox
                                status={isSelected(item.id) ? 'checked' : 'unchecked'}
                                onPress={() => toggleRow(item)}
                            />
                        </DataTable.Cell>

                        <DataTable.Cell>
                            <QRImage qrUrl={item.qr_code} />
                        </DataTable.Cell>

                        <DataTable.Cell>{new Date(item.date).toLocaleDateString('vi-VN')}</DataTable.Cell>

                        <DataTable.Cell style={styles.cell}>
                            {item.status ? (
                                <Chip
                                    icon={() => <Icon name="check" size={20} color="#ffffff" />}
                                    mode="flat"
                                    textStyle={{ color: '#fff' }}
                                    style={{ backgroundColor: '#2980b9' }}
                                >
                                    Done
                                </Chip>
                            ) : (
                                <Chip
                                    icon={() => <Icon name="close" size={20} color="#ffffff" />}
                                    mode="flat"
                                    textStyle={{ color: '#fff' }}
                                    style={{ backgroundColor: '#e67e22' }}
                                >
                                    Waiting
                                </Chip>
                            )}
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(orders.length / itemsPerPage)}
                    onPageChange={(p) => setPage(p)}
                    label={`${from + 1}-${to} of ${orders.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </ViewRefreshControl>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        minHeight: 56,              // chiều cao header chuẩn MD
        paddingHorizontal: 0,
    },
    cell: { justifyContent: 'flex-start' },
    checkboxCellHeader: {
        flex: 0,
        width: HEADER_CELL_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    checkboxCellBody: {
        flex: 0,
        width: HEADER_CELL_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    textCenter: { textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold' },
    controlView: { flexDirection: 'row', marginVertical: 10 },
    button: { marginVertical: 5, marginHorizontal: 5, maxWidth: 180 },
});

export default MealOrder;
