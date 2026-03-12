import { IMAGE_BASE_URL } from '@/constants';
import { EpisodeDetailsProps, TvEpisodeDetail } from '@/interfaces';

export const mapEpisodeToProps = (data: TvEpisodeDetail): EpisodeDetailsProps => ({
  id: data.id,
  name: data.name,
  overview: data.overview,
  episodeNumber: data.episode_number,
  seasonNumber: data.season_number,
  airDate: data.air_date,
  stillPath: data.still_path ? `${IMAGE_BASE_URL}${data.still_path}` : null,
  rating: data.vote_average,
  voteCount: data.vote_count,
  runtime: data.runtime,
  productionCode: data.production_code,
  crew: data.crew ?? [],
  guestStars: data.guest_stars ?? [],
});
