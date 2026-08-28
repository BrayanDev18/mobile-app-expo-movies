import { MovieProps } from '@/interfaces';
import { useMyListStore } from '@/stores';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Bookmark } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_SIZE = 44;

export const BookmarkButton = ({ movie }: { movie: MovieProps }) => {
  const { top } = useSafeAreaInsets();
  const toggleSaved = useMyListStore((state) => state.toggleSaved);
  const isSaved = useMyListStore((state) =>
    state.saved.some(
      (item) => item.id === movie.id && (item.mediaType ?? 'movie') === (movie.mediaType ?? 'movie')
    )
  );

  return (
    <View style={{ top: top - 25 }} className="absolute right-0 z-20 p-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isSaved ? `Remove ${movie.title} from My List` : `Save ${movie.title} to My List`
        }
        onPress={() => {
          Haptics.selectionAsync();
          toggleSaved(movie);
        }}
        className="items-center justify-center">
        <BlurView
          tint="light"
          intensity={40}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: 50,
            overflow: 'hidden',
          }}>
          <Bookmark color="white" size={22} fill={isSaved ? 'white' : 'transparent'} />
        </BlurView>
      </Pressable>
    </View>
  );
};
