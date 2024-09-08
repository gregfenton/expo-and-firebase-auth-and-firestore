import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {AuthProvider} from '@/providers/AuthProvider';
import {FirebaseProvider} from '@/providers/FirebaseProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FirebaseProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </FirebaseProvider>
  );
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="+not-found" />

        {/* Once logged in we see these */}
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />

        {/* Initial page loaded by app */}
        <Stack.Screen name="landing" options={{headerShown: false}} />

        {/* Landing page sends to one of these */}
        <Stack.Screen name="login" options={{presentation: 'modal'}} />
        <Stack.Screen name="register" options={{presentation: 'modal'}} />

        {/* Called to by header icon in (tabs)/_layout.tsx */}
        <Stack.Screen name="modal" options={{presentation: 'modal'}} />
      </Stack>
    </ThemeProvider>
  );
};
