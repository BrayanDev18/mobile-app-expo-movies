import { SectionTitle, Text } from '@/components';
import { MovieProvidersProps, RegionWatchProvidersProps } from '@/interfaces';
import { tmdbImage } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Linking, Pressable, View } from 'react-native';
import { useTranslate } from '@/translate';

export const MovieWatchProviders = ({
  providers,
}: {
  providers: RegionWatchProvidersProps | null;
}) => {
  const { t } = useTranslate();

  if (!providers) return null;

  const { flatrate, rent, buy, link } = providers;

  const groups = [
    { title: t('detail.streaming'), data: flatrate },
    { title: t('detail.rent'), data: rent },
    { title: t('detail.buy'), data: buy },
  ];

  if (groups.every((group) => !group.data?.length)) return null;

  return (
    <View className="gap-3">
      <SectionTitle title={t('detail.whereToWatch')} />

      <View className="w-full gap-4">
        {groups.map((group, index) => {
          if (!group.data?.length) return null;

          return (
            <View key={index} className="gap-3">
              <Text className="text-sm font-medium !text-neutral-400">{group.title}</Text>

              <View className="flex-row flex-wrap gap-2 px-2">
                {group.data.slice(0, 3).map((provider: MovieProvidersProps, index: number) => (
                  <View
                    key={index}
                    className="w-[32%] overflow-hidden rounded-2xl border border-white/10">
                    <BlurView intensity={50} tint="dark">
                      <View className="flex-row items-center justify-between gap-2 p-1.5">
                        <View className="rounded-xl bg-white/10 p-1">
                          <Image
                            source={{
                              uri: tmdbImage(provider.logo_path, 'w92') ?? undefined,
                            }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 6,
                            }}
                            contentFit="fill"
                            cachePolicy="memory-disk"
                            accessibilityLabel={t('common.logo', { name: provider.provider_name })}
                          />
                        </View>

                        <Text className="flex-1 text-[12px] font-medium" numberOfLines={2}>
                          {provider.provider_name}
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {link ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('detail.seeAllOptionsA11y')}
            onPress={() => Linking.openURL(link)}
            className="self-start">
            <Text className="text-sm !text-blue-400 underline">{t('detail.seeAllOptions')}</Text>
          </Pressable>
        ) : null}

        <Text className="!text-[11px] !text-neutral-400">{t('detail.justWatch')}</Text>
      </View>
    </View>
  );
};
