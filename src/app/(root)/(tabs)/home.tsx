import { MediaScopeTabs, MoviesHome } from '@/screens/movie/components';
import { SeriesHome } from '@/screens/series/components';
import { useMediaScopeStore } from '@/stores';
import { View } from 'react-native';

const HomeScreen = () => {
  const scope = useMediaScopeStore((state) => state.scope);
  const setScope = useMediaScopeStore((state) => state.setScope);

  const scopeTabs = <MediaScopeTabs scope={scope} onChange={setScope} />;

  // Scope switches are frequent peer changes — swap instantly, no entrance motion.
  return (
    <View className="flex-1 bg-neutral-900">
      {scope === 'movie' ? <MoviesHome header={scopeTabs} /> : <SeriesHome header={scopeTabs} />}
    </View>
  );
};

export default HomeScreen;
