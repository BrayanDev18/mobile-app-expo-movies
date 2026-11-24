import { MediaHome } from '@/screens/movie/components';
import { useLazyRails } from '@/screens/movie/hooks';
import { useSeriesHomeSections, useTvByCategory } from '@/screens/series/hooks';
import { ReactNode } from 'react';

export const SeriesHome = ({ header }: { header: ReactNode }) => {
  const { activeRails, activateRail } = useLazyRails();
  const { heroSeries, sections, isHeroLoading, isHeroError, refetchHero } =
    useSeriesHomeSections(activeRails);
  const { series: topRated } = useTvByCategory('top_rated');

  return (
    <MediaHome
      mediaType="tv"
      header={header}
      hero={heroSeries}
      sections={sections}
      onRailVisible={activateRail}
      isLoading={isHeroLoading}
      isError={isHeroError}
      onRetry={refetchHero}
      topRated={topRated}
    />
  );
};
