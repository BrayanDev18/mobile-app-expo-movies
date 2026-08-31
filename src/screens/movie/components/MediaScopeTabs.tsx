import { BlurView, Tab } from '@/components';
import { MEDIA_SCOPES } from '@/constants';
import { MediaType } from '@/interfaces';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MediaScopeTabsProps {
  scope: MediaType;
  onChange: (scope: MediaType) => void;
}

export const MediaScopeTabs = ({ scope, onChange }: MediaScopeTabsProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top + 15 }} className="w-full flex-row gap-2 px-4 pb-6">
      {MEDIA_SCOPES.map((item) => (
        <BlurView
          key={item.key}
          intensity={80}
          tint="dark"
          className="overflow-hidden rounded-full">
          <Tab
            title={item.label}
            isActive={scope === item.key}
            adaptableWidth
            onPress={() => {
              if (item.key === scope) return;

              Haptics.selectionAsync();
              onChange(item.key);
            }}
          />
        </BlurView>
      ))}
    </View>
  );
};
