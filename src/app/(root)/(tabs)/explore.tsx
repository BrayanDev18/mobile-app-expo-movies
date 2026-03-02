import { Input, Screen, Text } from '@/components';
import { useForm } from 'react-hook-form';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const GENRES = ['All', 'Films', 'Series', 'Docs', 'Anime'];

const FEATURED = [
  { id: '1', title: 'Oppenheimer', year: '2023', duration: '3h 1m', score: '8.9', bg: '#1C1C1E' },
  { id: '2', title: 'The Bear', year: '2024', duration: '45m', score: '8.7', bg: '#2C2C2E' },
  { id: '3', title: 'Shogun', year: '2024', duration: '1h', score: '9.0', bg: '#3A3A3C' },
];

const ROWS = [
  {
    label: 'A',
    title: 'Dune: Part Two',
    meta: '2024 · Sci-Fi · 2h 47m',
    score: '8.8',
    thumb: '#1a1a3a',
  },
  { label: 'B', title: 'Severance', meta: '2024 · Thriller · S2', score: '9.0', thumb: '#1a2a3a' },
  {
    label: 'C',
    title: 'True Detective',
    meta: '2024 · Crime · S4',
    score: '7.9',
    thumb: '#2a1a2a',
  },
  { label: 'D', title: 'Fallout', meta: '2024 · Action · S1', score: '8.5', thumb: '#1a2a1a' },
  { label: 'E', title: 'Shogun', meta: '2024 · Drama · S1', score: '9.0', thumb: '#3a2a1a' },
];

const ExploreScreen = () => {
  const { control } = useForm({
    defaultValues: { search: '' },
  });

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <View className="h-full pb-10">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}>
          <View className="px-6 pb-6 pt-4">
            <Text
              className="mb-1 !text-[11px] font-semibold text-[#999]"
              style={{ letterSpacing: 3, textTransform: 'uppercase' }}>
              Discover
            </Text>
            <Text
              className="!text-[34px] font-black"
              style={{ lineHeight: 38, letterSpacing: -1.5 }}>
              What would you{'\n'}like to watch?
            </Text>
          </View>

          <View className="mb-6 px-6">
            <Input
              iconName="Search"
              name="search"
              control={control}
              placeholder="Search movies, series, docs…"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
            className="mb-8">
            {GENRES.map((g, i) => (
              <TouchableOpacity
                key={g}
                className="rounded-full px-5 py-2"
                style={{
                  backgroundColor: i === 0 ? '#0D0D0D' : 'transparent',
                  borderWidth: i === 0 ? 0 : 1,
                  borderColor: '#D8D7D3',
                }}>
                <Text
                  className="!text-[13px] font-semibold"
                  style={{ color: i === 0 ? '#fff' : '#666' }}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="mb-10">
            <View className="mb-4 flex-row items-center justify-between px-6">
              <Text
                className="!text-[11px] font-bold"
                style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
                Top Picks
              </Text>

              <TouchableOpacity>
                <Text className="!text-[12px] text-[#999]">See all →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
              {FEATURED.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="overflow-hidden rounded-2xl"
                  style={{ width: width * 0.52, height: 280, backgroundColor: item.bg }}>
                  <View
                    className="absolute right-3 top-3 flex-row items-center rounded-lg px-2 py-1"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Text className="!text-[11px] font-bold text-white">★ {item.score}</Text>
                  </View>

                  <View className="absolute bottom-0 left-0 right-0 p-4">
                    <View
                      className="mb-3 rounded-full"
                      style={{ height: 2, width: 32, backgroundColor: 'rgba(255,255,255,0.4)' }}
                    />
                    <Text
                      className="!text-[18px] font-black text-white"
                      style={{ letterSpacing: -0.5 }}
                      numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text className="mt-1 !text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {item.year} · {item.duration}
                    </Text>
                    <TouchableOpacity className="mt-3 self-start rounded-full bg-white px-3 py-1.5">
                      <Text className="!text-[11px] font-bold text-[#0D0D0D]">▶ Play</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="px-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text
                className="!text-[11px] font-bold"
                style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
                Trending
              </Text>
              <TouchableOpacity>
                <Text className="!text-[12px] text-[#999]">See all →</Text>
              </TouchableOpacity>
            </View>

            {ROWS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                className="flex-row items-center py-4"
                style={{
                  borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
                  borderBottomColor: '#E5E4E0',
                }}>
                <Text className="!text-[11px] font-black" style={{ width: 20, letterSpacing: 0.5 }}>
                  {item.label}
                </Text>

                <View
                  className="mr-4 overflow-hidden rounded-xl"
                  style={{ width: 52, height: 68, backgroundColor: item.thumb }}
                />

                <View className="flex-1">
                  <Text className="!text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
                    {item.title}
                  </Text>
                  <Text className="mt-0.5 !text-[11px] text-[#999]">{item.meta}</Text>
                </View>

                <View className="items-end" style={{ gap: 5 }}>
                  <Text className="!text-[13px] font-black">{item.score}</Text>
                  <View className="flex-row" style={{ gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <View
                        key={s}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            s <= Math.round((parseFloat(item.score) / 10) * 5) ? '#0D0D0D' : '#DDD',
                        }}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default ExploreScreen;
