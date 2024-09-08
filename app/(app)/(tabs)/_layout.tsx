import {router, Tabs} from 'expo-router';
import React, {useEffect} from 'react';
import {Text} from 'react-native-paper';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useAuthContext} from '@/providers/AuthProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {authLoading, user} = useAuthContext();

  useEffect(() => {
    if (authLoading === false && user === null) {
      router.replace('/landing');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signout"
        options={{
          title: 'Sign Out',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
