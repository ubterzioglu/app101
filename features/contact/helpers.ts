import type { ContactChannel } from '@/constants/contact-channels';
import { toMailtoUrl, toPhoneUrl, toSafeExternalUrl } from '@/lib/urls';

export function getContactChannelTarget(channel: ContactChannel): string | null {
  switch (channel.kind) {
    case 'external':
      return toSafeExternalUrl(channel.value);
    case 'phone':
      return toPhoneUrl(channel.value);
    case 'email':
      return toMailtoUrl(channel.value);
    default:
      return null;
  }
}

export function getVisibleContactChannels(channels: readonly ContactChannel[]): ContactChannel[] {
  return channels.filter((channel) => Boolean(getContactChannelTarget(channel)));
}
