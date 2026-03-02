import { Screen, Text } from '@/components';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const FILTERS = ['All', 'Movies', 'Series', 'Docs'];

const MY_LIST = [
  {
    id: '1',
    title: 'Interstellar',
    meta: '2014 · Sci-Fi · 2h 49m',
    score: '8.7',
    progress: null,
    thumb: '#0d1b2a',
  },
  {
    id: '2',
    title: 'Severance',
    meta: '2024 · Thriller · S2 E5',
    score: '9.0',
    progress: 0.62,
    thumb: '#1a1a2e',
  },
  {
    id: '3',
    title: 'The Brutalist',
    meta: '2024 · Drama · 3h 35m',
    score: '7.8',
    progress: null,
    thumb: '#1c1007',
  },
  {
    id: '4',
    title: 'True Detective',
    meta: '2024 · Crime · S4 E3',
    score: '7.9',
    progress: 0.35,
    thumb: '#1a0d1a',
  },
  {
    id: '5',
    title: 'Dune: Part Two',
    meta: '2024 · Sci-Fi · 2h 47m',
    score: '8.8',
    progress: 1.0,
    thumb: '#12100a',
  },
  {
    id: '6',
    title: 'Shogun',
    meta: '2024 · Drama · S1 E8',
    score: '9.0',
    progress: 0.8,
    thumb: '#0d1a12',
  },
  {
    id: '7',
    title: 'Ripley',
    meta: '2024 · Thriller · S1',
    score: '8.0',
    progress: null,
    thumb: '#1a1616',
  },
];

const STATS = [
  { value: '7', label: 'Saved' },
  { value: '3', label: 'Watching' },
  { value: '1', label: 'Finished' },
];

const MyListScreen = () => {
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
              Library
            </Text>
            <Text
              className="!text-[34px] font-black"
              style={{ lineHeight: 38, letterSpacing: -1.5 }}>
              My List
            </Text>
          </View>

          <View
            className="mx-6 mb-6 flex-row overflow-hidden rounded-2xl"
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
            className="mb-6">
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={f}
                className="rounded-full px-5 py-2"
                style={{
                  backgroundColor: i === 0 ? '#0D0D0D' : 'transparent',
                  borderWidth: i === 0 ? 0 : 1,
                  borderColor: '#D8D7D3',
                }}>
                <Text
                  className="!text-[13px] font-semibold"
                  style={{ color: i === 0 ? '#fff' : '#666' }}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="px-6">
            {MY_LIST.map((item, i) => {
              const isWatching = item.progress !== null && item.progress < 1;
              const isFinished = item.progress === 1.0;

              return (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row items-center py-4"
                  style={{
                    borderBottomWidth: i < MY_LIST.length - 1 ? 1 : 0,
                    borderBottomColor: '#E5E4E0',
                  }}>
                  <View
                    className="mr-4 overflow-hidden rounded-xl"
                    style={{ width: 52, height: 68, backgroundColor: item.thumb }}>
                    {isFinished && (
                      <View
                        className="absolute inset-0 items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <Text
                          className="!text-[10px] font-black text-white"
                          style={{ letterSpacing: 0.5 }}>
                          ✓
                        </Text>
                      </View>
                    )}

                    {isWatching && (
                      <View
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <View
                          style={{
                            height: 2,
                            width: `${(item.progress ?? 0) * 100}%`,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="!text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
                      {item.title}
                    </Text>
                    <Text className="mt-0.5 !text-[11px] text-[#999]">{item.meta}</Text>

                    {(isWatching || isFinished) && (
                      <View className="mt-1.5 self-start">
                        <Text
                          className="!text-[9px] font-bold"
                          style={{
                            letterSpacing: 1.2,
                            textTransform: 'uppercase',
                            // color: isFinished ? '#999' : '#0D0D0D',
                          }}>
                          {isFinished
                            ? 'Watched'
                            : `${Math.round((item.progress ?? 0) * 100)}% watched`}
                        </Text>
                      </View>
                    )}
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
                              s <= Math.round((parseFloat(item.score) / 10) * 5)
                                ? '#0D0D0D'
                                : '#DDD',
                          }}
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default MyListScreen;
