import { Icon, Text } from '@/components';
import { PersonProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PersonCard } from './PersonCard';

interface TrendingPeopleStripProps {
  people: PersonProps[];
  isLoading: boolean;
}

export const TrendingPeopleStrip = ({ people, isLoading }: TrendingPeopleStripProps) => {
  if (isLoading) return <PeopleSkeleton />;
  if (!people?.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2 px-4">
        <Icon name="Users" size={18} color="#EC4899" />
        <Text className="!text-lg font-bold">Trending People</Text>
      </View>

      <FlashList
        horizontal
        data={people.slice(0, 15)}
        estimatedItemSize={120}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <PersonCard person={item} />}
      />
    </Animated.View>
  );
};

const PeopleSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="gap-3 px-4">
      <View className="h-5 w-40 rounded-lg bg-neutral-800" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Animated.View key={i} style={[pulseStyle, { marginRight: 12 }]} className="items-center gap-2">
            <View className="rounded-full bg-neutral-800" style={{ width: 90, height: 90 }} />
            <View className="h-3 w-16 rounded bg-neutral-800" />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};
