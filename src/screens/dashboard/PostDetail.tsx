// PostDetailScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Chip, Text, ActivityIndicator } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { MainBackground } from '@components/background';
import { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator';
import { getPostById } from '@services/Post'; // <- nếu chưa có, tạo sau
import { BackButton } from '@components/backButton';
import { useNavigation } from '@react-navigation/native';
type PostDetailRoute = RouteProp<RootStackParamList, 'PostDetail'>;

type Props = {
  route: PostDetailRoute;
};

export default function PostDetailScreen({ route }: Props) {
  const { width } = useWindowDimensions();
  const { id, item: passedItem } = route.params || {};
  const [post, setPost] = useState<any>(passedItem ?? null);
  const [loading, setLoading] = useState(!passedItem);
    const navigation = useNavigation();
  useEffect(() => {
    if (!passedItem && id) {
      setLoading(true);
      getPostById(id)
        .then(res => setPost(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, passedItem]);

  const htmlSource = useMemo(() => ({ html: post?.content ?? '' }), [post]);

  if (loading) {
    return (
      <MainBackground>
        <View style={{ padding: 16 }}>
          <ActivityIndicator />
        </View>
      </MainBackground>
    );
  }

  if (!post) {
    return (
      <MainBackground>
        <View style={{ padding: 16 }}>
          <Text>Không tìm thấy bài viết.</Text>
        </View>
      </MainBackground>
    );
  }

  return (
    <MainBackground>
        
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <BackButton goBack={()=> navigation.navigate('Dashboard')}/>
        {/* Catalog chips */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {post?.catalogs?.map((c: any) => (
            <Chip
              key={c.id ?? c.name}
              mode="flat"
              textStyle={{ color: 'white', fontSize: 12 }}
              style={{ backgroundColor: '#1A1951', borderRadius: 15 }}
            >
              {c.name}
            </Chip>
          ))}
        </View>

        {/* Title & summary */}
        <Text variant="headlineSmall">{post?.name}</Text>
        {!!post?.summary && <Text variant="bodyMedium">{post.summary}</Text>}

        {/* HTML content */}
        {!!post?.content && (
          <RenderHtml
            contentWidth={width - 32}
            source={htmlSource}
            // tùy chọn: custom style cho img/table
            tagsStyles={{
              img: { width: '100%', height: 'auto', marginBottom: 30, marginTop: 30 },
              p: { lineHeight: 22, marginBottom: 0 },
            }}
          />
        )}
      </ScrollView>
    </MainBackground>
  );
}
