import { Icon, IconName, Text } from '@/components';
import {
  useLanguageStore,
  useMyListStore,
  useProfileStore,
  useRecentSearchesStore,
  useViewedMediaStore,
  hasCustomName,
} from '@/stores';
import { getAvatarColor } from '@/utils';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { ReactNode, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { EASE_OUT } from '@/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translate, useTranslate } from '@/translate';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const confirmClear = (title: string, message: string, onConfirm: () => void) =>
  Alert.alert(title, message, [
    { text: translate('common.cancel'), style: 'cancel' },
    {
      text: translate('common.clear'),
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
  const name = useProfileStore((state) => state.name);
  const setName = useProfileStore((state) => state.setName);
  const { t } = useTranslate();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const displayName = hasCustomName(name) ? name : t('profile.guest');

  const onSave = () => {
    Haptics.selectionAsync();
    setName(draft);
    setIsEditing(false);
  };

  return (
    <View className="items-center gap-4 pb-10 pt-2">
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 92, height: 92, backgroundColor: getAvatarColor(displayName) }}>
        <Text className="!text-[32px] font-black">{initialsOf(displayName)}</Text>
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
            placeholder={t('profile.yourName')}
            placeholderTextColor="#9ca3af"
            className="h-11 flex-1 rounded-xl bg-white/10 px-4 text-center font-satoshi text-[17px] font-bold text-white"
          />

          <Icon
            name="Check"
            size={18}
            color="rgba(255,255,255,0.7)"
            className="h-11 w-11 items-center justify-center rounded-full border border-white/15"
            accessibilityLabel={t('profile.saveName')}
            onPress={onSave}
          />
        </View>
      ) : (
        <View className="flex-row items-center gap-1">
          <View className="w-11" />

          <Text numberOfLines={1} className="!text-2xl font-bold">
            {displayName}
          </Text>

          <Icon
            name="Pencil"
            size={14}
            color="rgba(255,255,255,0.5)"
            className="h-11 w-11 items-center justify-center"
            accessibilityLabel={t('profile.editName')}
            onPress={() => {
              setDraft(hasCustomName(name) ? name : '');
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
    <Text
      className="px-2 !text-[12px] font-semibold !text-neutral-400"
      style={{ letterSpacing: 1.2 }}>
      {title.toLocaleUpperCase()}
    </Text>

    <View
      className="rounded-3xl border px-4"
      style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
      {children}
    </View>
  </View>
);

interface SettingsRowProps {
  icon: IconName;
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
        <Icon name={icon} size={16} color={destructive ? '#f87171' : 'rgba(255,255,255,0.7)'} />
      </View>

      <Text className={`flex-1 !text-[15px] font-medium ${destructive ? '!text-red-400' : ''}`}>
        {label}
      </Text>

      {meta ? <Text className="!text-[13px] !text-neutral-400">{meta}</Text> : null}

      {showChevron && <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.35)" />}
    </Pressable>
  );
};

const ProfileScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslate();

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const savedItems = useMyListStore((state) => state.items);
  const clearSavedItems = useMyListStore((state) => state.clearAll);
  const viewed = useViewedMediaStore((state) => state.viewed);
  const clearViewed = useViewedMediaStore((state) => state.clearViewed);
  const searches = useRecentSearchesStore((state) => state.searches);
  const clearSearches = useRecentSearchesStore((state) => state.clearSearches);

  const viewedCount = viewed.length;
  const version = Constants.expoConfig?.version;
  const activeLanguage =
    LANGUAGES.find((item) => language.startsWith(item.code))?.label ?? LANGUAGES[0].label;

  const placeholder = () => Haptics.selectionAsync();

  const chooseLanguage = () =>
    Alert.alert(t('profile.language'), t('profile.chooseLanguage'), [
      ...LANGUAGES.map((item) => ({
        text: item.label,
        onPress: () => {
          Haptics.selectionAsync();
          setLanguage(item.code);
        },
      })),
      { text: t('common.cancel'), style: 'cancel' as const },
    ]);

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
        <Animated.View entering={FadeIn.duration(300).easing(EASE_OUT)} className="px-4">
          <View className="pb-4">
            <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
              {t('profile.title')}
            </Text>
          </View>

          <ProfileHeader />

          <SettingsGroup title={t('profile.groups.preferences')}>
            <SettingsRow
              icon="Languages"
              label={t('profile.language')}
              meta={activeLanguage}
              onPress={chooseLanguage}
            />

            <SettingsRow
              icon="Bell"
              label={t('profile.notifications')}
              meta={t('profile.soon')}
              showChevron={false}
              onPress={placeholder}
            />

            <SettingsRow
              icon="Moon"
              label={t('profile.appearance')}
              meta={t('profile.dark')}
              showChevron={false}
              onPress={placeholder}
            />

            <SettingsRow
              icon="Play"
              label={t('profile.autoplayTrailers')}
              meta={t('profile.soon')}
              showChevron={false}
              onPress={placeholder}
              isLast
            />
          </SettingsGroup>

          <SettingsGroup title={t('profile.groups.data')}>
            <SettingsRow
              icon="History"
              label={t('profile.clearSearchHistory')}
              meta={searches.length ? `${searches.length}` : undefined}
              onPress={() =>
                confirmClear(
                  t('profile.clearSearchHistory'),
                  t('profile.clearSearchHistoryMessage'),
                  clearSearches
                )
              }
            />

            <SettingsRow
              icon="EyeOff"
              label={t('profile.clearRecentlyViewed')}
              meta={viewedCount ? `${viewedCount}` : undefined}
              onPress={() =>
                confirmClear(
                  t('profile.clearRecentlyViewed'),
                  t('profile.clearRecentlyViewedMessage'),
                  clearViewed
                )
              }
            />

            <SettingsRow
              icon="BookmarkX"
              label={t('profile.clearMyList')}
              meta={savedItems.length ? `${savedItems.length}` : undefined}
              onPress={() =>
                confirmClear(
                  t('profile.clearMyList'),
                  t('profile.clearMyListMessage'),
                  clearSavedItems
                )
              }
            />

            <SettingsRow
              icon="Trash2"
              label={t('profile.eraseAll')}
              destructive
              onPress={() =>
                confirmClear(t('profile.eraseAll'), t('profile.eraseAllMessage'), () => {
                  clearSearches();
                  clearViewed();
                  clearSavedItems();
                })
              }
              isLast
            />
          </SettingsGroup>

          <SettingsGroup title={t('profile.groups.about')}>
            <SettingsRow
              icon="Clapperboard"
              label={t('common.poweredByTmdb')}
              onPress={() => Linking.openURL('https://www.themoviedb.org/')}
            />

            <SettingsRow
              icon="MessageSquare"
              label={t('profile.sendFeedback')}
              meta={t('profile.soon')}
              showChevron={false}
              onPress={placeholder}
            />

            <SettingsRow
              icon="Shield"
              label={t('profile.privacyPolicy')}
              meta={t('profile.soon')}
              showChevron={false}
              onPress={placeholder}
              isLast
            />
          </SettingsGroup>

          <View className="items-center pt-1">
            {version && (
              <Text className="!text-[11px] !text-neutral-400">
                {t('profile.version', { version })}
              </Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
