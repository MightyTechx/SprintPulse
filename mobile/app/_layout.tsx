import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { theme } from '../src/theme';
import { AppTypeProvider } from '../src/context/AppTypeContext';
import '../src/utils/gesture-lib';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AppTypeProvider>
            <StatusBar style='light' />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#0A1628' },
              }}
            >
              <Stack.Screen name='index' options={{ headerShown: false }} />
              <Stack.Screen name='(ptw)' options={{ headerShown: false }} />
              <Stack.Screen name='(maintenance)' options={{ headerShown: false }} />
              <Stack.Screen name='auth' options={{ headerShown: false }} />
            </Stack>
          </AppTypeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}