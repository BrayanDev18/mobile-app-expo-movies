import { MediaScopeTabs, MoviesHome } from '@/screens/movie/components';
import { SeriesHome } from '@/screens/series/components';
import { useMediaScopeStore } from '@/stores';
import Animated, { FadeIn } from 'react-native-reanimated';

const HomeScreen = () => {
  const scope = useMediaScopeStore((state) => state.scope);
  const setScope = useMediaScopeStore((state) => state.setScope);

  const scopeTabs = <MediaScopeTabs scope={scope} onChange={setScope} />;

  return (
    <Animated.View key={scope} entering={FadeIn.duration(250)} className="flex-1 bg-neutral-900">
      {scope === 'movie' ? <MoviesHome header={scopeTabs} /> : <SeriesHome header={scopeTabs} />}
    </Animated.View>
  );
};

export default HomeScreen;
