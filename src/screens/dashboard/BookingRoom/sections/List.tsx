import * as React from 'react';
import { DataTable, Chip, Button, Checkbox } from 'react-native-paper';
import { statics, addItem, filter, mealOrderUser, approveBooking } from '@services/BookingRoom'
import { useGlobalContext } from '@providers/GlobalProvider';
import { QRImage } from '@components/qrcode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import ViewRefreshControl from '@components/background/ViewRefreshControl';

const List = (props) => {
    const [orders, setOrders] = React.useState([])
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );

    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();

    const loadData = () => {
        showLoading()
        statics()
            .then(res => {
                setOrders(res.data.data.all_booking_rooms)
                console.log('orders:', res.data.data.all_booking_rooms);
                hideLoading()
            })
            .catch(err => {
                hideLoading()
                console.log('Lỗi', err)
                showSnackbar(err.message, 'error')
            })
    }

    React.useEffect(() => {
        loadData()
    }, []);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, orders.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleAddOrder = () => {
        props.navigation.navigate('AddNewOrderRoom')
    }

    return (
        <ViewRefreshControl onRefresh={loadData}>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={() => handleAddOrder()}>Đăng ký</Button>
                <Button mode="contained" icon="delete" style={styles.button}>Xóa</Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator>
                {/* 👇 Đặt minWidth / width lớn hơn màn hình để kích hoạt scroll */}
                <View>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={[styles.colCheck, styles.noPad]}>#</DataTable.Title>

                            <DataTable.Title style={[styles.colContent, styles.noPad]}>
                                <Text style={styles.headerCenter}>Nội dung</Text>
                            </DataTable.Title>

                            <DataTable.Title style={[styles.colDate, styles.noPad]}>
                                <Text style={styles.headerCenter}>Ngày</Text>
                            </DataTable.Title>

                            <DataTable.Title style={[styles.colStatus, styles.noPad]}>
                                <Text style={styles.headerCenter}>Trạng thái</Text>
                            </DataTable.Title>
                        </DataTable.Header>

                        {orders.slice(from, to).map((item) => (
                            <DataTable.Row key={item.id} style={{ height: 120 }}>
                                <DataTable.Cell style={styles.colCheck}>
                                    <Checkbox.Item label='' status='unchecked' onPress={() => { }} />
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.colContent}>
                                    <Text numberOfLines={2} ellipsizeMode="tail">{item.purpose}</Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.colDate}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>{item.start_time} - {item.end_time}</Text>
                                        <Text>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
                                    </View>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.colStatus}>
                                    {item.status ? (
                                        <Chip icon={() => <Icon name="check" size={20} color="#fff" />} textStyle={{ color: '#fff' }} style={{ backgroundColor: '#2980b9' }}>Done</Chip>
                                    ) : (
                                        <Chip icon={() => <Icon name="close" size={20} color="#fff" />} textStyle={{ color: '#fff' }} style={{ backgroundColor: '#e67e22' }}>Waiting</Chip>
                                    )}
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}


                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(orders.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
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
        </ViewRefreshControl >
    );
};

const styles = StyleSheet.create({
    // CỘT
    colCheck: { flex: 0, width: 50, justifyContent: 'center', alignItems: 'center' },
    colContent: { flex: 0, width: 360, justifyContent: 'center', alignItems: 'center' },
    colDate: { flex: 0, width: 220, justifyContent: 'center', alignItems: 'center' },
    colStatus: { flex: 0, width: 160, justifyContent: 'center', alignItems: 'center' },

    // XÓA padding mặc định của Title
    noPad: { paddingHorizontal: 0 },

    // TEXT tiêu đề: chiếm full chiều ngang cột + canh giữa
    headerCenter: {
        width: '100%',
        textAlign: 'center',
        // với Android đôi khi thêm dòng dưới sẽ “đẹp” hơn:
        // textAlignVertical: 'center',
    },
    controlView: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 10,
    },
    button: {
        marginVertical: 5,
        marginHorizontal: 5,
        maxWidth: 150,
    },

});

export default List;