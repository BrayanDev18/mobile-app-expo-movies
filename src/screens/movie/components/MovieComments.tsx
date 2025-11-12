import { Text } from '@/components';
import { MovieReviewProps } from '@/interfaces';
import { formatDate, randomAvatar } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const MovieComments = ({ comments }: { comments: MovieReviewProps[] }) => (
  <View>
    <FlashList
      showsHorizontalScrollIndicator={false}
      data={comments?.slice(0, 10)}
      scrollEventThrottle={16}
      keyExtractor={(item, i) => `${item.id}-${i}`}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item: review, index }) => (
        <Animated.View
          entering={FadeInDown.delay(100 * index).springify()}
          className="flex-1 gap-4 rounded-2xl border border-white/10 p-4">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 flex-row items-center gap-3">
              <Image
                source={{
                  uri: review?.author_details?.avatar_path
                    ? `${IMAGE_BASE}/${review?.author_details?.avatar_path}`
                    : randomAvatar(),
                }}
                style={{ width: 50, height: 50, borderRadius: 24 }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />

              <View className="flex-1 gap-1">
                <Text numberOfLines={1} className="!text-lg font-semibold">
                  {review.author}
                </Text>

                <Text className="!text-neutral-400">{formatDate(review.created_at as any)}</Text>
              </View>
            </View>

            {review?.author_details?.rating && (
              <View className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={12} color="#fbbf24" />

                  <Text className="font-semibold">{review?.author_details?.rating}</Text>
                </View>
              </View>
            )}
          </View>

          <Text numberOfLines={4} className="!text-[14px] leading-6 !text-neutral-400">
            {review.content}
          </Text>
        </Animated.View>
      )}
    />

    <Animated.View entering={FadeInDown.delay(500).springify()}>
      <Pressable className="items-center py-3">
        <Text className="font-medium text-blue-500">Show all comments ▼</Text>
      </Pressable>
    </Animated.View>
  </View>
);
