import { Screen } from '@/components';
import {
  AppVersionRow,
  ClearCacheRow,
  LanguageSelectorRow,
  ProfileHero,
  SettingsSection,
  ThemeToggleRow,
} from '@/screens/profile/components';
import { randomAvatar } from '@/utils';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const avatarUri = useMemo(() => randomAvatar(), []);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 80 }}>
        <ProfileHero avatarUri={avatarUri} />

        <View className="gap-8 px-4" style={{ marginTop: -20 }}>
          <SettingsSection title="Appearance" enterDelay={200}>
            <ThemeToggleRow />
            <LanguageSelectorRow />
          </SettingsSection>

          <SettingsSection title="Storage" enterDelay={400}>
            <ClearCacheRow />
          </SettingsSection>

          <SettingsSection title="About" enterDelay={600}>
            <AppVersionRow />
          </SettingsSection>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
