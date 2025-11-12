import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarStyle: {
          position: 'absolute',
          borderWidth: 0,
          borderColor: 'transparent',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            style={{
              ...StyleSheet.absoluteFillObject,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}
          />
        ),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="home-filled" size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialIcons name="manage-search" size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="myList"
        options={{
          title: 'My list',
          tabBarIcon: ({ color }) => <Ionicons name="bookmark-outline" size={25} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999',
  },
  tabBarContainer: {
    borderRadius: 25,
  },
});
