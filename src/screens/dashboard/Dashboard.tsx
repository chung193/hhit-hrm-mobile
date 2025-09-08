import React, { memo, useEffect, useState } from 'react';
import { MainBackground } from '@components/background';
import { Paragraph } from '@components/paragraph';
import { Navigation } from '@types';
import { getAllPost } from '@services/Post'
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

type Props = {
    navigation: Navigation;
};

const PostItem = ({ item }) => {
    return (
        <View style={{ padding: 5, borderBottomWidth: 1, borderBottomColor: '#34495e', marginBottom: 10 }}>
            <View style={{
                marginBottom: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
            }}>
                {item.catalogs.map(item =>
                    <Chip mode='flat'
                        style={{
                            backgroundColor: '#95a5a6',

                            borderRadius: 15
                        }}>
                        {item.name}
                    </Chip>)}
            </View>
            <Text variant="titleLarge">{item.name}</Text>
            <Text variant="bodyLarge">{item.summary}</Text>
            {/* <RenderHtml contentWidth={300} source={{ html: item.content || '' }} /> */}
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
        <MainBackground>
            {posts && posts.map(item => (
                <React.Fragment key={item.id}>
                    <PostItem item={item} />
                </React.Fragment>
            ))}
        </MainBackground>
    )
};

export default memo(DashboardScreen);
