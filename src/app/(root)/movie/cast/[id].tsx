import { Loader, RowBack, Screen, Tab, Text } from '@/components';
import { useCastDetails } from '@/hooks';
import { CastCreditProps, CastDetailsProps, CastImagesResponse } from '@/interfaces';
import { CastBiography, CastFilmography } from '@/screens/movie/components';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RenderTabContentProps {
  activeTab: string;
  cast: CastDetailsProps;
  images: CastImagesResponse;
  castCredits: CastCreditProps[];
}

const CastDescriptionScreen = () => {
  const [activeTab, setActiveTab] = useState<'castCredits' | 'biography'>('castCredits');

  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const {
    castDetails,
    castImages,
    castCredits,
    isCastCreditsLoading,
    isCastDetailsLoading,
    isCastImagesLoading,
  } = useCastDetails(+id);

  const tabContent = useMemo(
    () =>
      renderTabContent({
        activeTab,
        cast: castDetails as CastDetailsProps,
        images: castImages as CastImagesResponse,
        castCredits: castCredits as CastCreditProps[],
      }),
    [activeTab, castDetails, castImages, castCredits]
  );

  if (isCastCreditsLoading || isCastDetailsLoading || isCastImagesLoading) return <Loader />;

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

      <View className="flex-1 gap-4 px-4">
        <View className="flex-row gap-2 rounded-full bg-neutral-800/50 p-1.5">
          <Tab
            title="Filmography"
            isActive={activeTab === 'castCredits'}
            onPress={() => setActiveTab('castCredits')}
          />

          <Tab
            title="Biography"
            isActive={activeTab === 'biography'}
            onPress={() => setActiveTab('biography')}
          />
        </View>

        <Screen safeAreaEdges={['bottom']}>{tabContent}</Screen>
      </View>
    </View>
  );
};

export default CastDescriptionScreen;

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
