import { Icon, Text } from '@/components';
import { IMAGE_BASE_URL } from '@/constants';
import { TvEpisodeGuestStar } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EpisodeGuestStarsProps {
  guestStars: TvEpisodeGuestStar[];
}

export const EpisodeGuestStars = ({ guestStars }: EpisodeGuestStarsProps) => {
  if (!guestStars?.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2">
        <Icon name="Users" size={18} color="#8B5CF6" />
        <Text className="!text-lg font-bold" accessibilityRole="header">
          Guest Stars
        </Text>
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={guestStars.slice(0, 10)}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.credit_id}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <View className="w-[145px] items-center gap-1.5">
            {item.profile_path ? (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}/${item.profile_path}` }}
                style={{ width: '100%', height: 180, borderRadius: 12 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                accessibilityLabel={`${item.name} photo`}
              />
            ) : (
              <View
                style={{ width: '100%', height: 180, borderRadius: 12 }}
                className="items-center justify-center bg-neutral-800">
                <Icon name="User" size={32} color="rgba(255,255,255,0.2)" />
              </View>
            )}

            <View className="w-full flex-1 items-center justify-center gap-1">
              <Text numberOfLines={2} className="text-center !text-md font-medium">
                {item.name}
              </Text>
              <Text numberOfLines={2} className="text-center !text-neutral-400">
                {item.character}
              </Text>
            </View>
          </View>
        )}
      />
    </Animated.View>
  );
};
