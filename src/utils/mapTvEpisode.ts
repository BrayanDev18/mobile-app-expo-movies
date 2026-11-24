import {
  MovieCrewProps,
  TvEpisodeCrewMember,
  TvEpisodeDetailsProps,
  TvEpisodeDetailsResponse,
} from '@/interfaces';
import { mapCastMembers, mapImages, mapVideos } from './mapTmdb';
import { tmdbImage } from './tmdbImage';

// Writing credits come under several job titles depending on the show.
const CREW_JOBS = ['Director', 'Writer', 'Teleplay', 'Screenplay', 'Story'];

// One card per person: a director who also wrote shows as "Director, Writer".
export const mapEpisodeCrew = (crew: TvEpisodeCrewMember[] = []): MovieCrewProps[] => {
  const people = new Map<number, MovieCrewProps>();

  crew
    .filter((member) => member.job && CREW_JOBS.includes(member.job))
    .sort((a, b) => CREW_JOBS.indexOf(a.job!) - CREW_JOBS.indexOf(b.job!))
    .forEach((member) => {
      const existing = people.get(member.id);

      if (existing) {
        if (!existing.job.includes(member.job!)) existing.job = `${existing.job}, ${member.job}`;
        return;
      }

      people.set(member.id, {
        id: member.id,
        name: member.name ?? '',
        character: '',
        job: member.job ?? '',
        avatar: tmdbImage(member.profile_path, 'w342') ?? '',
      });
    });

  return [...people.values()].map((person) => ({ ...person, character: person.job }));
};

export const mapTvEpisodeDetails = (data: TvEpisodeDetailsResponse): TvEpisodeDetailsProps => ({
  id: data.id,
  name: data.name,
  overview: data.overview,
  still: data.still_path ?? null,
  seasonNumber: data.season_number,
  episodeNumber: data.episode_number,
  airDate: data.air_date,
  runtime: data.runtime,
  rating: data.vote_average,
  voteCount: data.vote_count,
  guestStars: mapCastMembers(data.guest_stars ?? data.credits?.guest_stars),
  crew: mapEpisodeCrew(data.crew ?? data.credits?.crew),
  stills: mapImages(data.images?.stills),
  videos: mapVideos(data.videos?.results).filter((video) => video.site === 'YouTube'),
});
