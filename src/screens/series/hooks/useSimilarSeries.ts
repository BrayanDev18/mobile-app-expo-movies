import { IMAGE_BASE_URL } from '@/constants';
import { MovieProps, TvSeriesByCategoryProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useSimilarSeries = (seriesId: number) => {
  const { data: similarSeries, isLoading: isSimilarSeriesLoading } = useQuery({
    queryKey: ['seriesSimilar', seriesId],
    queryFn: async () => {
      const {
        data: { results: seriesFromApi },
      } = await moviesApi.get(`/tv/${seriesId}/similar`);

      return seriesFromApi.map((s: TvSeriesByCategoryProps) => ({
        id: s.id,
        title: s.name ?? s.original_name,
        overview: s.overview,
        poster: s.poster_path ? `${IMAGE_BASE_URL}${s.poster_path}` : null,
        backdrop: s.backdrop_path ? `${IMAGE_BASE_URL}${s.backdrop_path}` : null,
        rating: s.vote_average,
        releaseDate: s.first_air_date,
      }));
    },
  });

  return {
    similarSeries: similarSeries as MovieProps[],
    isSimilarSeriesLoading,
  };
};
