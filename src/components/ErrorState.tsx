import { CloudOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Screen } from './Screen';
import { Text } from './Text';
import { useTranslate } from '@/translate';

interface ErrorStateProps {
  message?: string;
  retryLabel?: string;
  onRetry: () => void;
  fullScreen?: boolean;
}

const ErrorContent = ({ message, retryLabel, onRetry }: ErrorStateProps) => {
  const { t } = useTranslate();

  return (
    <View className="flex-1 items-center justify-center gap-4 px-10">
      <CloudOff size={48} color="rgba(255,255,255,0.3)" />

      <Text className="!text-neutral-400">{message ?? t('errors.generic')}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={retryLabel ?? t('common.retry')}
        onPress={onRetry}
        className="rounded-full bg-blue-500/15 px-6 py-2">
        <Text className="font-medium !text-blue-400">{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
};

export const ErrorState = ({ fullScreen = true, ...props }: ErrorStateProps) => {
  if (!fullScreen) return <ErrorContent {...props} />;

  return (
    <Screen canGoBack preset="fixed" safeAreaEdges={['top', 'bottom']}>
      <ErrorContent {...props} />
    </Screen>
  );
};
