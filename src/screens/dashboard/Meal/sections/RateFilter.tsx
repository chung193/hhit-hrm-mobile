import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, Divider, Text } from 'react-native-paper';
import renderStars from './renderStars'; // từ file ở trên

const RateFilter = ({ onSelectRate }) => {
    const [visible, setVisible] = useState(false);
    const [selectedRate, setSelectedRate] = useState(null);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSelect = (value) => {
        setSelectedRate(value);
        onSelectRate(value);
        closeMenu();
    };

    return (
        <View style={styles.container}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button mode="outlined" onPress={openMenu}>
                    {selectedRate ? `Rated: ${selectedRate}` : 'Chọn mức đánh giá'}
                </Button>}>
                {[1, 2, 3, 4, 5].map(rate => (
                    <Menu.Item
                        key={rate}
                        onPress={() => handleSelect(rate)}
                        title={() => renderStars(rate)}
                    />
                ))}
                <Divider />
                <Menu.Item onPress={() => handleSelect(null)} title="Xoá bộ lọc" />
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default RateFilter;
