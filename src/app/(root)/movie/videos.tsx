import { Loader, Screen, Text } from '@/components';
import { useMovieVideos } from '@/hooks';
import { formatDate } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { View } from 'react-native';
import YoutubePlayer, { type YoutubeIframeRef } from 'react-native-youtube-iframe';

const VIDEO_QUALITIES: Record<number, string> = {
  360: '360p',
  480: '480p',
  720: 'HD',
  1080: 'Full HD',
  1440: '2K',
  2160: '4K',
};

const VideosScreen = () => {
  const { id } = useLocalSearchParams();
  const videoRef = useRef<YoutubeIframeRef | null>(null);

  const { movieVideos, isMovieVideosLoading } = useMovieVideos(+id);

  if (isMovieVideosLoading) return <Loader />;

  return (
    <Screen preset="auto" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="flex-1 px-4 pt-14">
        <FlashList
          data={movieVideos.reverse()}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, i) => `${item.movie_id}-${i}`}
          ItemSeparatorComponent={() => <View className="h-6" />}
          renderItem={({ item: video }) => (
            <View className="w-full gap-3 rounded-3xl bg-neutral-800/20 p-2.5">
              <View className="relative overflow-hidden rounded-2xl">
                <YoutubePlayer
                  ref={videoRef}
                  height={220}
                  webViewStyle={{ borderRadius: 16 }}
                  videoId={video.key}
                />

                <View className="absolute right-3 top-3 rounded-full bg-blue-500 px-3 py-1">
                  <Text className="font-semibold">
                    {VIDEO_QUALITIES[video.size as number] ?? `${video.size}p`}
                  </Text>
                </View>
              </View>

              <View className="gap-1.5 p-1">
                <Text numberOfLines={2} className="!text-lg font-semibold leading-tight">
                  {video.name}
                </Text>

                <Text className="!text-md !text-neutral-400">
                  {formatDate(video.published_at as any)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </Screen>
  );
};

export default VideosScreen;
