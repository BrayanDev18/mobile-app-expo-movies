import { View } from 'react-native';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface EmptyStateProps {
  icon: IconName;
  title?: string;
  message: string;
  action?: { title: string; onPress: () => void };
}

export const EmptyState = ({ icon, title, message, action }: EmptyStateProps) => (
  <View className="items-center justify-center gap-3 px-10 py-12">
    <Icon name={icon} size={48} color="rgba(255,255,255,0.3)" />

    {title ? <Text className="!text-lg font-bold">{title}</Text> : null}

    <Text className="text-center !text-neutral-400">{message}</Text>

    {action ? (
      <View className="mt-3 w-full">
        <Button title={action.title} onPress={action.onPress} />
      </View>
    ) : null}
  </View>
);
