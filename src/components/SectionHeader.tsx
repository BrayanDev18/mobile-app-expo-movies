import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableHighlight, View } from 'react-native';
import { Text } from './Text';

interface CastAndCrewHeaderProps {
  movieId: string;
  data?: any[];
}

export const SectionHeader = ({ movieId, data }: CastAndCrewHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="!text-lg font-bold">Cast & Crew</Text>

      {data && data?.length > 5 ? (
        <TouchableHighlight
          className="h-12 w-12 items-center justify-center rounded-full"
          underlayColor="#404040"
          onPress={() =>
            router.push({
              pathname: '/(root)/movie/cast/castList',
              params: { id: movieId },
            })
          }>
          <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
        </TouchableHighlight>
      ) : null}
    </View>
  );
};
