import { LinearGradient } from 'expo-linear-gradient';
import { Button, Screen, Text } from '@/components';

const ProfileScreen = () => {
  return (
    <Screen>
      <Text>Hola</Text>

      <LinearGradient
        colors={['#68BEF1', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 50, width: '100%', borderRadius: 50 }}>
        <Button title="Change theme" className="w-full" />
      </LinearGradient>
    </Screen>
  );
};

export default ProfileScreen;
