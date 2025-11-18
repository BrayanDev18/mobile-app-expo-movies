import { Button, Screen } from '@/components';
import { clearDatabase } from '@/expo-sqlite/db';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

const ProfileScreen = () => {
  return (
    <Screen>
      <View className="h-full items-center justify-center p-8">
        <LinearGradient
          colors={['#68BEF1', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 50, width: '100%', borderRadius: 50 }}>
          <Button title="Clear DB" className="w-full" onPress={clearDatabase} />
        </LinearGradient>
      </View>
    </Screen>
  );
};

export default ProfileScreen;
