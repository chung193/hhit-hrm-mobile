import * as React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const QRImage = ({ qrUrl, width = 100, height = 100 }) => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        if (!qrUrl) {
            console.warn('QR URL is not provided');
        }
    }, [qrUrl]);

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <View style={styles.container}>
                    {qrUrl ? (
                        <Image
                            source={{
                                uri: `data:image/png;base64,` + qrUrl
                            }}
                            style={{ width, height }}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image
                            source={require('../../assets/noimg.png')}
                            style={{ width, height }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </TouchableOpacity>
            <ImageViewing
                images={[{ uri: `data:image/png;base64,` + qrUrl }]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />
        </>
    );
};

export default QRImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
});
