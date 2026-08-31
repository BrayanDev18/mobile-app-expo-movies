import { Icon, Text } from '@/components';
import { clearDatabase } from '@/expo-sqlite/db';
import {
  useLanguageStore,
  useMyListStore,
  useProfileStore,
  useRecentSearchesStore,
  useViewedMoviesStore,
  useViewedSeriesStore,
} from '@/stores';
import { getAvatarColor } from '@/utils';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as LucideIcons from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const confirmClear = (title: string, message: string, onConfirm: () => void) =>
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Clear',
      style: 'destructive',
      onPress: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onConfirm();
      },
    },
  ]);

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const ProfileHeader = () => {
  const { name, setName } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const onSave = () => {
    Haptics.selectionAsync();
    setName(draft);
    setIsEditing(false);
  };

  return (
    <View className="items-center gap-4 pb-10 pt-2">
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 92, height: 92, backgroundColor: getAvatarColor(name) }}>
        <Text className="!text-[32px] font-black">{initialsOf(name)}</Text>
      </View>

      {isEditing ? (
        <View className="w-full flex-row items-center justify-center gap-2 px-10">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={onSave}
            autoFocus
            maxLength={24}
            returnKeyType="done"
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            className="h-11 flex-1 rounded-xl bg-white/10 px-4 text-center font-satoshi text-[17px] font-bold text-white"
          />

          <Icon
            name="Check"
            size={18}
            color="rgba(255,255,255,0.7)"
            className="h-11 w-11 items-center justify-center rounded-full border border-white/15"
            onPress={onSave}
          />
        </View>
      ) : (
        <View className="flex-row items-center gap-1">
          <View className="w-11" />

          <Text numberOfLines={1} className="!text-2xl font-bold">
            {name}
          </Text>

          <Icon
            name="Pencil"
            size={14}
            color="rgba(255,255,255,0.5)"
            className="h-11 w-11 items-center justify-center"
            onPress={() => {
              setDraft(name);
              setIsEditing(true);
            }}
          />
        </View>
      )}
    </View>
  );
};

const SettingsGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <View className="gap-2 pb-7">
    <Text className="px-2 !text-[12px] font-semibold !text-neutral-400" style={{ letterSpacing: 1.2 }}>
      {title.toUpperCase()}
    </Text>

    <View
      className="rounded-3xl border px-4"
      style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
      {children}
    </View>
  </View>
);

interface SettingsRowProps {
  icon: keyof typeof LucideIcons;
  label: string;
  meta?: string;
  onPress: () => void;
  isLast?: boolean;
  showChevron?: boolean;
  destructive?: boolean;
}

const SettingsRow = (props: SettingsRowProps) => {
  const { icon, label, meta, onPress, isLast, showChevron = true, destructive } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`flex-row items-center gap-3 py-3.5 ${isLast ? '' : 'border-b border-white/10'}`}>
      <View
        className="items-center justify-center rounded-lg"
        style={{ width: 30, height: 30, backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <Icon
          name={icon}
          size={16}
          color={destructive ? '#f87171' : 'rgba(255,255,255,0.7)'}
        />
      </View>

      <Text
        className={`flex-1 !text-[15px] font-medium ${destructive ? '!text-red-400' : ''}`}>
        {label}
      </Text>

      {meta ? <Text className="!text-[13px] !text-neutral-400">{meta}</Text> : null}

      {showChevron && <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.35)" />}
    </Pressable>
  );
};

const ProfileScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { language, setLanguage } = useLanguageStore();
  const { items: savedItems, clearAll: clearSavedItems } = useMyListStore();
  const { viewed: viewedMovies, clearViewed: clearViewedMovies } = useViewedMoviesStore();
  const { viewed: viewedSeries, clearViewed: clearViewedSeries } = useViewedSeriesStore();
  const { searches, clearSearches } = useRecentSearchesStore();

  const viewedCount = viewedMovies.length + viewedSeries.length;
  const version = Constants.expoConfig?.version;
  const activeLanguage =
    LANGUAGES.find((item) => language.startsWith(item.code))?.label ?? 'English';

  const placeholder = () => Haptics.selectionAsync();

  const chooseLanguage = () =>
    Alert.alert('Language', 'Choose the app language.', [
      ...LANGUAGES.map((item) => ({
        text: item.label,
        onPress: () => {
          Haptics.selectionAsync();
          setLanguage(item.code);
        },
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
        <Animated.View entering={FadeIn.duration(300)} className="px-4">
          <View className="pb-4">
            <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
              Settings
            </Text>
          </View>

          <ProfileHeader />

          <SettingsGroup title="Preferences">
            <SettingsRow
              icon="Languages"
              label="Language"
              meta={activeLanguage}
              onPress={chooseLanguage}
            />

            <SettingsRow icon="Bell" label="Notifications" onPress={placeholder} />

            <SettingsRow icon="Moon" label="Appearance" meta="Dark" onPress={placeholder} />

            <SettingsRow icon="Play" label="Autoplay trailers" onPress={placeholder} isLast />
          </SettingsGroup>

          <SettingsGroup title="Data">
            <SettingsRow
              icon="History"
              label="Clear search history"
              meta={searches.length ? `${searches.length}` : undefined}
              onPress={() =>
                confirmClear(
                  'Clear search history',
                  'Your recent searches will be removed.',
                  clearSearches
                )
              }
            />

            <SettingsRow
              icon="EyeOff"
              label="Clear recently viewed"
              meta={viewedCount ? `${viewedCount}` : undefined}
              onPress={() =>
                confirmClear('Clear recently viewed', 'Your viewing history will be removed.', () => {
                  clearViewedMovies();
                  clearViewedSeries();
                })
              }
            />

            <SettingsRow
              icon="BookmarkX"
              label="Clear My List"
              meta={savedItems.length ? `${savedItems.length}` : undefined}
              onPress={() =>
                confirmClear(
                  'Clear My List',
                  'Your watchlist, watched titles, favorites, and ratings will be removed.',
                  clearSavedItems
                )
              }
            />

            <SettingsRow
              icon="Trash2"
              label="Clear database"
              destructive
              onPress={() =>
                confirmClear('Clear database', 'Removes all local data permanently.', clearDatabase)
              }
              isLast
            />
          </SettingsGroup>

          <SettingsGroup title="About">
            <SettingsRow
              icon="Clapperboard"
              label="Powered by TMDB"
              onPress={() => Linking.openURL('https://www.themoviedb.org/')}
            />

            <SettingsRow icon="MessageSquare" label="Send feedback" onPress={placeholder} />

            <SettingsRow icon="Shield" label="Privacy policy" onPress={placeholder} isLast />
          </SettingsGroup>

          <View className="items-center pt-1">
            {version && (
              <Text className="!text-[11px] !text-neutral-400">Flixora v{version}</Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
