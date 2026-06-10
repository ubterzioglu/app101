import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui';

// Faz 1 placeholder. Replaced with the live provider directory in Faz 4.
export default function RehberScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Hizmet Rehberi" />
      <EmptyState title="Rehber hazırlanıyor" message="Türkçe hizmet veren uzmanlar yakında burada listelenecek." icon="🧭" />
    </ScreenContainer>
  );
}
