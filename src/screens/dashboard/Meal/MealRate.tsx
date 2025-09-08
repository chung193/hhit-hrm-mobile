import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import { getAll } from '@services/MealRate';
import { useGlobalContext } from '@providers/GlobalProvider';
import RegMealModal from './RegMealModal';
import Item from './sections/Item';

const MealRate = () => {
    const [rates, setRates] = React.useState([]);
    const { showLoading, hideLoading, showSnackbar, openModal, closeModal } = useGlobalContext();

    const loadData = () => {
        showLoading();
        getAll()
            .then(res => {
                setRates(res.data.data.data);
                console.log(res.data.data.data)
                hideLoading();
            })
            .catch(err => {
                hideLoading();
                showSnackbar(err.message, 'error');
            });
    };

    React.useEffect(() => {
        loadData();
    }, []);


    const handleAddOrder = () => {
        openModal(
            <RegMealModal />,
            () => closeModal(),
            () => console.log('Modal opened')
        );
    };

    return (
        <ScrollView>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="replay" style={styles.button} onPress={loadData}>Tải lại</Button>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={handleAddOrder}>Thêm đánh giá</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>Tất cả</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>1 sao ()</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>2 sao ()</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>3 sao ()</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>4 sao ()</Button>
                <Button mode="contained-tonal" style={styles.button} onPress={handleAddOrder}>5 sao ()</Button>
            </View>

            {rates && rates.map((item) => (
                <Item item={item} key={item.id} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    controlView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    button: {
        margin: 5,
    },
    card: {
        backgroundColor: '#f4f4f4',
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        flexWrap: 'wrap',
    },
    label: {
        fontWeight: 'bold',
        marginRight: 8,
        width: 120,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default MealRate;
