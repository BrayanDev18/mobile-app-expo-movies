import { Icon } from '@/components';
import { useClearCache } from '@/screens/profile/hooks/useClearCache';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Alert } from 'react-native';
import { SettingsRow } from './SettingsRow';

export const ClearCacheRow = ({ isLast = false }: { isLast?: boolean }) => {
  const { clearAll, isClearing } = useClearCache();

  const handlePress = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app will reload fresh content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <SettingsRow
      icon="Trash2"
      iconColor="#EF4444"
      label="Clear Cache"
      description="Free up storage space"
      isLast={isLast}
      accessibilityLabel="Clear cache"
      onPress={handlePress}
      destructive
      rightElement={
        isClearing ? (
          <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
        ) : (
          <Icon name="ChevronRight" size={18} color="rgba(255,255,255,0.3)" />
        )
      }
    />
  );
};
