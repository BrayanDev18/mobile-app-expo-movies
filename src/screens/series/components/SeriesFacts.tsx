import { TvDetailsProps } from '@/interfaces';
import { FactsGrid } from '@/screens/movie/components';
import { formatDate, formatLanguageName } from '@/utils';
import { translateTmdbValue, useTranslate } from '@/translate';

export const SeriesFacts = ({ series }: { series: TvDetailsProps }) => {
  const { t } = useTranslate();

  const language = formatLanguageName(
    series.originalLanguage,
    series.spokenLanguages?.find((item) => item.iso_639_1 === series.originalLanguage)?.english_name
  );

  return (
    <FactsGrid
      facts={[
        { label: t('facts.status'), value: translateTmdbValue(series.status, t) },
        {
          label: t('facts.firstAirDate'),
          value: series.firstAirDate ? formatDate(series.firstAirDate) : null,
        },
        {
          label: t('facts.lastAirDate'),
          value: series.lastAirDate ? formatDate(series.lastAirDate) : null,
        },
        { label: t('facts.episodes'), value: series.numberOfEpisodes || null },
        {
          label: t('facts.network'),
          value: series.networks.map((network) => network.name).join(', '),
        },
        { label: t('facts.originalLanguage'), value: language },
        { label: t('facts.type'), value: translateTmdbValue(series.type, t) },
      ]}
    />
  );
};
