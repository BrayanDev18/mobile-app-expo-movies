import { useInitDb } from '@/expo-sqlite/db';
import { useLanguageStore } from '@/stores';
import { changeLanguage, i18n } from '@/translate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { View } from 'react-native';
import '../../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
    },
  },
});

export default function RootLayout() {
  const { language } = useLanguageStore();

  const { success } = useInitDb();

  useEffect(() => {
    if (language && language !== i18n.locale) {
      changeLanguage(language);
    }
  }, [language]);

  if (!success) return null;

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
