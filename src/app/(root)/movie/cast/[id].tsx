import {
  CustomTabs,
  ErrorState,
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
import { formatDate, IMAGE_PLACEHOLDER } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translateTmdbValue, useTranslate } from '@/translate';

const computeAge = (birthday?: string | null, deathday?: string | null): number | null => {
  if (!birthday) return null;

  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();

  if (isNaN(birth.getTime()) || isNaN(end.getTime())) return null;

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) age--;

  return age;
};

const CastDescriptionScreen = () => {
  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslate();

  const { castDetails, castImages, castCredits, socials, isLoading, isError, refetch } =
    useCastDetails(+id);

  if (isLoading) return <Loader />;

  if (isError || !castDetails) {
    return <ErrorState retryLabel={t('errors.retryPerson')} onRetry={() => refetch()} />;
  }

  const age = computeAge(castDetails.birthday, castDetails.deathday);

  const ageLabel = age != null ? ` · ${t('person.age', { count: age })}` : '';

  const lifeline = castDetails.birthday
    ? castDetails.deathday
      ? `${castDetails.birthday.slice(0, 4)} – ${castDetails.deathday.slice(0, 4)}${ageLabel}`
      : `${formatDate(castDetails.birthday)}${ageLabel}`
    : null;

  const iconLinks = [
    ...socials,
    ...(castDetails.homepage
      ? [
          {
            key: 'website',
            icon: 'globe-outline',
            label: t('common.officialWebsite'),
            url: castDetails.homepage,
          },
        ]
      : []),
  ];

  return (
    <View className="flex-1 bg-neutral-900">
      <RowBack />

      <View style={{ height: height * 0.35 }} className="relative justify-end">
        <ImageBackground
          source={{ uri: castDetails?.profile_path }}
          style={StyleSheet.absoluteFill}
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
            placeholder={IMAGE_PLACEHOLDER}
            accessibilityLabel={t('common.portrait', { name: castDetails.name })}
          />

          <View className="items-center gap-1">
            <Text accessibilityRole="header" className="!text-3xl font-semibold">
              {castDetails?.name}
            </Text>

            {castDetails?.known_for_department ? (
              <Text className="!text-[12px] !text-neutral-400">
                {translateTmdbValue(castDetails.known_for_department, t)}
              </Text>
            ) : null}

            {lifeline ? (
              <Text className="!text-md font-medium !text-neutral-400">{lifeline}</Text>
            ) : null}

            {iconLinks.length > 0 && (
              <View className="flex-row items-center gap-5 pt-2">
                {iconLinks.map((link) => (
                  <Pressable
                    key={link.key}
                    accessibilityRole="link"
                    accessibilityLabel={t('person.openLink', { label: link.label })}
                    hitSlop={10}
                    onPress={() => Linking.openURL(link.url)}>
                    <Ionicons name={link.icon as any} size={20} color="rgba(255,255,255,0.7)" />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <CustomTabs defaultValue="castCredits">
        <View className="flex-1 gap-4 px-4">
          <TabsList>
            <TabsTrigger value="castCredits">{t('person.filmography')}</TabsTrigger>
            <TabsTrigger value="biography">{t('person.biography')}</TabsTrigger>
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
