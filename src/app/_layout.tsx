import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

export default function RootLayout() {
  // Language: useLanguageStore keeps i18n.locale in sync (set + rehydrate); TMDB
  // queries carry the language in their queryKey (see tmdbKey) and UI copy re-renders
  // through useTranslate(), so a switch needs no invalidation or restart.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />

        <View className="flex-1 bg-neutral-900">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
