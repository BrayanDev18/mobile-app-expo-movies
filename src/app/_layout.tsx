import { useLanguageStore } from '@/stores';
import { changeLanguage, i18n } from '@/translate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../../global.css';
import '../utils/cssInterop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

export default function RootLayout() {
  const { language } = useLanguageStore();

  // const { success } = useInitDb();

  //resetDatabase();

  useEffect(() => {
    if (language && language !== i18n.locale) {
      changeLanguage(language);
    }
  }, [language]);

  // if (!success) return null;

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
