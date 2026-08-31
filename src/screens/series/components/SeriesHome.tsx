import { MediaHome } from '@/screens/movie/components';
import { useSeriesHomeSections, useTvByCategory } from '@/screens/series/hooks';
import { ReactNode } from 'react';

export const SeriesHome = ({ header }: { header: ReactNode }) => {
  const { heroSeries, sections, isHeroLoading } = useSeriesHomeSections();
  const { series: topRated } = useTvByCategory('top_rated');

  return (
    <MediaHome
      mediaType="tv"
      header={header}
      hero={heroSeries}
      sections={sections}
      isLoading={isHeroLoading}
      topRated={topRated}
    />
  );
};
