import { Text } from '@/components';
import { ScreenRoutes } from '@/constants';
import { MovieVideosProps } from '@/interfaces';
import { formatDate, IMAGE_PLACEHOLDER } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TouchableHighlight, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const CARD_WIDTH = 270;

export const MovieTrailers = ({ videos }: { videos: MovieVideosProps[] }) => {
  const { id } = useLocalSearchParams();
  const [playingKey, setPlayingKey] = useState<string | null>(null);

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
            accessibilityRole="button"
            accessibilityLabel="See all trailers and teasers"
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040">
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

      <FlashList
        horizontal
        data={videos.slice(0, 3)}
        extraData={playingKey}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.key}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item: video }) => (
          <View style={{ width: CARD_WIDTH }} className="gap-2">
            <View className="rounded-2xl border border-white/10">
              {playingKey === video.key ? (
                <YoutubePlayer
                  height={150}
                  play
                  videoId={video.key}
                  webViewStyle={{ borderRadius: 16 }}
                />
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${video.name}`}
                  onPress={() => setPlayingKey(video.key)}>
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg` }}
                    style={{ width: '100%', height: 150, borderRadius: 14 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    placeholder={IMAGE_PLACEHOLDER}
                    accessibilityLabel={`${video.name} thumbnail`}
                  />

                  <View style={StyleSheet.absoluteFill} className="items-center justify-center">
                    <BlurView
                      tint="dark"
                      intensity={40}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons name="play" size={20} color="white" />
                    </BlurView>
                  </View>
                </Pressable>
              )}
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
