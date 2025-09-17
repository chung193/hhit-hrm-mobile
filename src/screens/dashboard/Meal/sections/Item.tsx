import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImageViewing from "react-native-image-viewing";
import { UPLOAD_URL } from "@config/app";

const joinUrl = (base: string, img: string) => {
    if (!img) return "";
    if (/^(https?:)?\/\//i.test(img) || img.startsWith("data:image")) return img;
    const b = (base || "").replace(/\/+$/, "");
    const p = img.replace(/^\/+/, "");
    return `${b}/${p}`;
};

const rateCount = (number: number) => {
    const iconStyle = { marginHorizontal: 2 };
    const icons = [];
    if (number === 5) {
        icons.push(<Icon key="check" name="check" size={20} color="#e67e22" style={iconStyle} />);
        number = 4;
    }
    for (let i = 0; i < number; i++) {
        icons.push(<Icon key={`star-${i}`} name="star" size={20} color="#e67e22" style={iconStyle} />);
    }
    return <View style={styles.iconContainer}>{icons}</View>;
};

const Item = ({ item }: any) => {
    const { width } = useWindowDimensions();

    // chuẩn hóa danh sách ảnh
    const imageList: string[] = (item.imageList || "")
        .split(",")
        .map((x: string) => x.trim())
        .filter(Boolean);

    const images = React.useMemo(
        () => imageList.map((p) => ({ uri: joinUrl(UPLOAD_URL, p) })),
        [imageList]
    );

    const [visible, setVisible] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    const openViewer = (i: number) => {
        setIndex(i);
        setVisible(true);
        console.log("Open viewer index:", i); // debug
    };

    return (
        <View key={item.id} style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Đánh giá:</Text>
                {rateCount(Number(item.rate) || 0)}
            </View>

            {images.length > 0 && (
                <View style={styles.row}>
                    <Text style={styles.label}>Hình ảnh:</Text>
                    <View style={styles.thumbWrap}>
                        {images.map((img, i) => (
                            <TouchableOpacity key={`${img.uri}-${i}`} onPress={() => openViewer(i)} activeOpacity={0.8} style={styles.thumbBox}>
                                <Image
                                    source={{ uri: img.uri }}
                                    style={styles.thumb}
                                    resizeMode="cover"
                                    onError={(e) => console.log("Image error:", img.uri, e?.nativeEvent)}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Modal viewer */}
                    {visible && (
                        <ImageViewing
                            images={images}
                            imageIndex={index}
                            visible={visible}
                            onRequestClose={() => setVisible(false)}
                            presentationStyle="overFullScreen"
                            backgroundColor="black"
                        />
                    )}
                </View>
            )}

            <View style={styles.row}>
                <Text style={styles.label}>Nội dung:</Text>
                <RenderHtml contentWidth={Math.max(200, width - 150)} source={{ html: item.note || "" }} />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Người dùng:</Text>
                <Text>{item.user?.name}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Gửi vào: </Text>
                <Text>{new Date(item.created_at).toLocaleDateString("vi-VN")}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: "#f4f4f4", marginHorizontal: 10, marginVertical: 5, padding: 15, borderRadius: 8, borderWidth: 0.5, borderColor: "#ddd" },
    row: { flexDirection: "row", alignItems: "center", marginVertical: 4, flexWrap: "wrap" },
    label: { fontWeight: "bold", marginRight: 8, width: 120 },
    iconContainer: { flexDirection: "row", alignItems: "center" },
    thumbWrap: { flexDirection: "row", flexWrap: "wrap", marginLeft: 8 },
    thumbBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden", marginRight: 6, marginBottom: 6 },
    thumb: { width: 80, height: 80 },
});

export default Item;
