import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppCard, EmptyState, ErrorState, LoadingCard } from '@/components/ui';
import { DOCUMENT_CATEGORIES } from '@/constants/document-catalog';
import { useStaticContent } from '@/features/content/hooks';
import { colors, fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

export default function DocumentsScreen() {
  const {
    data: categories,
    isLoading,
    isError,
    reload,
  } = useStaticContent(() => DOCUMENT_CATEGORIES, []);
  const categoryList = categories ?? [];
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!categoryList.length || Object.keys(openCategories).length > 0) return;
    setOpenCategories({ [categoryList[0].category]: true });
  }, [categoryList, openCategories]);

  if (isLoading) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yararlı Belgeler" showBack />
        <View style={styles.loading}>
          <LoadingCard showImage={false} lines={4} />
          <LoadingCard showImage={false} lines={4} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Yararlı Belgeler" showBack />
        <ErrorState message="Belge kataloğu yüklenemedi." onRetry={reload} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Yararlı Belgeler" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Almanya ve Türkiye işlemlerinde sık kullanılan resmî belgelerin özet kataloğu. Belge
          türlerine dokunarak ayrıntıları açabilirsiniz.
        </Text>
        {categoryList.length === 0 ? (
          <EmptyState
            title="Henüz belge yok"
            message="Belge kataloğu güncellenirken tekrar deneyin."
            icon="📄"
          />
        ) : (
          <View style={styles.list}>
            {categoryList.map((category) => {
              const isOpen = Boolean(openCategories[category.category]);
              return (
                <AppCard key={category.category} style={styles.categoryCard}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${category.category} bölümünü ${isOpen ? 'daralt' : 'genişlet'}`}
                    onPress={() =>
                      setOpenCategories((current) => ({
                        ...current,
                        [category.category]: !current[category.category],
                      }))
                    }
                    style={styles.categoryHeader}
                  >
                    <View style={styles.categoryHeaderText}>
                      <Text style={styles.categoryTitle}>{category.category}</Text>
                      <Text style={styles.categoryMeta}>{category.documents.length} belge</Text>
                    </View>
                    <Text style={styles.chevron}>{isOpen ? '−' : '+'}</Text>
                  </Pressable>

                  {isOpen ? (
                    <View style={styles.documents}>
                      {category.documents.map((document) => (
                        <View key={`${category.category}-${document.name}`} style={styles.documentCard}>
                          <Text style={styles.documentTitle}>{document.name}</Text>
                          {document.officialName ? (
                            <Text style={styles.documentOfficial}>{document.officialName}</Text>
                          ) : null}
                          <DocumentField label="Amaç" value={document.purpose} />
                          <DocumentField label="Kimler" value={document.who} />
                          <DocumentField label="Gerekenler" value={document.supportingDocs} />
                          <DocumentField label="Makam" value={document.authority} />
                          <DocumentField label="Süre" value={document.duration} />
                          <DocumentField label="Ücret" value={document.cost} />
                          <DocumentField label="Not" value={document.note} highlight />
                        </View>
                      ))}
                    </View>
                  ) : null}
                </AppCard>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function DocumentField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <View style={[styles.field, highlight && styles.fieldHighlight]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={[styles.fieldValue, highlight && styles.fieldValueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  loading: { padding: spacing.lg },
  intro: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  list: { gap: spacing.md },
  categoryCard: { padding: 0, overflow: 'hidden' },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryHeaderText: { flex: 1, paddingRight: spacing.md },
  categoryTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  categoryMeta: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  chevron: { fontSize: fontSize.xl, color: colors.accent, fontWeight: fontWeight.bold },
  documents: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  documentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface0,
    padding: spacing.md,
    gap: spacing.sm,
  },
  documentTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  documentOfficial: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  field: {
    gap: spacing.xs,
  },
  fieldHighlight: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: `${colors.warning}12`,
  },
  fieldLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  fieldValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
  fieldValueHighlight: {
    color: colors.textPrimary,
  },
});
