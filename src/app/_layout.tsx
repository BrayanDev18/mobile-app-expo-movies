import { useLanguageStore } from '@/stores';
import { changeLanguage, i18n } from '@/translate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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
  const language = useLanguageStore((state) => state.language);

  // TMDB queries carry the language inside their queryKey (see tmdbKey), so a
  // language change resolves to fresh cache entries without any invalidation.
  useEffect(() => {
    if (language && language !== i18n.locale) {
      changeLanguage(language);
    }
  }, [language]);

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
