import { Text } from '@/components';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

interface ProfileHeroProps {
  avatarUri: string;
}

export const ProfileHero = ({ avatarUri }: ProfileHeroProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <LinearGradient
        colors={['#1e3a5f', '#0f172a', 'rgba(23,23,23,0.95)']}
        style={{ paddingTop: top + 20, paddingBottom: 40 }}
        className="items-center gap-3">
        <Image
          source={{ uri: avatarUri }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.15)',
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityLabel="App avatar"
        />

        <View className="items-center gap-1">
          <Text className="!text-3xl font-bold">Flixora</Text>
          <Text className="!text-lg !text-neutral-400">Settings</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
