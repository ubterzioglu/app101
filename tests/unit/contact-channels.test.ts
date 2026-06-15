import type { ContactChannel } from '@/constants/contact-channels';
import { getContactChannelTarget, getVisibleContactChannels } from '@/features/contact/helpers';

describe('contact channel helpers', () => {
  const baseChannels: ContactChannel[] = [
    {
      id: 'external-ok',
      label: 'Web',
      description: 'Açık web',
      icon: '🌐',
      kind: 'external',
      value: 'https://almanya101.de',
      accentColor: '#fff',
    },
    {
      id: 'email-ok',
      label: 'Mail',
      description: 'Mail',
      icon: '✉️',
      kind: 'email',
      value: 'info@almanya101.de',
      accentColor: '#fff',
    },
    {
      id: 'phone-ok',
      label: 'Telefon',
      description: 'Telefon',
      icon: '📞',
      kind: 'phone',
      value: '+49 30 1234 567',
      accentColor: '#fff',
    },
  ];

  it('builds safe targets for each contact channel kind', () => {
    expect(getContactChannelTarget(baseChannels[0])).toBe('https://almanya101.de/');
    expect(getContactChannelTarget(baseChannels[1])).toBe('mailto:info@almanya101.de');
    expect(getContactChannelTarget(baseChannels[2])).toBe('tel:+49301234567');
  });

  it('filters out invalid channel targets', () => {
    const channels: ContactChannel[] = [
      ...baseChannels,
      {
        id: 'bad-external',
        label: 'Kötü',
        description: 'Kötü',
        icon: '⚠️',
        kind: 'external',
        value: 'javascript:alert(1)',
        accentColor: '#fff',
      },
      {
        id: 'bad-email',
        label: 'Kötü mail',
        description: 'Kötü mail',
        icon: '⚠️',
        kind: 'email',
        value: 'not-an-email',
        accentColor: '#fff',
      },
    ];

    expect(getVisibleContactChannels(channels).map((item) => item.id)).toEqual([
      'external-ok',
      'email-ok',
      'phone-ok',
    ]);
  });
});
