import { TvDetailsProps } from '@/interfaces';
import { FactsGrid } from '@/screens/movie/components';
import { formatDate } from '@/utils';

export const SeriesFacts = ({ series }: { series: TvDetailsProps }) => {
  const language =
    series.spokenLanguages?.find((item) => item.iso_639_1 === series.originalLanguage)
      ?.english_name ?? series.originalLanguage?.toUpperCase();

  return (
    <FactsGrid
      facts={[
        { label: 'Status', value: series.status },
        {
          label: 'First air date',
          value: series.firstAirDate ? formatDate(series.firstAirDate) : null,
        },
        {
          label: 'Last air date',
          value: series.lastAirDate ? formatDate(series.lastAirDate) : null,
        },
        { label: 'Episodes', value: series.numberOfEpisodes || null },
        { label: 'Network', value: series.networks.map((network) => network.name).join(', ') },
        { label: 'Original language', value: language },
        { label: 'Type', value: series.type },
      ]}
    />
  );
};
