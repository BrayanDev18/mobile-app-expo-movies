import { Text } from '@/components';
import { MovieDetailsProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { View } from 'react-native';

const formatMoney = (amount?: number): string | null => {
  if (!amount) return null;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${Math.round(amount / 1e6)}M`;

  return `$${amount.toLocaleString()}`;
};

export const MovieFacts = ({ movie }: { movie: MovieDetailsProps }) => {
  const language =
    movie.spokenLanguages?.find((item) => item.iso_639_1 === movie.originalLanguage)
      ?.english_name ?? movie.originalLanguage?.toUpperCase();

  const facts = [
    { label: 'Status', value: movie.status },
    { label: 'Release date', value: movie.releaseDate ? formatDate(movie.releaseDate) : null },
    { label: 'Original language', value: language },
    { label: 'Budget', value: formatMoney(movie.budget) },
    { label: 'Revenue', value: formatMoney(movie.revenue) },
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
