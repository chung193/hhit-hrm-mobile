import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const renderStars = (number) => {
    const stars = [];

    if (number === 1) return <Icon key="check" name="check" size={20} color="#000" />;

    if (number === 5) stars.push(<Icon key="check" name="check" size={20} color="#000" />);

    const count = number === 5 ? 4 : number;

    for (let i = 0; i < count; i++) {
        stars.push(<Icon key={i} name="star" size={20} color="#000" />);
    }

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
};

export default renderStars;
