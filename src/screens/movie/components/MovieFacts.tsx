import { MovieDetailsProps } from '@/interfaces';
import { formatDate, formatLanguageName, formatMoney } from '@/utils';
import { FactsGrid } from './FactsGrid';
import { translateTmdbValue, useTranslate } from '@/translate';

export const MovieFacts = ({ movie }: { movie: MovieDetailsProps }) => {
  const { t } = useTranslate();

  const language = formatLanguageName(
    movie.originalLanguage,
    movie.spokenLanguages?.find((item) => item.iso_639_1 === movie.originalLanguage)?.english_name
  );

  return (
    <FactsGrid
      facts={[
        { label: t('facts.status'), value: translateTmdbValue(movie.status, t) },
        {
          label: t('facts.releaseDate'),
          value: movie.releaseDate ? formatDate(movie.releaseDate) : null,
        },
        { label: t('facts.originalLanguage'), value: language },
        { label: t('facts.budget'), value: formatMoney(movie.budget) },
        { label: t('facts.revenue'), value: formatMoney(movie.revenue) },
      ]}
    />
  );
};
