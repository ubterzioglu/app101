import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard } from '@/components/ui';
import { TOOL_LINKS } from '@/constants/navigation';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/logoandroid.png')}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityLabel="almanya101 logosu"
          />
        </View>

        <Text style={styles.sectionTitle}>Araçlar</Text>
        <Text style={styles.sectionText}>
          Hesaplama, karşılaştırma ve karar destek araçlarına buradan doğrudan ulaşın.
        </Text>
        <View style={styles.grid}>
          {TOOL_LINKS.map((tool) => (
            <AppCard
              key={tool.key}
              style={styles.toolCard}
              accessibilityLabel={tool.label}
              onPress={() => router.push(tool.href as never)}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 144,
    height: 144,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  sectionText: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  toolCard: {
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 132,
    paddingVertical: spacing.lg,
  },
  toolIcon: { fontSize: 30, marginBottom: spacing.sm },
  toolLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
