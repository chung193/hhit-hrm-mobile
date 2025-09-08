import React, { useState } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegMealModal = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(true);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios'); // iOS sẽ giữ picker mở
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShowPicker(true);
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Đăng ký bữa ăn</Text>
            <Button onPress={showDatepicker} title="Chọn ngày" />

            <Text style={{ marginVertical: 20, fontSize: 18 }}>
                Ngày đã chọn: {date.toLocaleDateString()}
            </Text>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default" // Hoặc 'spinner', 'calendar'
                    onChange={onChange}
                    locale="vi-VN"
                />
            )}
        </View>
    )
}

export default RegMealModal;