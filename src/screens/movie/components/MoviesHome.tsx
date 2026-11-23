import { useHomeSections, useMoviesByCategory, useTrendingPeople } from '@/hooks';
import { ReactNode } from 'react';
import { MediaHome } from './MediaHome';
import { PeopleHorizontalList } from './PeopleHorizontalList';
import { useTranslate } from '@/translate';

export const MoviesHome = ({ header }: { header: ReactNode }) => {
  const { t } = useTranslate();

  const { heroMovies, sections, isHeroLoading, isHeroError, refetchHero } = useHomeSections();
  const { people: trendingPeople } = useTrendingPeople();
  const { movies: topRated } = useMoviesByCategory('top_rated');

  return (
    <MediaHome
      mediaType="movie"
      header={header}
      hero={heroMovies}
      sections={sections}
      isLoading={isHeroLoading}
      isError={isHeroError}
      onRetry={refetchHero}
      topRated={topRated}
      extraSections={
        trendingPeople.length > 0 ? (
          <PeopleHorizontalList title={t('home.trendingPeople')} people={trendingPeople} />
        ) : undefined
      }
    />
  );
};
