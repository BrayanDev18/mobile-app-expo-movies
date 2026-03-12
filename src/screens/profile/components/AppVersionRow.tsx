import { Text } from '@/components';
import Constants from 'expo-constants';
import { SettingsRow } from './SettingsRow';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export const AppVersionRow = ({ isLast = false }: { isLast?: boolean }) => (
  <SettingsRow
    icon="Info"
    iconColor="#6B7280"
    label="App Version"
    isLast={isLast}
    accessibilityLabel={`App version ${appVersion}`}
    rightElement={
      <Text className="text-sm !text-neutral-400">{appVersion}</Text>
    }
  />
);
