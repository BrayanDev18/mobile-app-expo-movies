import { useLanguageStore } from '@/stores';
import axios from 'axios';

const TMDB_LANGUAGES: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

const tmdbLanguage = () => {
  const language = useLanguageStore.getState().language;

  return TMDB_LANGUAGES[language?.slice(0, 2)] ?? 'en-US';
};

// eslint-disable-next-line import/no-named-as-default-member
export const moviesApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOVIES_API_BASE_URL,
  params: {
    api_key: process.env.EXPO_PUBLIC_MOVIES_API_KEY,
  },
});

moviesApi.interceptors.request.use((config) => {
  config.params = { language: tmdbLanguage(), ...config.params };

  return config;
});
