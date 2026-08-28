import { Icon, Tab, Text } from '@/components';
import { clearDatabase } from '@/expo-sqlite/db';
import {
  useLanguageStore,
  useMyListStore,
  useProfileStore,
  useRecentSearchesStore,
  useViewedMoviesStore,
} from '@/stores';
import { getAvatarColor, tmdbResize } from '@/utils';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
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

const IdentityCard = () => {
  const { name, setName } = useProfileStore();
  const { saved } = useMyListStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const onSave = () => {
    Haptics.selectionAsync();
    setName(draft);
    setIsEditing(false);
  };

  return (
    <View
      className="flex-row items-center gap-4 rounded-3xl border p-4"
      style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 64, height: 64, backgroundColor: getAvatarColor(name) }}>
        <Text className="!text-[22px] font-black">{initialsOf(name)}</Text>
      </View>

      <View className="flex-1">
        {isEditing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={onSave}
            autoFocus
            maxLength={24}
            returnKeyType="done"
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            className="h-10 rounded-xl bg-white/10 px-3 font-satoshi text-[16px] font-bold text-white"
          />
        ) : (
          <>
            <Text numberOfLines={1} className="!text-xl font-bold">
              {name}
            </Text>

            <Text className="mt-0.5 !text-[12px] !text-neutral-400">
              {saved.length} {saved.length === 1 ? 'title' : 'titles'} in My List
            </Text>
          </>
        )}
      </View>

      <Icon
        name={isEditing ? 'Check' : 'Pencil'}
        size={18}
        color="rgba(255,255,255,0.7)"
        className="h-11 w-11 items-center justify-center rounded-full border border-white/15"
        onPress={() => {
          if (isEditing) {
            onSave();
          } else {
            setDraft(name);
            setIsEditing(true);
          }
        }}
      />
    </View>
  );
};

const StatTile = ({ value, label }: { value: number; label: string }) => (
  <View
    className="flex-1 items-center gap-0.5 rounded-2xl border py-4"
    style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
    <Text className="!text-[22px] font-black" style={{ letterSpacing: -0.5 }}>
      {value}
    </Text>

    <Text className="!text-[11px] !text-neutral-400">{label}</Text>
  </View>
);

interface DataRowProps {
  icon: keyof typeof LucideIcons;
  label: string;
  meta?: string;
  onPress: () => void;
  isLast?: boolean;
}

const DataRow = ({ icon, label, meta, onPress, isLast }: DataRowProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    className={`flex-row items-center gap-3 py-4 ${isLast ? '' : 'border-b border-white/10'}`}>
    <Icon name={icon} size={18} color="rgba(255,255,255,0.55)" />

    <Text className="flex-1 !text-[15px] font-medium">{label}</Text>

    {meta ? <Text className="!text-[12px] !text-neutral-400">{meta}</Text> : null}
  </Pressable>
);

const ProfileScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { language, setLanguage } = useLanguageStore();
  const { saved, clearSaved } = useMyListStore();
  const { viewed, clearViewed } = useViewedMoviesStore();
  const { searches, clearSearches } = useRecentSearchesStore();

  const backdrop = saved[0]?.poster;
  const recentViews = viewed.slice(0, 5);
  const version = Constants.expoConfig?.version;

  return (
    <View className="flex-1 bg-neutral-900">
      {backdrop && (
        <Image
          source={{ uri: tmdbResize(backdrop, 'w185') ?? undefined }}
          blurRadius={50}
          style={StyleSheet.absoluteFill}
        />
      )}

      {backdrop && (
        <LinearGradient
          colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)', 'rgba(6,6,6,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
        <Animated.View entering={FadeIn.duration(300)} className="px-4">
          <View className="pb-6">
            <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
              Profile
            </Text>
          </View>

          <View className="gap-3 pb-8">
            <IdentityCard />

            <View className="flex-row gap-3">
              <StatTile value={saved.length} label="Saved" />
              <StatTile value={viewed.length} label="Viewed" />
              <StatTile value={searches.length} label="Searches" />
            </View>
          </View>

          <View className="gap-3 pb-8">
            <Text className="px-1 !text-[18px] font-semibold">Language</Text>

            <View className="flex-row gap-2">
              {LANGUAGES.map((item) => (
                <Tab
                  key={item.code}
                  title={item.label}
                  isActive={language.startsWith(item.code)}
                  adaptableWidth
                  className="rounded-full border border-white/15"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setLanguage(item.code);
                  }}
                />
              ))}
            </View>
          </View>

          {recentViews.length > 0 && (
            <View className="gap-3 pb-8">
              <Text className="px-1 !text-[18px] font-semibold">Recently viewed</Text>

              <View>
                {recentViews.map((item, index) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`View details for ${item.title}`}
                    className={`flex-row items-center gap-3 py-3.5 ${
                      index < recentViews.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                    onPress={() =>
                      router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } })
                    }>
                    <Icon name="Clock" size={16} color="rgba(255,255,255,0.4)" />

                    <Text numberOfLines={1} className="flex-1 !text-[15px] font-medium">
                      {item.title}
                    </Text>

                    <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.4)" />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View className="gap-3 pb-8">
            <Text className="px-1 !text-[18px] font-semibold">Manage data</Text>

            <View>
              {searches.length > 0 && (
                <DataRow
                  icon="History"
                  label="Clear search history"
                  meta={`${searches.length}`}
                  onPress={() =>
                    confirmClear(
                      'Clear search history',
                      'Your recent searches will be removed.',
                      clearSearches
                    )
                  }
                />
              )}

              {viewed.length > 0 && (
                <DataRow
                  icon="EyeOff"
                  label="Clear recently viewed"
                  meta={`${viewed.length}`}
                  onPress={() =>
                    confirmClear(
                      'Clear recently viewed',
                      'Your viewing history will be removed.',
                      clearViewed
                    )
                  }
                />
              )}

              {saved.length > 0 && (
                <DataRow
                  icon="BookmarkX"
                  label="Remove all saved titles"
                  meta={`${saved.length}`}
                  onPress={() =>
                    confirmClear(
                      'Remove all saved titles',
                      'Everything in My List will be removed.',
                      clearSaved
                    )
                  }
                />
              )}

              <DataRow
                icon="Trash2"
                label="Clear database"
                onPress={() =>
                  confirmClear(
                    'Clear database',
                    'Removes all local data permanently.',
                    clearDatabase
                  )
                }
                isLast
              />
            </View>
          </View>

          <View className="items-center gap-1 pt-2">
            {version && (
              <Text className="!text-[11px] !text-neutral-400">Flixora v{version}</Text>
            )}

            <Text className="!text-[11px] !text-neutral-400">Powered by TMDB</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
