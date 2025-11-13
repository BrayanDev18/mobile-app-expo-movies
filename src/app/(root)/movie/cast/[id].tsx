import { RowBack, Text } from '@/components';
import { useCastDetails } from '@/hooks';
import { CastCreditProps, CastDetailsProps, CastImagesResponse } from '@/interfaces';
import { CastBiography, CastFilmography } from '@/screens/movie/components';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

interface TabsProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  delay: number;
}

interface RenderTabContentProps {
  activeTab: string;
  cast: CastDetailsProps;
  images: CastImagesResponse;
  castCredits: CastCreditProps[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastDescriptionScreen = () => {
  const [activeTab, setActiveTab] = useState('castCredits');

  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const { castDetails, castImages, castCredits } = useCastDetails(+id);

  return (
    <View className="flex-1 bg-neutral-900">
      <RowBack />

      <View style={{ height: height * 0.35 }} className="relative justify-end">
        <ImageBackground
          source={{ uri: castDetails?.profile_path }}
          style={StyleSheet.absoluteFillObject}
          contentPosition="top center"
          blurRadius={2}>
          <LinearGradient
            colors={['transparent', '#171717']}
            style={{
              position: 'absolute',
              bottom: -5,
              left: 0,
              right: 0,
              height: height,
            }}
          />
        </ImageBackground>

        <View
          style={{ paddingTop: top }}
          className="flex-1 items-center justify-center gap-4 px-8 pb-7">
          <Image
            source={{ uri: castDetails?.profile_path }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 500,
            }}
            cachePolicy="memory-disk"
            contentFit="cover"
          />

          <View className="items-center gap-1">
            <Text className="!text-3xl font-semibold">{castDetails?.name}</Text>

            <View className="flex-row">
              <Text className="!text-md font-medium !text-neutral-400">
                {castDetails?.birthday}
              </Text>

              {castDetails?.deathday ? (
                <Text className="!text-md font-semibold !text-neutral-400">
                  - {castDetails?.deathday}
                </Text>
              ) : null}
            </View>

            {castDetails?.homepage ? (
              <Link
                href={castDetails?.homepage as any}
                className="!text-md text-blue-500 underline">
                {castDetails?.homepage}
              </Link>
            ) : null}
          </View>
        </View>
      </View>

      <View className="flex-1 gap-4 p-4">
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row border-b-2 border-neutral-700">
          <Tab
            title="Filmography"
            isActive={activeTab === 'filmography'}
            onPress={() => setActiveTab('filmography')}
            delay={300}
          />

          <Tab
            title="Biography"
            isActive={activeTab === 'biography'}
            onPress={() => setActiveTab('biography')}
            delay={200}
          />
        </Animated.View>

        <View className="flex-1">
          {renderTabContent({
            activeTab,
            cast: castDetails as CastDetailsProps,
            images: castImages as CastImagesResponse,
            castCredits: castCredits as CastCreditProps[],
          })}
        </View>
      </View>
    </View>
  );
};

export default CastDescriptionScreen;

const Tab = memo(({ title, isActive, onPress, delay }: TabsProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    scheduleOnRN(onPress);
  };

  return (
    <AnimatedPressable
      entering={SlideInLeft.delay(delay).springify()}
      style={animatedStyle}
      onPress={handlePress}
      className="flex-1 items-center justify-center py-3">
      <Text
        className={`font-medium ${isActive ? 'font-semibold !text-blue-500' : '!text-neutral-400'}`}>
        {title}
      </Text>

      {isActive && (
        <Animated.View
          entering={FadeIn.springify()}
          className="absolute -bottom-[2px] h-0.5 w-full rounded-full bg-blue-500"
        />
      )}
    </AnimatedPressable>
  );
});

const renderTabContent = ({ activeTab, cast, images, castCredits }: RenderTabContentProps) => {
  switch (activeTab) {
    case 'biography':
      return <CastBiography cast={cast} images={images?.profiles} />;
    case 'castCredits':
      return <CastFilmography filmography={castCredits} />;
    default:
      return null;
  }
};
