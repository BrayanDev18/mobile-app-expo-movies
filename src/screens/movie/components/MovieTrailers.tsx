import { Text } from '@/components';
import { ScreenRoutes } from '@/constants';
import { MovieVideosProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { TouchableHighlight, View } from 'react-native';
import YoutubePlayer, { type YoutubeIframeRef } from 'react-native-youtube-iframe';

export const MovieTrailers = ({ videos }: { videos: MovieVideosProps[] }) => {
  const { id } = useLocalSearchParams();

  const videoRef = useRef<YoutubeIframeRef | null>(null);

  const videosFilter = videos.filter((video) => video.type === 'Trailer');

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Trailers & Teasers</Text>

        {videos.length > 3 ? (
          <TouchableHighlight
            onPress={() =>
              router.push({
                pathname: ScreenRoutes.videos as any,
                params: { id },
              })
            }
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040">
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

      <FlashList
        horizontal
        data={videosFilter.slice(0, 3)}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.movie_id}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item: video }) => (
          <View className="w-[270px] gap-2">
            <View className="justify-center overflow-hidden rounded-2xl border border-white/10">
              <YoutubePlayer
                ref={videoRef}
                height={150}
                webViewStyle={{ borderRadius: 14, flex: 1 }}
                videoId={video.key}
              />
            </View>

            <View className="flex-1 gap-1 overflow-hidden">
              <Text numberOfLines={1} className="!text-md font-semibold">
                {video.name}
              </Text>

              <Text className="!text-neutral-400">{formatDate(video?.published_at as any)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
