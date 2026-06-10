import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { RecommendationTool } from '@/components/tools/RecommendationTool';
import { bankConfig } from '@/features/recommendations/bank/config';
import { colors } from '@/theme';

export default function BankSelectionScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Banka Seçim Aracı" showBack />
      <RecommendationTool config={bankConfig} accentColor={colors.blue} />
    </ScreenContainer>
  );
}
