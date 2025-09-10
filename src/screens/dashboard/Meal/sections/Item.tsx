import { StyleSheet, View } from "react-native"
import { Text, Chip } from "react-native-paper"
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';

const rateCount = (number) => {
    const iconStyle = { marginHorizontal: 2 };
    const icons = [];

    if (number === 5) {
        icons.push(<Icon key="check" name="check" size={20} color="#e67e22" style={iconStyle} />);
        number = 4;
    }

    for (let i = 0; i < number; i++) {
        icons.push(
            <Icon key={`star-${i}`} name="star" size={20} color="#e67e22" style={iconStyle} />
        );
    }

    return <View style={styles.iconContainer}>{icons}</View>;
};

const Item = ({ item }) => {
    return (<View key={item.id} style={styles.card}>
        <View style={styles.row}>
            <Text style={styles.label}>Đánh giá:</Text>
            {rateCount(item.rate)}
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Nội dung:</Text>
            <RenderHtml contentWidth={300} source={{ html: item.note || '' }} />
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Người dùng:</Text>
            <Text>{item.user?.name}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Gửi vào: </Text>
            <Text>{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
        </View>
    </View>)
}

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

export default Item;