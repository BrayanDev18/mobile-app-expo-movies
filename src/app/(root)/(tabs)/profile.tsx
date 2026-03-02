import { Button, Screen, Text } from '@/components';
import { clearDatabase } from '@/expo-sqlite/db';
import { View, ScrollView, TouchableOpacity } from 'react-native';

const STATS = [
  { value: '124', label: 'Watched' },
  { value: '7', label: 'My List' },
  { value: '340h', label: 'Total Time' },
];

const MENU_ITEMS = [
  { icon: '🎬', label: 'Watch History', meta: '124 titles' },
  { icon: '⭐', label: 'Ratings & Reviews', meta: '38 rated' },
  { icon: '🔔', label: 'Notifications', meta: 'On' },
  { icon: '🌐', label: 'Language', meta: 'English' },
  { icon: '📱', label: 'Playback Quality', meta: 'Auto' },
];

const ProfileScreen = () => {
  return (
    <Screen safeAreaEdges={['top']}>
      <View className="h-full">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}>
          <View className="px-6 pb-6 pt-4">
            <Text
              className="mb-1 !text-[11px] font-semibold text-[#999]"
              style={{ letterSpacing: 3, textTransform: 'uppercase' }}>
              Account
            </Text>
            <Text
              className="!text-[34px] font-black"
              style={{ lineHeight: 38, letterSpacing: -1.5 }}>
              My Profile
            </Text>
          </View>

          <View className="mb-6 flex-row items-center px-6" style={{ gap: 16 }}>
            {/* Avatar */}
            <View
              className="items-center justify-center rounded-2xl"
              style={{ width: 64, height: 64, backgroundColor: '#0D0D0D' }}>
              <Text className="!text-[26px]">👤</Text>
            </View>

            <View className="flex-1">
              <Text className="!text-[20px] font-black" style={{ letterSpacing: -0.5 }}>
                John Doe
              </Text>
              <Text className="mt-0.5 !text-[12px] text-[#999]">john@example.com</Text>
            </View>

            <TouchableOpacity
              className="rounded-full px-4 py-2"
              style={{ borderWidth: 1, borderColor: '#D8D7D3' }}>
              <Text className="!text-[12px] font-semibold text-[#666]">Edit</Text>
            </TouchableOpacity>
          </View>

          <View
            className="mx-6 mb-8 flex-row overflow-hidden rounded-2xl"
            style={{ backgroundColor: '#0D0D0D' }}>
            {STATS.map((s, i) => (
              <View
                key={s.label}
                className="flex-1 items-center py-4"
                style={{
                  borderRightWidth: i < STATS.length - 1 ? 1 : 0,
                  borderRightColor: 'rgba(255,255,255,0.08)',
                }}>
                <Text className="!text-[22px] font-black text-white" style={{ letterSpacing: -1 }}>
                  {s.value}
                </Text>
                <Text
                  className="!text-[10px] font-semibold text-[#666]"
                  style={{ letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          <View className="mb-8 px-6">
            <Text
              className="mb-4 !text-[11px] font-bold"
              style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
              Settings
            </Text>

            {MENU_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                className="flex-row items-center py-4"
                style={{
                  borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: '#E5E4E0',
                }}>
                <View
                  className="mr-4 items-center justify-center rounded-xl"
                  style={{ width: 40, height: 40, backgroundColor: '#ECEAE6' }}>
                  <Text className="!text-[16px]">{item.icon}</Text>
                </View>

                <Text className="flex-1 !text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
                  {item.label}
                </Text>

                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <Text className="!text-[12px] text-[#999]">{item.meta}</Text>
                  <Text className="!text-[12px] text-[#CCC]">›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="px-6">
            <Text
              className="mb-4 !text-[11px] font-bold"
              style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
              Database
            </Text>

            <TouchableOpacity
              className="overflow-hidden rounded-2xl"
              style={{ backgroundColor: '#0D0D0D' }}
              onPress={clearDatabase}>
              <View className="flex-row items-center justify-between px-5 py-4">
                <View>
                  <Text
                    className="!text-[15px] font-bold text-white"
                    style={{ letterSpacing: -0.3 }}>
                    Clear Database
                  </Text>
                  <Text className="mt-0.5 !text-[11px] text-[#666]">
                    Removes all local data permanently
                  </Text>
                </View>
                <View
                  className="items-center justify-center rounded-xl"
                  style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <Text className="!text-[14px]">🗑</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default ProfileScreen;
