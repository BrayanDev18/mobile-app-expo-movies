import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const HomeTabsLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#171717', borderTopColor: 'black' },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="home-filled" size={28} color={'white'} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: () => <MaterialIcons name="manage-search" size={28} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="myList"
        options={{
          title: 'My list',
          tabBarIcon: () => <MaterialIcons name="bookmark" size={28} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <MaterialIcons name="person-pin" size={28} color={'white'} />,
        }}
      />
    </Tabs>
  );
};

export default HomeTabsLayout;
