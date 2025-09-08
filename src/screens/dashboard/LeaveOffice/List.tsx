import { Text } from 'react-native-paper';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import * as React from 'react';
import { DataTable, Chip, Button } from 'react-native-paper';
import { getAllRequest } from '@services/LeaveOffice'
import { useGlobalContext } from '@providers/GlobalProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLS = {
    content: 130,
    start: 100,
    end: 100,
    status: 100
};

const List = () => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData();
        setRefreshing(false);
    }, []);

    const [orders, setOrders] = React.useState([]);
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);

    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();

    const loadData = () => {
        getAllRequest()
            .then(res => {
                setOrders(res.data.data);
            })
            .catch(err => {
                showSnackbar(err.message, 'error');
            })
    };

    React.useEffect(() => { loadData(); }, []);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, orders.length);

    React.useEffect(() => { setPage(0); }, [itemsPerPage]);

    const handleAddOrder = () => { };

    return (
        <ScrollView
            contentContainerStyle={[styles.scrollView, { alignItems: 'stretch' }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={handleAddOrder}>Đăng ký</Button>
                <Button mode="contained" icon="delete" style={styles.button}>Xóa</Button>
            </View>

            {/* Bọc bảng trong horizontal ScrollView để hỗ trợ cột rộng */}
            <ScrollView horizontal showsHorizontalScrollIndicator>
                <View style={{ minWidth: COLS.content + COLS.start + COLS.end + COLS.status }}>
                    <DataTable>

                        <DataTable.Header>
                            <DataTable.Title
                                style={[styles.colBase, { width: COLS.content }]}
                                textStyle={styles.textCenter}
                            >
                                Nội dung
                            </DataTable.Title>

                            <DataTable.Title
                                style={[styles.colCenter, { width: COLS.start }]}
                                textStyle={styles.textCenter}
                            >
                                Bắt đầu
                            </DataTable.Title>

                            <DataTable.Title
                                style={[styles.colCenter, { width: COLS.end }]}
                                textStyle={styles.textCenter}
                            >
                                Kết thúc
                            </DataTable.Title>

                            {/* Thêm header cho cột Status để khớp số cột */}
                            <DataTable.Title
                                style={[styles.colCenter, { width: COLS.status }]}
                                textStyle={styles.textCenter}
                            >
                                Trạng thái
                            </DataTable.Title>
                        </DataTable.Header>

                        {orders.slice(from, to).map((item) => (
                            <DataTable.Row key={item.id} style={{ height: 120 }}>
                                <DataTable.Cell style={[styles.colBase, { width: COLS.content }]}>
                                    <Text>{item.content}</Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={[styles.colCenter, { width: COLS.start }]}>
                                    <Text>{new Date(item.start_time).toLocaleDateString('vi-VN')}</Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={[styles.colCenter, { width: COLS.end }]}>
                                    <Text>{new Date(item.end_time).toLocaleDateString('vi-VN')}</Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={[styles.colCenter, { width: COLS.status }]}>
                                    {item.status ? (
                                        <Chip
                                            icon={() => <Icon name="check" size={20} color="#ffffff" />}
                                            mode="flat"
                                            onPress={() => { }}
                                            textStyle={{ color: '#fff' }}
                                            style={{ backgroundColor: '#2980b9' }}
                                        >
                                            Done
                                        </Chip>
                                    ) : (
                                        <Chip
                                            icon={() => <Icon name="close" size={20} color="#ffffff" />}
                                            mode="flat"
                                            onPress={() => { }}
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
                </View>
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        // alignItems: 'center', // bỏ cái này để tránh bóp ngang
        justifyContent: 'center'
    },
    controlView: {
        flexDirection: 'row',
        marginVertical: 10
    },
    button: {
        marginVertical: 5,
        marginHorizontal: 5,
        maxWidth: 150
    },
    textCenter: {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },

    // Base cho cột nội dung: tắt flex để width cố định
    colBase: {
        flex: 0,
        justifyContent: 'flex-start' // text trái, tuỳ anh đổi 'center'
    },
    // Cột cần căn giữa
    colCenter: {
        flex: 0,
        justifyContent: 'center'
    }
});

export default List;
