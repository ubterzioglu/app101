import { colors } from '@/theme';

export type ContactChannelKind = 'external' | 'phone' | 'email';

export interface ContactChannel {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: ContactChannelKind;
  value: string;
  accentColor: string;
}

// Public contact channels ported from last101 for native mobile use.
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: '+90 530 240 4995',
    icon: '💬',
    kind: 'external',
    value: 'https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo',
    accentColor: colors.success,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    description: 'Anlık bildirimler',
    icon: '📣',
    kind: 'external',
    value: 'https://t.me/+UV4iuTECIIg0OWY0',
    accentColor: colors.accent,
  },
  {
    id: 'phone',
    label: 'Telefon',
    description: '+49 173 956 9429',
    icon: '📞',
    kind: 'phone',
    value: '+49 173 956 9429',
    accentColor: colors.yellow,
  },
  {
    id: 'email',
    label: 'E-Posta',
    description: 'info@almanya101.de',
    icon: '✉️',
    kind: 'email',
    value: 'info@almanya101.de',
    accentColor: colors.error,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: '@almanya101de',
    icon: '📸',
    kind: 'external',
    value: 'https://instagram.com/almanya101de',
    accentColor: colors.warning,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: '@almanya101de',
    icon: '▶️',
    kind: 'external',
    value: 'https://www.youtube.com/@almanya101de',
    accentColor: colors.error,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: '/in/ubterzioglu',
    icon: '💼',
    kind: 'external',
    value: 'https://www.linkedin.com/in/ubterzioglu',
    accentColor: colors.accent,
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    description: '@101Almanya46905',
    icon: '𝕏',
    kind: 'external',
    value: 'https://x.com/101Almanya46905',
    accentColor: colors.textPrimary,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: '/almanya101',
    icon: '📘',
    kind: 'external',
    value: 'https://www.facebook.com/almanya101/',
    accentColor: colors.accent,
  },
];
