import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ProviderActions } from '@/components/providers/ProviderActions';
import { AppButton, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { useProvider } from '@/features/providers/hooks';
import { PROVIDER_CATEGORIES } from '@/features/providers/types';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const idValue = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: provider, isLoading, isError, refetch } = useProvider(idValue);

  const category = provider ? PROVIDER_CATEGORIES.find((c) => c.id === provider.type) : undefined;

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Hizmet" showBack />
        <View style={styles.padded}>
          <LoadingCard showImage={false} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Hizmet" showBack />
        <ErrorState message="Hizmet bilgisi yüklenemedi." onRetry={() => refetch()} />
      </ScreenContainer>
    );
  }

  if (!provider) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Hizmet" showBack />
        <EmptyState title="Hizmet bulunamadı" message="Bu kayıt artık yayında değil." icon="🔍" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Hizmet" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.icon}>{category?.icon ?? '📍'}</Text>
        <Text style={styles.name}>{provider.name || 'İsimsiz'}</Text>
        <Text style={styles.category}>
          {category?.label ?? provider.type} · {provider.city}
        </Text>

        {provider.address ? (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Adres</Text>
            <Text style={styles.fieldValue}>{provider.address}</Text>
          </View>
        ) : null}

        {provider.description ? (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Açıklama</Text>
            <Text style={styles.fieldValue}>{provider.description}</Text>
          </View>
        ) : null}

        <ProviderActions provider={provider} />

        <View style={styles.suggest}>
          <AppButton
            label="Yeni hizmet öner"
            variant="outline"
            onPress={() => router.push('/rehber/oneri')}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { padding: spacing.lg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  icon: { fontSize: 44, textAlign: 'center', marginBottom: spacing.sm },
  name: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary, textAlign: 'center' },
  category: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  field: { marginTop: spacing.lg },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
  fieldValue: { fontSize: fontSize.md, color: colors.textPrimary, marginTop: spacing.xs },
  suggest: { marginTop: spacing.xl },
});
