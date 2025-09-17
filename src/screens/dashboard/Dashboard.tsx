import React, { memo, useEffect, useState } from 'react';
import { MainBackground } from '@components/background';
import { Paragraph } from '@components/paragraph';
import { Navigation } from '@types';
import { getAllPost } from '@services/Post'
import { View } from 'react-native';
import { Chip, Text, TouchableRipple  } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

type Props = {
    navigation: Navigation;
};

const PostItem = ({ item , onPress }) => {
    return (
        <View style={{ padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#dfe6e9', marginBottom: 10 }}>
            <View style={{
                marginBottom: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
            }}>
                {item.catalogs.map(item =>
                    <Chip
                        mode='flat'
                        textStyle={{ color: 'white', fontSize: 12 }}
                        style={{
                            backgroundColor: '#1A1951',
                            borderRadius: 15,
                            padding: 0
                        }}
                        children={item.name}
                    />
                )}
            </View>
                <TouchableRipple onPress={onPress} rippleColor="rgba(26,25,81,0.12)">
                    <Text variant="titleMedium" children={item.name} />
                </TouchableRipple>
            <Text variant="bodyMedium" children={item.summary} />
        </View>
    )
}
const DashboardScreen = ({ navigation }: Props) => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getAllPost()
            .then(res => {
                setPosts(res.data.data)
            })
            .catch(err => {

            })
    }, [])
    return (
        <MainBackground children={undefined}>
            {posts && posts.map(item => (
                <React.Fragment key={item.id}>
                    <PostItem 
                    item={item} 
                    onPress={() => navigation.navigate('PostDetail', { id: item.id, item })}
                    />
                </React.Fragment>
            ))}
        </MainBackground>
    )
};

export default memo(DashboardScreen);
