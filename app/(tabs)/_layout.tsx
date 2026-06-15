import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, spacing } from '@/theme';

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return <Text style={{ fontSize: 22, color }}>{icon}</Text>;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface1,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingTop: spacing.xs,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
        tabBarLabelStyle: { fontSize: fontSize.xs },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="haberler"
        options={{
          title: 'Haberler',
          tabBarIcon: ({ color }) => <TabIcon icon="📰" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rehber"
        options={{
          title: 'Rehber',
          tabBarIcon: ({ color }) => <TabIcon icon="🧭" color={color} />,
        }}
      />
      <Tabs.Screen
        name="araclar"
        options={{
          title: 'Araçlar',
          tabBarIcon: ({ color }) => <TabIcon icon="🛠️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="daha-fazla"
        options={{
          title: 'Daha Fazla',
          tabBarIcon: ({ color }) => <TabIcon icon="⋯" color={color} />,
        }}
      />
    </Tabs>
  );
}
