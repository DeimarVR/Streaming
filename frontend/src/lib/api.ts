const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

let token: string | null = null;
try {
  token = localStorage.getItem('av_token');
} catch {
  /* storage no disponible */
}

export function setToken(t: string | null) {
  token = t;
  try {
    if (t) localStorage.setItem('av_token', t);
    else localStorage.removeItem('av_token');
  } catch {
    /* storage no disponible */
  }
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}
