import { MovieDetailsProps } from '@/interfaces';
import { formatDuration } from '@/utils';
import { InfoMetaItem, MediaInfoShell } from './MediaInfoShell';
import { useTranslate } from '@/translate';

interface MovieInfoProps {
  movie: MovieDetailsProps;
  certification?: string | null;
  director?: string | null;
}

export const MovieInfo = ({ movie, certification, director }: MovieInfoProps) => {
  const { t } = useTranslate();

  return (
    <MediaInfoShell
      title={movie.title}
      homepage={movie.homepage}
      rating={movie.rating}
      certification={certification}
      genres={movie.genres}
      credit={director ? { label: t('detail.directedBy'), names: director } : null}
      overview={movie.overview}
      metaItems={
        <>
          {movie.releaseDate ? (
            <InfoMetaItem icon="calendar-outline">{movie.releaseDate.slice(0, 4)}</InfoMetaItem>
          ) : null}

          {movie.runtime ? (
            <InfoMetaItem icon="time-outline">{formatDuration(movie.runtime)}</InfoMetaItem>
          ) : null}
        </>
      }
    />
  );
};
