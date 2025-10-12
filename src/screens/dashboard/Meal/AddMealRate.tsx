import React, { useMemo, useState } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import {
    Card,
    Text,
    Button,
    TextInput,
    HelperText,
    useTheme,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 👉 Nếu dùng bare RN:
import {
    launchImageLibrary,
    ImageLibraryOptions,
    Asset,
} from 'react-native-image-picker';

// 👉 Nếu dùng Expo Managed, thay bằng:
// import * as ImagePicker from 'expo-image-picker';

type Props = {
    handleSubmit: (e: any, payload: { note: string; rate: number; images: Asset[] }) => void;
};

const AddNewModal: React.FC<Props> = ({ handleSubmit }) => {
    const theme = useTheme();
    const [note, setNote] = useState<string>('');
    const [rate, setRate] = useState<number>(1);
    const [images, setImages] = useState<Asset[]>([]);
    const [err, setErr] = useState<string>('');

    const submit = () => {
        setErr('');
        if (!rate) return setErr('Vui lòng chọn số sao.');
        if (!note.trim()) return setErr('Vui lòng nhập nội dung.');

        // Gọi y như web: handleSubmit(e, rateObj)
        const payload = { note: note.trim(), rate, images };
        handleSubmit?.(null, payload);
    };

    const pickImages = async () => {
        // 👉 bare RN: react-native-image-picker
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 0, // 0 = multiple
            quality: 0.9,
        };
        const res = await launchImageLibrary(options);

        if (res?.assets && res.assets.length) {
            // gộp với ảnh cũ + tránh trùng uri
            setImages((prev) => {
                const uniqByUri = new Map<string, Asset>();
                [...prev, ...res.assets].forEach((a) => {
                    if (a?.uri) uniqByUri.set(a.uri, a);
                });
                return Array.from(uniqByUri.values());
            });
        }

        // 👉 Expo Managed (nếu dùng):
        /*
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.9,
          selectionLimit: 0,
        });
        if (!result.canceled) {
          const newAssets = result.assets.map(a => ({
            uri: a.uri,
            fileName: a.fileName,
            width: a.width,
            height: a.height,
            type: a.mimeType,
          })) as any as Asset[];
          setImages(prev => [...prev, ...newAssets]);
        }
        */
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Card style={styles.card}>
                <Card.Title title="Thêm đánh giá" />
                <Card.Content>
                    {/* Chọn sao (1–5) */}
                    <Text style={styles.label}>Đánh giá về chất lượng suất ăn</Text>
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Button
                                key={n}
                                onPress={() => setRate(n)}
                                style={styles.starBtn}
                                contentStyle={{ paddingHorizontal: 0 }}
                                compact
                            >
                                <MaterialIcons
                                    name={n <= rate ? 'star' : 'star-border'}
                                    size={28}
                                    color={n <= rate ? '#f5a623' : theme.colors.onSurfaceVariant}
                                />
                            </Button>
                        ))}
                        <Text style={{ marginLeft: 8, color: theme.colors.onSurfaceVariant }}>
                            {rate} sao
                        </Text>
                    </View>

                    {/* Nội dung (thay cho ReactQuill) */}
                    <Text style={[styles.label, { marginTop: 12 }]}>Để lại nội dung</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={6}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Nhập cảm nhận của bạn..."
                    />

                    {/* Chọn nhiều ảnh + Preview */}
                    <Text style={[styles.label, { marginTop: 12 }]}>Chọn hình ảnh</Text>
                    <Button mode="outlined" onPress={pickImages} icon="image-multiple">
                        Chọn ảnh từ thư viện
                    </Button>

                    {images.length > 0 && (
                        <View style={styles.previewWrap}>
                            {images.map((img, idx) => (
                                <View key={`${img.uri}-${idx}`} style={styles.thumb}>
                                    <Image source={{ uri: img.uri }} style={styles.img} />
                                </View>
                            ))}
                        </View>
                    )}

                    {!!err && (
                        <HelperText type="error" visible={!!err} style={{ marginTop: 8 }}>
                            {err}
                        </HelperText>
                    )}

                    <Button mode="contained" style={{ marginTop: 16 }} onPress={submit}>
                        Thêm đánh giá
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12 },
    card: { borderRadius: 12 },
    label: { marginBottom: 8, fontWeight: '600' },
    starRow: { flexDirection: 'row', alignItems: 'center' },
    starBtn: { marginRight: 2 },
    previewWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    thumb: {
        width: 90,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    img: { width: '100%', height: '100%' },
});

export default AddNewModal;
