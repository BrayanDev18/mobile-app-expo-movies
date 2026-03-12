import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';

export const useClearCache = () => {
  const queryClient = useQueryClient();
  const [isClearing, setIsClearing] = useState(false);

  const clearAll = useCallback(async () => {
    setIsClearing(true);
    try {
      queryClient.clear();
      await Image.clearDiskCache();
      await Image.clearMemoryCache();
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsClearing(false);
    }
  }, [queryClient]);

  return { clearAll, isClearing };
};
