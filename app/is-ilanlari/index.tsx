import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, AppSelect, AppTextInput, EmptyState } from '@/components/ui';
import {
  filterAgencies,
  getActiveAgencies,
  getCategories,
  getJobStats,
  getSubCategories,
} from '@/features/jobs/filter';
import { JOBS_ALL } from '@/features/jobs/types';
import { submitBrokenLinkReport } from '@/lib/api-client';
import { openExternalUrl } from '@/lib/urls';
import { useNetwork } from '@/providers/NetworkProvider';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

export default function JobsScreen() {
  const { isOnline } = useNetwork();
  const agencies = useMemo(() => getActiveAgencies(), []);
  const stats = useMemo(() => getJobStats(agencies), [agencies]);
  const categories = useMemo(() => getCategories(agencies), [agencies]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(JOBS_ALL);
  const [subCategory, setSubCategory] = useState(JOBS_ALL);

  const subCategories = useMemo(
    () => getSubCategories(agencies, category),
    [agencies, category]
  );

  const filtered = useMemo(
    () => filterAgencies(agencies, { query, category, subCategory }),
    [agencies, query, category, subCategory]
  );

  function reportBrokenLink(name: string) {
    if (!isOnline) {
      Alert.alert('İnternet yok', 'Bildirim göndermek için internet bağlantısı gerekir.');
      return;
    }
    Alert.alert('Kırık bağlantı bildir', `"${name}" için bağlantı çalışmıyor olarak bildirilsin mi?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Bildir',
        onPress: async () => {
          try {
            await submitBrokenLinkReport({ agencyName: name, reportText: 'Mobil uygulamadan kırık bağlantı bildirimi.' });
            Alert.alert('Teşekkürler', 'Bildiriminiz alındı.');
          } catch (err) {
            Alert.alert('Gönderilemedi', err instanceof Error ? err.message : 'İşlem tamamlanamadı.');
          }
        },
      },
    ]);
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="İş İlanları" showBack />
      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => `${item.name}-${idx}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Ajans</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.englishCompanies}</Text>
                <Text style={styles.statLabel}>İngilizce işe alan</Text>
              </View>
            </View>
            <AppTextInput placeholder="Ara..." value={query} onChangeText={setQuery} autoCorrect={false} />
            <AppSelect
              placeholder="Ana kategori"
              value={category}
              options={[{ label: 'Tüm kategoriler', value: JOBS_ALL }, ...categories.map((c) => ({ label: c, value: c }))]}
              onChange={(v) => {
                setCategory(v);
                setSubCategory(JOBS_ALL);
              }}
            />
            <AppSelect
              placeholder="Alt kategori"
              value={subCategory}
              options={[{ label: 'Tüm alt kategoriler', value: JOBS_ALL }, ...subCategories.map((c) => ({ label: c, value: c }))]}
              onChange={setSubCategory}
            />
          </View>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card} accessibilityLabel={item.name}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subCategory}>{item.subCategory}</Text>
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                style={styles.actionPrimary}
                onPress={() => openExternalUrl(item.url)}
              >
                <Text style={styles.actionPrimaryText}>Web Sitesi</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.actionSecondary}
                onPress={() => reportBrokenLink(item.name)}
              >
                <Text style={styles.actionSecondaryText}>Kırık bağlantı</Text>
              </Pressable>
            </View>
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="Sonuç bulunamadı" icon="💼" />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.accent },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  card: { marginBottom: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textPrimary },
  subCategory: { fontSize: fontSize.xs, color: colors.success, fontWeight: fontWeight.medium, marginTop: 2 },
  description: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionPrimary: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  actionPrimaryText: { color: colors.textInverse, fontWeight: fontWeight.semibold, fontSize: fontSize.sm },
  actionSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  actionSecondaryText: { color: colors.textSecondary, fontWeight: fontWeight.medium, fontSize: fontSize.sm },
});
