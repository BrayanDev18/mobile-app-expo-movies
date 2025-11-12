import axios from 'axios';

export const moviesApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOVIES_API_BASE_URL,
  params: {
    language: 'en-US',
    api_key: process.env.EXPO_PUBLIC_MOVIES_API_KEY,
  },
});
