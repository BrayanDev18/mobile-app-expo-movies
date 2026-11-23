import { useLanguageStore } from '@/stores';
import { changeLanguage, i18n } from '@/translate';
import { queryClient, queryPersistOptions } from '@/services';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../../global.css';

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
      <PersistQueryClientProvider client={queryClient} persistOptions={queryPersistOptions}>
        <StatusBar style="light" />

        <View className="flex-1 bg-neutral-900">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
