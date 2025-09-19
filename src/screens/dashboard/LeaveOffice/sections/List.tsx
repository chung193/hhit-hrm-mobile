import { useState, useEffect } from 'react';
import { DataTable, Chip, Button, Checkbox } from 'react-native-paper';
import { useGlobalContext } from '@providers/GlobalProvider';
import { QRImage } from '@components/qrcode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, ScrollView, View } from 'react-native';
import { getAllRequest } from '@services/Request'
import ViewRefreshControl from '@components/background/ViewRefreshControl';

const List = (props) => {
    const [requests, setRequest] = useState([])
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 15]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const { showLoading, hideLoading, showSnackbar } = useGlobalContext();

    const loadData = () => {
        showLoading()
        getAllRequest()
            .then(res => {
                setRequest(res.data.data)
                console.log(res.data.data)
                hideLoading()
            })
            .catch(err => {
                console.log(err)
                hideLoading()
                showSnackbar(err.message, 'error')
            })
    }


    useEffect(() => {
        loadData()
    }, []);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, requests.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleAdd = () => {
        props.navigation.navigate('RequestLeaveOffice')
    }

    return (
        <ViewRefreshControl onRefresh={loadData}>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={() => handleAdd()}>Đăng ký</Button>
                <Button mode="contained" icon="delete" style={styles.button}>Xóa</Button>
            </View>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Trạng thái</DataTable.Title>
                    <DataTable.Title style={styles.cell} textStyle={styles.textCenter}>Ngày</DataTable.Title>
                </DataTable.Header>

                {requests.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} style={{ height: 120 }}>

                        <DataTable.Cell>{new Date(item.start_time).toLocaleDateString('vi-VN')} - {new Date(item.end_time).toLocaleDateString('vi-VN')}</DataTable.Cell>
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
                    numberOfPages={Math.ceil(requests.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${requests.length}`}
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

export default List;