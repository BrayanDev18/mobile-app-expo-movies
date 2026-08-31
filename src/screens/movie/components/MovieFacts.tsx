import { MovieDetailsProps } from '@/interfaces';
import { formatDate, formatMoney } from '@/utils';
import { FactsGrid } from './FactsGrid';

export const MovieFacts = ({ movie }: { movie: MovieDetailsProps }) => {
  const language =
    movie.spokenLanguages?.find((item) => item.iso_639_1 === movie.originalLanguage)
      ?.english_name ?? movie.originalLanguage?.toUpperCase();

  return (
    <FactsGrid
      facts={[
        { label: 'Status', value: movie.status },
        { label: 'Release date', value: movie.releaseDate ? formatDate(movie.releaseDate) : null },
        { label: 'Original language', value: language },
        { label: 'Budget', value: formatMoney(movie.budget) },
        { label: 'Revenue', value: formatMoney(movie.revenue) },
      ]}
    />
  );
};
