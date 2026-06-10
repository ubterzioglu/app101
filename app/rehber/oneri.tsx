import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppSelect, AppTextInput } from '@/components/ui';
import {
  SUGGESTION_ALLOWED_TYPES,
  SUGGESTION_TYPE_LABELS,
  providerSuggestionSchema,
} from '@/features/providers/suggestion-schema';
import { submitProviderSuggestion } from '@/lib/api-client';
import { useNetwork } from '@/providers/NetworkProvider';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

const TYPE_OPTIONS = SUGGESTION_ALLOWED_TYPES.map((t) => ({
  value: t,
  label: SUGGESTION_TYPE_LABELS[t],
}));

export default function SuggestionScreen() {
  const { isOnline } = useNetwork();
  const [form, setForm] = useState({
    type: '',
    displayName: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    tagLabels: '',
    googleMapsUrl: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    if (!isOnline) {
      Alert.alert('İnternet yok', 'Hizmet önerisi göndermek için internet bağlantısı gerekir.');
      return;
    }

    const parsed = providerSuggestionSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await submitProviderSuggestion(parsed.data);
      Alert.alert('Teşekkürler', res.message ?? 'Öneriniz alındı. Admin onayından sonra yayına alınacak.');
      setForm({
        type: '',
        displayName: '',
        city: '',
        address: '',
        phone: '',
        website: '',
        tagLabels: '',
        googleMapsUrl: '',
        note: '',
      });
    } catch (err) {
      Alert.alert('Gönderilemedi', err instanceof Error ? err.message : 'İşlem tamamlanamadı.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Hizmet Öner" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.introText}>
            Önerdiğiniz hizmet, admin onayından sonra yayına alınır.
          </Text>
        </View>

        <AppSelect
          label="Tür"
          required
          placeholder="Hizmet türü seçin"
          value={form.type}
          options={TYPE_OPTIONS}
          onChange={(v) => set('type', v)}
        />
        {errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}

        <AppTextInput
          label="Görünen Ad"
          required
          value={form.displayName}
          onChangeText={(v) => set('displayName', v)}
          error={errors.displayName}
        />
        <AppTextInput
          label="Şehir"
          required
          value={form.city}
          onChangeText={(v) => set('city', v)}
          error={errors.city}
        />
        <AppTextInput label="Adres" value={form.address} onChangeText={(v) => set('address', v)} />
        <AppTextInput
          label="Telefon"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => set('phone', v)}
        />
        <AppTextInput
          label="Website"
          autoCapitalize="none"
          keyboardType="url"
          value={form.website}
          onChangeText={(v) => set('website', v)}
        />
        <AppTextInput label="Etiketler" value={form.tagLabels} onChangeText={(v) => set('tagLabels', v)} />
        <AppTextInput
          label="Google Maps URL"
          autoCapitalize="none"
          keyboardType="url"
          value={form.googleMapsUrl}
          onChangeText={(v) => set('googleMapsUrl', v)}
        />
        <AppTextInput
          label="Not"
          multiline
          numberOfLines={4}
          value={form.note}
          onChangeText={(v) => set('note', v)}
          style={styles.textarea}
        />

        <View style={styles.submit}>
          <AppButton label="Gönder" onPress={onSubmit} loading={submitting} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  intro: {
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  introText: { fontSize: fontSize.sm, color: colors.gray600 },
  error: { color: colors.red, fontSize: fontSize.xs, marginTop: -spacing.sm, marginBottom: spacing.sm },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  submit: { marginTop: spacing.lg },
});
