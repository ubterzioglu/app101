import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui';

// Faz 1 placeholder. Replaced with the live news list in Faz 3.
export default function HaberlerScreen() {
  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Haberler" />
      <EmptyState title="Haberler yükleniyor" message="Bu ekran yakında güncel haberlerle dolacak." icon="📰" />
    </ScreenContainer>
  );
}
