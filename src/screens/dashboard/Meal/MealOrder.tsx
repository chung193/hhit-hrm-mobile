import * as React from 'react';
import { DataTable, Chip, Button, Checkbox } from 'react-native-paper';
import { getAllMeal, deleteMultiMeal, updateMeal, mealOrderUser, searchMeal, mealAddOrder, getMealOrderFilter } from '@services/Meal'
import { useGlobalContext } from '@providers/GlobalProvider';
import { QRImage } from '@components/qrcode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, ScrollView, View } from 'react-native';
import RegMealModal from './RegMealModal';

const MealOrder = () => {
    const [orders, setOrders] = React.useState([])
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );

    const { showLoading, hideLoading, showSnackbar, openModal, closeModal } = useGlobalContext();

    const loadData = () => {
        showLoading()
        mealOrderUser()
            .then(res => {
                setOrders(res.data.data)
                console.log('Meal orders:', res.data.data);
                hideLoading()
            })
            .catch(err => {
                hideLoading()
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
        openModal(
            <RegMealModal />,
            () => {
                console.log('Modal closed');
                closeModal();
            },
            () => {
                console.log('Modal opened');
            }
        )
    }

    return (
        <ScrollView>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="replay" style={styles.button} onPress={() => loadData()}>Tải lại</Button>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={() => handleAddOrder()}>Đăng ký</Button>
                <Button mode="contained" icon="delete" style={styles.button}>Xóa</Button>
            </View>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.checkboxCell} textStyle={styles.textCenter}>#</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Mã QR</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Ngày</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Trạng thái</DataTable.Title>
                </DataTable.Header>

                {orders.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} style={{ height: 120 }}>
                        <DataTable.Cell style={styles.checkboxCell}>
                            <Checkbox.Item label='' status='unchecked'
                                onPress={() => {
                                }
                                }
                            />
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <QRImage
                                qrUrl={item.qr_code}
                            />
                        </DataTable.Cell>
                        <DataTable.Cell>{new Date(item.date).toLocaleDateString('vi-VN')}</DataTable.Cell>
                        <DataTable.Cell style={styles.cell}>
                            {item.status ?
                                <Chip
                                    icon={() => (
                                        <Icon name="check" size={20} color="#ffffff" />
                                    )}
                                    mode="flat"
                                    onPress={() => console.log('Pressed')}
                                    textStyle={{ color: '#fff' }}
                                    style={{
                                        backgroundColor: '#2980b9',
                                    }}
                                >
                                    Done
                                </Chip> :
                                <Chip
                                    icon={() => (
                                        <Icon name="close" size={20} color="#ffffff" />
                                    )}
                                    mode="flat"
                                    onPress={() => console.log('Pressed')}
                                    textStyle={{ color: '#fff' }}
                                    style={{
                                        backgroundColor: '#e67e22',
                                    }}
                                >
                                    Waiting
                                </Chip>}
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f5f5f5',
    },
    cell: {
        justifyContent: 'flex-start',
    },
    checkboxCell: {
        flex: 0,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCenter: {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
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
    }
});

export default MealOrder;