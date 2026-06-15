const WEBSITE_ORIGIN = 'https://almanya101.de';

export const EXTERNAL_LINKS = {
  website: WEBSITE_ORIGIN,
  privacyPolicy: `${WEBSITE_ORIGIN}/gizlilik`,
  contact: `${WEBSITE_ORIGIN}/iletisim`,
} as const;

export const SUPPORT_EMAIL = 'info@almanya101.de';

export function buildWebsiteUrl(path: `/${string}`): string {
  return `${EXTERNAL_LINKS.website}${path}`;
}
