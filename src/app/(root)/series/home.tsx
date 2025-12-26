import { Screen, Text } from '@/components';
import { View } from 'react-native';

const SeriesHome = () => {
  return (
    <Screen canGoBack>
      <View className="h-full items-center justify-center">
        <Text>Series</Text>
      </View>
    </Screen>
  );
};

export default SeriesHome;
