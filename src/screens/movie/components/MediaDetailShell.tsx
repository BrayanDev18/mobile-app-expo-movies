import { Screen } from '@/components';
import { useScrollY } from '@/hooks';
import { ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { MovieHeader } from './MovieHeader';

interface MediaDetailShellProps {
  poster: string | null;
  children: ReactNode;
}

// The common frame of both detail screens: parallax poster header plus the
// rounded sheet that holds the sections.
export const MediaDetailShell = ({ poster, children }: MediaDetailShellProps) => {
  const { scrollY, onScroll } = useScrollY();

  return (
    <Screen canGoBack safeAreaEdges={['bottom']}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        <MovieHeader poster={poster} scrollY={scrollY} />

        <View className="-mt-16 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
          <View className="items-center py-3">
            <View className="h-1.5 w-12 rounded-full bg-white/30" />
          </View>

          <View className="gap-6 px-4">{children}</View>
        </View>
      </Animated.ScrollView>
    </Screen>
  );
};
