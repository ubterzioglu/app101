import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { colors, fontSize } from '@/theme';

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return <Text style={{ fontSize: 22, color }}>{icon}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface1,
          borderTopColor: colors.border,
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
