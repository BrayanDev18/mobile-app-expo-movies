import { Text } from '@/components';
import { MovieVideosProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import YoutubePlayer, { type YoutubeIframeRef } from 'react-native-youtube-iframe';

export const MovieTrailers = ({ videos }: { videos: MovieVideosProps[] }) => {
  const videoRef = useRef<YoutubeIframeRef | null>(null);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Trailers & Teasers</Text>

        <Pressable className="p-2">
          <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
        </Pressable>
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={videos.reverse()}
        keyExtractor={(item, i) => `${item.movie_id}-${i}`}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: video }) => (
          <View className="w-60 gap-2">
            <View className="overflow-hidden rounded-2xl border border-white/10">
              <YoutubePlayer
                ref={videoRef}
                height={140}
                webViewStyle={{ borderRadius: 16, width: 256 }}
                videoId={video.key}
              />
            </View>

            <View className="flex-1 gap-1 overflow-hidden">
              <Text className="!text-md font-semibold">{video.name}</Text>

              <Text className="!text-neutral-500 dark:!text-neutral-400">
                {formatDate(video?.published_at as any)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
