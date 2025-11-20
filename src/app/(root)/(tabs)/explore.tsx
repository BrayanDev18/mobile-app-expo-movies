import { Input, Screen, Text } from '@/components';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

const ExploreScreen = () => {
  const { control } = useForm({
    defaultValues: {
      search: '',
    },
  });

  return (
    <Screen safeAreaEdges={['top']}>
      <View className="h-full gap-3 px-4">
        <Text className="!text-2xl font-bold">What&apos;d you like to watch today?</Text>

        <Input
          iconName="Search"
          name="search"
          control={control}
          placeholder="Search TV shows, movies & Videos"
        />
      </View>
    </Screen>
  );
};

export default ExploreScreen;
