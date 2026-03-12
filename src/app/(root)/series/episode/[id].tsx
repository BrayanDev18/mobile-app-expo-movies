import { Loader, Screen } from '@/components';
import {
  useEpisodeCredits,
  useEpisodeDetails,
  useEpisodeImages,
  useEpisodeVideos,
} from '@/hooks';
import { MovieVideosProps } from '@/interfaces';
import { MovieCastAndCrew, MovieGallery, MovieTrailers } from '@/screens/movie/components';
import {
  EpisodeGuestStars,
  EpisodeHeader,
  EpisodeInfo,
} from '@/screens/episode/components';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

const EpisodeDetailScreen = () => {
  const { id, seriesId, seasonNumber, episodeNumber, seriesTitle } = useLocalSearchParams<{
    id: string;
    seriesId: string;
    seasonNumber: string;
    episodeNumber: string;
    seriesTitle?: string;
  }>();

  const sId = Number(seriesId);
  const sNum = Number(seasonNumber);
  const eNum = Number(episodeNumber);

  const { episodeDetails, isEpisodeDetailsLoading } = useEpisodeDetails(sId, sNum, eNum);
  const { episodeCredits, isEpisodeCreditsLoading } = useEpisodeCredits(sId, sNum, eNum);
  const { episodeImages, isEpisodeImagesLoading } = useEpisodeImages(sId, sNum, eNum);
  const { episodeVideos, isEpisodeVideosLoading } = useEpisodeVideos(sId, sNum, eNum);

  const filteredVideos = episodeVideos?.filter(
    (video: MovieVideosProps) => video.type === 'Trailer' || video.type === 'Teaser'
  );

  if (
    isEpisodeDetailsLoading ||
    isEpisodeCreditsLoading ||
    isEpisodeImagesLoading ||
    isEpisodeVideosLoading
  )
    return <Loader />;

  return (
    <Screen canGoBack preset="scroll" safeAreaEdges={['bottom']}>
      <EpisodeHeader stillPath={episodeDetails?.stillPath} />

      <View className="-mt-12 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
        <View className="items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-white/30" />
        </View>

        <View className="gap-6 px-4">
          {episodeDetails && (
            <EpisodeInfo episode={episodeDetails} seriesTitle={seriesTitle as string} />
          )}

          {episodeDetails?.guestStars?.length > 0 && (
            <EpisodeGuestStars guestStars={episodeDetails.guestStars} />
          )}

          {episodeCredits?.length > 0 && (
            <MovieCastAndCrew movieId={Number(id)} cast={episodeCredits} />
          )}

          {filteredVideos?.length > 0 && <MovieTrailers videos={filteredVideos} />}

          {episodeImages?.backdrops?.length ? (
            <MovieGallery movieId={Number(id)} gallery={episodeImages} />
          ) : null}
        </View>
      </View>
    </Screen>
  );
};

export default EpisodeDetailScreen;
