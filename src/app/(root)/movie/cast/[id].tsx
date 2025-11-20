import {
  CustomTabs,
  Loader,
  RowBack,
  Screen,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Text,
} from '@/components';
import { useCastDetails } from '@/hooks';
import { CastBiography, CastFilmography } from '@/screens/movie/components';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CastDescriptionScreen = () => {
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

      <CustomTabs defaultValue="castCredits">
        <View className="flex-1 gap-4 px-4">
          <TabsList>
            <TabsTrigger value="castCredits">Filmography</TabsTrigger>
            <TabsTrigger value="biography">Biography</TabsTrigger>
          </TabsList>

          <Screen safeAreaEdges={['bottom']}>
            <TabsPanel value="castCredits">
              <CastFilmography filmography={castCredits} />
            </TabsPanel>

            <TabsPanel value="biography">
              <CastBiography cast={castDetails} images={castImages?.profiles} />
            </TabsPanel>
          </Screen>
        </View>
      </CustomTabs>
    </View>
  );
};

export default CastDescriptionScreen;
