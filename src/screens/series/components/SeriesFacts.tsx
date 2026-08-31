import { Text } from '@/components';
import { TvDetailsProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { View } from 'react-native';

export const SeriesFacts = ({ series }: { series: TvDetailsProps }) => {
  const language =
    series.spokenLanguages?.find((item) => item.iso_639_1 === series.originalLanguage)
      ?.english_name ?? series.originalLanguage?.toUpperCase();

  const facts = [
    { label: 'Status', value: series.status },
    {
      label: 'First air date',
      value: series.firstAirDate ? formatDate(series.firstAirDate) : null,
    },
    {
      label: 'Last air date',
      value: series.lastAirDate ? formatDate(series.lastAirDate) : null,
    },
    { label: 'Episodes', value: series.numberOfEpisodes ? `${series.numberOfEpisodes}` : null },
    {
      label: 'Network',
      value: series.networks.map((network) => network.name).join(', ') || null,
    },
    { label: 'Original language', value: language },
    { label: 'Type', value: series.type },
  ].filter((fact) => fact.value);

  if (!facts.length) return null;

  return (
    <View className="gap-3">
      <Text className="!text-lg font-bold">Details</Text>

      <View className="flex-row flex-wrap">
        {facts.map((fact) => (
          <View key={fact.label} style={{ width: '50%' }} className="gap-0.5 pb-4 pr-4">
            <Text className="!text-neutral-400">{fact.label}</Text>

            <Text className="!text-md font-medium">{fact.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
