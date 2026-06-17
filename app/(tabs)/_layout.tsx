import { Tabs } from 'expo-router';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

function TabIcon({
  icon,
  color,
  focused,
}: {
  icon: string;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface1,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 66 + insets.bottom,
          paddingTop: spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          elevation: 16,
          shadowColor: colors.shadowColor,
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.semibold,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🏠" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="haberler"
        options={{
          title: 'Haberler',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📰" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rehber"
        options={{
          title: 'Rehber',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🧭" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="araclar"
        options={{
          title: 'Araçlar',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🛠️" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="daha-fazla"
        options={{
          title: 'Daha Fazla',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="⋯" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.accentSoft,
  },
  icon: {
    fontSize: 20,
  },
});
