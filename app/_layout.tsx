import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/providers/AppProviders';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.gray50 },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" options={{ headerShown: true, title: 'Bulunamadı' }} />
        </Stack>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
