import { RatingBadge, SectionTitle, Text } from '@/components';
import { MovieReviewProps } from '@/interfaces';
import { formatDate, getAvatarColor, tmdbImage } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export const MovieComments = ({ comments }: { comments: MovieReviewProps[] }) => {
  const [selectedReview, setSelectedReview] = useState<MovieReviewProps | null>(null);

  return (
    <>
      <View className="gap-3">
        <SectionTitle title="Reviews" />

        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={comments?.slice(0, 5)}
          scrollEventThrottle={16}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item: review }) => (
            <CommentItem review={review} onPress={() => setSelectedReview(review)} />
          )}
        />
      </View>

      <Modal
        visible={!!selectedReview}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setSelectedReview(null)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Close review"
            onPress={() => setSelectedReview(null)}
          />
          <View
            className="rounded-t-3xl border-t border-white/10 bg-neutral-900 px-5 pt-3"
            style={{ maxHeight: '80%' }}>
            <View className="items-center pb-4">
              <View className="h-1.5 w-12 rounded-full bg-white/30" />
            </View>

            {selectedReview && (
              <>
                <View className="flex-row items-center justify-between gap-3 pb-4">
                  <ReviewAuthor review={selectedReview} />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close review"
                    className="h-11 w-11 items-center justify-center rounded-full"
                    onPress={() => setSelectedReview(null)}>
                    <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="mb-8">
                  <Text className="!text-[15px] leading-7 !text-neutral-200">
                    {selectedReview.content}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

// TMDB sometimes returns full Gravatar URLs prefixed with "/" instead of TMDB paths
const avatarUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (path.includes('http')) return path.replace(/^\//, '');

  return tmdbImage(path, 'w185');
};

const ReviewAuthor = ({ review }: { review: MovieReviewProps }) => {
  const avatarColor = useMemo(() => getAvatarColor(review.author ?? 'Undefined'), [review.author]);
  const avatar = avatarUrl(review?.author_details?.avatar_path);

  return (
    <View className="flex-1 flex-row items-center gap-3">
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityLabel={`${review.author} avatar`}
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
  );
};

const CommentItem = ({ review, onPress }: { review: MovieReviewProps; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Read full review by ${review.author}`}
    onPress={onPress}
    className="w-[300px] gap-4 rounded-2xl border border-white/10 p-4">
    <View className="flex-row items-start justify-between gap-2">
      <ReviewAuthor review={review} />

      {review?.author_details?.rating != null && (
        <View className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1">
          <RatingBadge value={review.author_details.rating} size="sm" precise={false} />
        </View>
      )}
    </View>

    <Text numberOfLines={4} className="!text-[14px] leading-6 !text-neutral-400">
      {review.content}
    </Text>

    <Text className="!text-[12px] font-medium !text-blue-400">Read more</Text>
  </Pressable>
);
