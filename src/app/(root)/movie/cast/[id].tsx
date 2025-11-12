import { Loader, RowBack, Text } from '@/components';
import { MovieImagesProps } from '@/interfaces';
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
  cast: any;
  images: MovieImagesProps[];
  filmography: any[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastDescriptionScreen = () => {
  const [activeTab, setActiveTab] = useState('filmography');

  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  return null;

  const {
    movieCastDescription: { data: cast },
    movieCastImages: { data: images },
    movieCastFilmography: { data: filmography },
  } = useGetMovieCast(+id);

  if (!cast?.id || !images?.length || !filmography?.length) return <Loader />;

  return (
    <View className="flex-1 bg-neutral-900">
      <RowBack />

      <View style={{ height: height * 0.4 }} className="relative justify-end">
        <ImageBackground
          source={{ uri: cast?.avatar }}
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
            source={{ uri: cast?.avatar }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 500,
            }}
            contentFit="cover"
          />

          <View className="items-center gap-1">
            <Text className="!text-3xl font-semibold">{cast?.name}</Text>

            <View className="flex-row">
              <Text className="!text-md font-semibold !text-neutral-400">{cast?.birthday} </Text>

              {cast?.deathday ? (
                <Text className="!text-md font-semibold !text-neutral-400">- {cast?.deathday}</Text>
              ) : null}
            </View>

            {cast?.homepage ? (
              <Link href={cast?.homepage as any} className="!text-md text-blue-500 underline">
                {cast?.homepage}
              </Link>
            ) : null}
          </View>
        </View>
      </View>

      <View className="flex-1 gap-6 p-4">
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
            cast: cast as PersonDetailsShortProps,
            images: images as MovieImagesProps[],
            filmography: filmography as ShortMovieProps[],
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

const renderTabContent = ({ activeTab, cast, images, filmography }: RenderTabContentProps) => {
  switch (activeTab) {
    case 'biography':
      return <CastBiography cast={cast} images={images} />;
    case 'filmography':
      return <CastFilmography filmography={filmography} />;
    default:
      return null;
  }
};
