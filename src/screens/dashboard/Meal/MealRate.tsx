import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { getAll } from '@services/MealRate';
import { useGlobalContext } from '@providers/GlobalProvider';
import Item from './sections/Item';
import ViewRefreshControl from '@components/background/ViewRefreshControl';

type RateItem = {
    id: string;
    rate: number; // 1..5
};

const MealRate = () => {
    const [rates, setRates] = React.useState<RateItem[]>([]);
    const [filterRate, setFilterRate] = React.useState<null | 1 | 2 | 3 | 4 | 5>(null);
    const { showSnackbar } = useGlobalContext();

    const loadData = React.useCallback(() => {
        getAll()
            .then((res: any) => {
                // API: res.data.data.data là list
                const list: RateItem[] = res?.data?.data?.data ?? [];
                setRates(list);
            })
            .catch((err: any) => {
                showSnackbar(err?.message || 'Lỗi tải đánh giá', 'error');
            })
            .finally(() => { });
    }, [showSnackbar]);

    React.useEffect(() => {
        loadData();
    }, []);

    // Đếm số lượng từng mức 1..5 từ dữ liệu hiện có
    const counts = React.useMemo(() => {
        const c: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const r of rates) {
            const k = Math.max(1, Math.min(5, Number(r.rate) || 0)) as 1 | 2 | 3 | 4 | 5;
            c[k] += 1;
        }
        return c;
    }, [rates]);

    // List hiển thị sau khi lọc
    const visibleRates = React.useMemo(() => {
        if (filterRate == null) return rates;
        return rates.filter((r) => r.rate === filterRate);
    }, [rates, filterRate]);

    // Đổi filter; bấm lại cùng nút để bỏ lọc
    const handleFilter = (value: null | 1 | 2 | 3 | 4 | 5) => {
        setFilterRate((prev) => (prev === value ? null : value));
    };

    const handleAddRate = () => {
        // navigation.navigate('AddMealRate');
    };

    return (
        <ViewRefreshControl onRefresh={loadData}>
            <View style={styles.controlView}>
                <Button mode="contained-tonal" icon="plus" style={styles.button} onPress={handleAddRate}>
                    Thêm đánh giá
                </Button>

                {rates.length > 0 && (
                    <>
                        <Button
                            mode={filterRate === null ? 'contained' : 'outlined'}
                            style={styles.button}
                            onPress={() => handleFilter(null)}
                        >
                            Tất cả ({rates.length})
                        </Button>

                        {[1, 2, 3, 4, 5].map((n) => (
                            <Button
                                key={n}
                                mode={filterRate === n ? 'contained' : 'outlined'}
                                style={styles.button}
                                disabled={counts[n as 1 | 2 | 3 | 4 | 5] === 0}
                                onPress={() => handleFilter(n as 1 | 2 | 3 | 4 | 5)}
                            >
                                {n} sao ({counts[n as 1 | 2 | 3 | 4 | 5]})
                            </Button>
                        ))}
                    </>
                )}
            </View>

            {visibleRates.map((item) => (
                <Item item={item} key={item.id} />
            ))}
        </ViewRefreshControl>
    );
};

const styles = StyleSheet.create({
    controlView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        alignItems: 'center',
    },
    button: {
        margin: 5,
    },
});

export default MealRate;
