import { EXTERNAL_LINKS } from './external-links';
import { colors } from '@/theme';

export interface QuickAction {
  key: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}

// Home "Hızlı Başlangıç" cards (plan §12.1).
export const QUICK_ACTIONS: QuickAction[] = [
  { key: 'salary', label: 'Maaşımı Hesapla', icon: '💶', href: '/araclar/maas-hesaplama', color: colors.accent },
  { key: 'citizenship', label: 'Vatandaşlık Testi', icon: '🇩🇪', href: '/araclar/vatandaslik-testi', color: colors.error },
  { key: 'rehber', label: 'Türkçe Hizmet Bul', icon: '🧭', href: '/(tabs)/rehber', color: colors.success },
  { key: 'news', label: 'Haberleri Oku', icon: '📰', href: '/(tabs)/haberler', color: colors.yellow },
];

export interface ToolLink {
  key: string;
  label: string;
  icon: string;
  href: string;
  phase: 'p0' | 'p1';
}

// Tool center entries (plan §3.2 G / §3.3). P0 are in the first APK.
export const TOOL_LINKS: ToolLink[] = [
  { key: 'citizenship', label: 'Vatandaşlık Testi', icon: '🇩🇪', href: '/araclar/vatandaslik-testi', phase: 'p0' },
  { key: 'salary', label: 'Maaş Hesaplayıcı (Beta)', icon: '💶', href: '/araclar/maas-hesaplama', phase: 'p0' },
  { key: 'jobs', label: 'İş İlanları', icon: '💼', href: '/is-ilanlari', phase: 'p0' },
  { key: 'bank', label: 'Banka Seçim Aracı', icon: '🏦', href: '/araclar/banka-secim', phase: 'p1' },
  { key: 'insurance', label: 'Sigorta Seçim Aracı', icon: '🛡️', href: '/araclar/sigorta-secim', phase: 'p1' },
  { key: 'transfer', label: 'Para Transferi Aracı', icon: '💸', href: '/araclar/para-transferi', phase: 'p1' },
  { key: 'visa', label: 'Vize Seçim Aracı', icon: '🛂', href: '/araclar/vize-secim', phase: 'p1' },
  { key: 'holiday-tr', label: 'Tatil Planlayıcı Türkiye', icon: '🏖️', href: '/araclar/tatil-turkiye', phase: 'p1' },
  { key: 'holiday-de', label: 'Tatil Planlayıcı Almanya', icon: '🏔️', href: '/araclar/tatil-almanya', phase: 'p1' },
  { key: 'stepstone', label: 'StepStone Karşılaştırma', icon: '📊', href: '/araclar/stepstone-karsilastirma', phase: 'p1' },
];

export interface DiscoverLink {
  key: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  accentColor: string;
}

// Public discovery links ported from last101 home surface.
export const DISCOVER_LINKS: DiscoverLink[] = [
  {
    key: 'documents',
    label: 'Yararlı Belgeler',
    description: 'Almanya ve Türkiye işlemleri için resmi belge kataloğu.',
    icon: '📄',
    href: '/belgeler',
    accentColor: colors.yellow,
  },
  {
    key: 'community',
    label: 'Topluluğa Katıl',
    description: 'WhatsApp, Telegram ve iletişim kanallarıyla topluluğa bağlanın.',
    icon: '🤝',
    href: '/topluluk',
    accentColor: colors.success,
  },
  {
    key: 'life',
    label: "Almanya'da Yaşam",
    description: 'İkamet, sağlık ve dil başlıklarında temel yaşam rehberi.',
    icon: '🏙️',
    href: '/almanyada-yasam',
    accentColor: colors.accent,
  },
  {
    key: 'join',
    label: 'Ekibimize Katıl',
    description: 'Gönüllü katkı ve topluluk desteği için bize ulaşın.',
    icon: '🚀',
    href: '/ekibimize-katil',
    accentColor: colors.error,
  },
  {
    key: 'holiday-hub',
    label: 'Tatil Planlayıcı',
    description: 'Almanya ve Türkiye tatil araçlarına tek ekrandan geçin.',
    icon: '🗓️',
    href: '/tatil',
    accentColor: colors.warning,
  },
];

export interface MoreLink {
  key: string;
  label: string;
  icon: string;
  href?: string;
  external?: string;
}

// "Daha Fazla" menu entries (plan §3.2 H).
export const MORE_LINKS: MoreLink[] = [
  { key: 'corner', label: 'Arkadaşın Köşesi', icon: '✍️', href: '/yazi-dizisi' },
  { key: 'docs', label: 'Yararlı Belgeler', icon: '📄', href: '/belgeler' },
  { key: 'community', label: 'Topluluk', icon: '🤝', href: '/topluluk' },
  { key: 'life', label: "Almanya'da Yaşam", icon: '🏙️', href: '/almanyada-yasam' },
  { key: 'holiday', label: 'Tatil Planlayıcı', icon: '🗓️', href: '/tatil' },
  { key: 'join', label: 'Ekibimize Katıl', icon: '🚀', href: '/ekibimize-katil' },
  { key: 'about', label: 'Hakkımızda', icon: 'ℹ️', href: '/hakkimizda' },
  { key: 'contact', label: 'İletişim', icon: '✉️', href: '/iletisim' },
  { key: 'privacy', label: 'Gizlilik Politikası', icon: '🔒', href: '/gizlilik' },
  { key: 'website', label: 'Web Sitesini Aç', icon: '🌐', external: EXTERNAL_LINKS.website },
];
