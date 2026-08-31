import { useLanguageStore } from '@/stores';
import axios from 'axios';

const TMDB_LANGUAGES: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

export const tmdbLanguage = () => {
  const language = useLanguageStore.getState().language;

  return TMDB_LANGUAGES[language?.slice(0, 2)] ?? language ?? 'en-US';
};

// For include_image_language: TMDB expects bare codes ("es,null"), not full tags
export const tmdbImageLanguages = () => `${tmdbLanguage().slice(0, 2)},null`;

// eslint-disable-next-line import/no-named-as-default-member
export const moviesApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOVIES_API_BASE_URL,
  timeout: 10000,
  params: {
    api_key: process.env.EXPO_PUBLIC_MOVIES_API_KEY,
  },
});

// The app language store is the single authority for TMDB's language param —
// it must win over any per-request value.
moviesApi.interceptors.request.use((config) => {
  config.params = { ...config.params, language: tmdbLanguage() };

  return config;
});

// Normalize failures so consumers see TMDB's own message instead of a raw AxiosError
moviesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.status_message ?? error?.message ?? 'Something went wrong';

    return Promise.reject(Object.assign(new Error(message), { status: error?.response?.status }));
  }
);
