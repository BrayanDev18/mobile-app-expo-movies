import { Screen, Text } from '@/components';
import { View } from 'react-native';

const TvShowsHome = () => {
  return (
    <Screen canGoBack>
      <View className="h-full items-center justify-center">
        <Text>Tv shows</Text>
      </View>
    </Screen>
  );
};

export default TvShowsHome;
