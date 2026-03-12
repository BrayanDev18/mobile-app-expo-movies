import { Screen, Text } from '@/components';
import { View } from 'react-native';

const MyListScreen = () => {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <View>
        <Text>My list</Text>
      </View>
    </Screen>
  );
};

export default MyListScreen;
