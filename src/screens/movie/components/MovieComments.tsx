import { Text } from '@/components';
import { IMAGE_BASE_URL } from '@/constants';
import { MovieReviewProps } from '@/interfaces';
import { formatDate, getAvatarColor, randomAvatar } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { TouchableHighlight, View } from 'react-native';

export const MovieComments = ({ comments }: { comments: MovieReviewProps[] }) => (
  <View className="gap-3">
    <View className="flex-row items-center justify-between">
      <Text className="!text-lg font-bold">Reviews</Text>

      {comments?.length > 5 ? (
        <TouchableHighlight
          className="h-12 w-12 items-center justify-center rounded-full"
          underlayColor="#404040">
          <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
        </TouchableHighlight>
      ) : null}
    </View>

    <FlashList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={comments?.slice(0, 5)}
      scrollEventThrottle={16}
      keyExtractor={(item, i) => `${item.id}-${i}`}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item: review }) => <CommentItem review={review} />}
    />
  </View>
);

const CommentItem = ({ review }: { review: MovieReviewProps }) => {
  const avatarColor = useMemo(() => getAvatarColor(review.author ?? 'Undefined'), [review.author]);

  return (
    <View className="w-[300px] gap-4 rounded-2xl border border-white/10 p-4">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-3">
          {review?.author_details?.avatar_path ? (
            <Image
              source={{
                uri: review?.author_details?.avatar_path
                  ? `${IMAGE_BASE_URL}/${review?.author_details?.avatar_path}`
                  : randomAvatar(),
              }}
              style={{ width: 50, height: 50, borderRadius: 24 }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: avatarColor + '30',
              }}
              className="items-center justify-center">
              <Text style={{ color: avatarColor }} className="text-lg font-semibold">
                {review.author?.[0]?.toUpperCase()}
                {review.author?.[1]?.toUpperCase()}
              </Text>
            </View>
          )}

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
    </View>
  );
};
