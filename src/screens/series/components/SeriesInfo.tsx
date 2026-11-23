import { TvDetailsProps } from '@/interfaces';
import { InfoMetaItem, MediaInfoShell } from '@/screens/movie/components';
import { useTranslate } from '@/translate';

interface SeriesInfoProps {
  series: TvDetailsProps;
  certification?: string | null;
}

const yearRange = (series: TvDetailsProps) => {
  const firstYear = series.firstAirDate?.slice(0, 4);

  if (!firstYear) return null;

  if (series.inProduction) return `${firstYear}–`;

  const lastYear = series.lastAirDate?.slice(0, 4);

  return lastYear && lastYear !== firstYear ? `${firstYear}–${lastYear}` : firstYear;
};

export const SeriesInfo = ({ series, certification }: SeriesInfoProps) => {
  const { t } = useTranslate();

  const years = yearRange(series);
  const creators = series.createdBy.map((creator) => creator.name).join(', ');

  return (
    <MediaInfoShell
      title={series.title}
      homepage={series.homepage}
      rating={series.rating}
      certification={certification}
      genres={series.genres}
      credit={creators ? { label: t('detail.createdBy'), names: creators } : null}
      overview={series.overview}
      metaItems={
        <>
          {years ? <InfoMetaItem icon="calendar-outline">{years}</InfoMetaItem> : null}

          <InfoMetaItem icon="albums-outline">
            {t('common.seasonCount', { count: series.numberOfSeasons })}
          </InfoMetaItem>
        </>
      }
    />
  );
};
