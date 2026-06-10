import { env } from './env';

// Controlled-write API wrapper. The mobile app NEVER writes directly to
// Supabase with elevated keys; it calls the existing Next.js web endpoints
// which perform server-side validation (plan §14, §12.5, §12.8).

export interface ProviderSuggestionPayload {
  type: string;
  displayName: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  tagLabels?: string;
  googleMapsUrl?: string;
  note?: string;
}

export interface BrokenLinkPayload {
  agencyId?: string;
  agencyName: string;
  reportText: string;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${env.EXPO_PUBLIC_WEB_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    // Network-level failure (offline, DNS, timeout). User-friendly message;
    // raw error object is never surfaced to the UI (§17).
    throw new Error('İnternet bağlantısı kurulamadı. Lütfen tekrar deneyin.');
  }

  const data = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && data.error) ||
      'İşlem tamamlanamadı. Lütfen tekrar deneyin.';
    throw new Error(String(message));
  }

  return data as T;
}

export function submitProviderSuggestion(payload: ProviderSuggestionPayload) {
  return apiFetch<{ ok: true; message: string }>('/api/provider-submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function submitBrokenLinkReport(payload: BrokenLinkPayload) {
  return apiFetch<{ success: true }>('/api/broken-link-reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
